import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AsanaClient } from "../client.js";

const workspaceArg = {
  workspace_gid: z.string().optional().describe("Workspace GID (defaults to first workspace)."),
};

function userMessage(text: string) {
  return { role: "user" as const, content: { type: "text" as const, text } };
}

function assistantPreamble(text: string) {
  return { role: "assistant" as const, content: { type: "text" as const, text } };
}

export function registerAsanaPrompts(server: McpServer, _client: AsanaClient) {
  server.registerPrompt(
    "daily_focus_plan",
    {
      title: "Daily focus plan",
      description: "Fetch your open tasks and produce a prioritized plan for today.",
      argsSchema: workspaceArg,
    },
    async ({ workspace_gid }) => {
      const ws = workspace_gid ?? "(default workspace)";
      return {
        messages: [
          userMessage(
            `Use asana_list_my_tasks with workspace_gid=${ws} and asana_search_tasks for overdue items. Build a prioritized daily plan: top 3 must-do, next 5, and defer list. Include due dates and project context.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "workspace_pulse",
    {
      title: "Workspace pulse",
      description: "High-level snapshot of workspace activity and open work.",
      argsSchema: workspaceArg,
    },
    async ({ workspace_gid }) => {
      const ws = workspace_gid ?? "(default workspace)";
      return {
        messages: [
          userMessage(
            `Use asana_list_workspaces, asana_list_projects, and asana_search_tasks (completed=false) for workspace ${ws}. Summarize: active projects count, open task volume, anything due this week.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "task_deep_dive",
    {
      title: "Task deep dive",
      description: "Full analysis of a single task with comments, subtasks, and blockers.",
      argsSchema: { task_gid: z.string().describe("Task GID.") },
    },
    async ({ task_gid }) => {
      return {
        messages: [
          userMessage(
            `For task ${task_gid}: call asana_get_task, asana_list_stories, asana_list_subtasks, asana_list_task_dependencies, asana_list_task_dependents, asana_list_task_tags. Produce a concise brief: status, blockers, missing info, recommended next action.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "ship_readiness_check",
    {
      title: "Ship readiness check",
      description: "Score whether a task is ready to ship (0–100) with gaps listed.",
      argsSchema: { task_gid: z.string().describe("Task GID.") },
    },
    async ({ task_gid }) => {
      return {
        messages: [
          assistantPreamble("I'll evaluate definition-of-done signals: description, assignee, due date, subtasks, dependencies, and recent activity."),
          userMessage(
            `Analyze task ${task_gid} using asana_get_task, asana_list_subtasks, asana_list_stories. Return a 0–100 readiness score, dimension breakdown, and concrete fixes.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "project_health_scan",
    {
      title: "Project health scan",
      description: "Scan a project for overdue, unassigned, and stale tasks.",
      argsSchema: { project_gid: z.string().describe("Project GID.") },
    },
    async ({ project_gid }) => {
      return {
        messages: [
          userMessage(
            `Use asana_get_project, asana_list_project_tasks, asana_list_project_sections for project ${project_gid}. Flag: overdue, no assignee, no description, blocked dependencies. Output a health score and top 5 fixes.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "stakeholder_brief",
    {
      title: "Stakeholder brief",
      description: "Executive-ready status update for a project.",
      argsSchema: { project_gid: z.string().describe("Project GID.") },
    },
    async ({ project_gid }) => {
      return {
        messages: [
          userMessage(
            `Gather data from asana_get_project and asana_list_project_tasks for ${project_gid}. Write a stakeholder brief: wins, in-progress, risks, next milestones. Tone: professional, suitable for email or Slack.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "backlog_prioritizer",
    {
      title: "Backlog prioritizer",
      description: "Rank incomplete tasks in a project by impact and urgency.",
      argsSchema: { project_gid: z.string().describe("Project GID.") },
    },
    async ({ project_gid }) => {
      return {
        messages: [
          userMessage(
            `List tasks via asana_list_project_tasks for project ${project_gid}. Prioritize incomplete items into P0/P1/P2 with rationale. Suggest what to defer or split.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "overdue_rescue",
    {
      title: "Overdue rescue",
      description: "Triage overdue tasks: do now, reschedule, reassign, or drop.",
      argsSchema: workspaceArg,
    },
    async ({ workspace_gid }) => {
      const ws = workspace_gid ?? "(default workspace)";
      return {
        messages: [
          userMessage(
            `Search workspace ${ws} with asana_search_tasks (assignee=me, completed=false). Identify overdue tasks from due_on. For each: recommend do-now, reschedule (suggest date), reassign, or drop. Offer to apply updates via asana_update_task if I confirm.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "comment_draft",
    {
      title: "Comment draft",
      description: "Draft a professional comment for a task based on context.",
      argsSchema: {
        task_gid: z.string(),
        intent: z.string().optional().describe("e.g. status update, question, blocker"),
      },
    },
    async ({ task_gid, intent }) => {
      return {
        messages: [
          userMessage(
            `Read task ${task_gid} with asana_get_task and asana_list_stories. Draft a comment for intent: ${intent ?? "status update"}. Show draft only; post with asana_add_comment if I approve.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "standup_builder",
    {
      title: "Standup builder",
      description: "Yesterday / today / blockers standup from your Asana tasks.",
      argsSchema: workspaceArg,
    },
    async ({ workspace_gid }) => {
      const ws = workspace_gid ?? "(default workspace)";
      return {
        messages: [
          userMessage(
            `Use asana_list_my_tasks and recent asana_search_tasks in workspace ${ws}. Build standup: Done since last standup, Doing today, Blockers. Keep each bullet one line.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "risk_radar",
    {
      title: "Risk radar",
      description: "Project risk register from task signals.",
      argsSchema: { project_gid: z.string() },
    },
    async ({ project_gid }) => {
      return {
        messages: [
          userMessage(
            `Scan project ${project_gid} with asana_list_project_tasks and dependency tools. Build a risk register: signal, severity (H/M/L), mitigation. Focus on overdue, dependencies, unassigned high-priority work.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "onboarding_snapshot",
    {
      title: "Onboarding snapshot",
      description: "Brief for someone new to a project.",
      argsSchema: { project_gid: z.string() },
    },
    async ({ project_gid }) => {
      return {
        messages: [
          userMessage(
            `Use asana_get_project, asana_list_project_sections, asana_list_project_tasks for ${project_gid}. Write an onboarding doc: purpose, structure, key people (assignees), active workstreams, where to start.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "subtask_architect",
    {
      title: "Subtask architect",
      description: "Break a complex task into well-scoped subtasks.",
      argsSchema: { task_gid: z.string() },
    },
    async ({ task_gid }) => {
      return {
        messages: [
          userMessage(
            `Read task ${task_gid}. Propose 3–8 subtasks with clear outcomes. After I approve, create them with asana_create_subtask under the parent.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "week_ahead_planner",
    {
      title: "Week ahead planner",
      description: "Plan the upcoming week from open tasks and due dates.",
      argsSchema: workspaceArg,
    },
    async ({ workspace_gid }) => {
      const ws = workspace_gid ?? "(default workspace)";
      return {
        messages: [
          userMessage(
            `Fetch my open tasks in workspace ${ws}. Group by day for the next 5 business days based on due_on and priority. Flag overload days.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "assignee_load_balance",
    {
      title: "Assignee load balance",
      description: "Compare task load across assignees in a project.",
      argsSchema: { project_gid: z.string() },
    },
    async ({ project_gid }) => {
      return {
        messages: [
          userMessage(
            `Use asana_list_project_tasks for ${project_gid}. Group open tasks by assignee. Highlight imbalance and suggest reassignments.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "sprint_closeout",
    {
      title: "Sprint closeout",
      description: "Summarize completed vs incomplete work in a project.",
      argsSchema: { project_gid: z.string() },
    },
    async ({ project_gid }) => {
      return {
        messages: [
          userMessage(
            `For project ${project_gid}, compare completed vs open tasks via asana_list_project_tasks. Produce sprint closeout: shipped, carried over, velocity notes, retro prompts.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "goal_progress_report",
    {
      title: "Goal progress report",
      description: "Status report for a workspace goal.",
      argsSchema: { goal_gid: z.string() },
    },
    async ({ goal_gid }) => {
      return {
        messages: [
          userMessage(
            `Use asana_get_goal for ${goal_gid}. Summarize progress, status, blockers, and recommended updates. Offer asana_update_goal if changes needed.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "time_log_assistant",
    {
      title: "Time log assistant",
      description: "Help log time on a task retroactively.",
      argsSchema: {
        task_gid: z.string(),
        duration_minutes: z.number().int().optional(),
        description: z.string().optional(),
      },
    },
    async ({ task_gid, duration_minutes, description }) => {
      return {
        messages: [
          userMessage(
            `Task ${task_gid}. ${description ? `Work done: ${description}.` : ""} ${duration_minutes ? `Log ${duration_minutes} minutes` : "Ask me for duration"} using asana_create_time_entry. Confirm before posting.`,
          ),
        ],
      };
    },
  );
}
