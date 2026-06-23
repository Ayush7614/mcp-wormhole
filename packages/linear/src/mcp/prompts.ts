import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { LinearClient } from "../client.js";

const teamArg = {
  team_id: z.string().optional().describe("Linear team ID (defaults to LINEAR_TEAM_ID)."),
};

function userMessage(text: string) {
  return { role: "user" as const, content: { type: "text" as const, text } };
}

export function registerLinearPrompts(server: McpServer, _client: LinearClient) {
  server.registerPrompt(
    "my_assigned_issues",
    {
      title: "My assigned issues",
      description: "List issues assigned to the authenticated viewer.",
      argsSchema: teamArg,
    },
    async ({ team_id }) => {
      return {
        messages: [
          userMessage(
            `Call linear_get_viewer to get the viewer ID, then linear_list_issues with assignee_id set to the viewer and team_id ${team_id ?? "(default)"}. Summarize by state: identifier, title, priority, state.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "sprint_board_overview",
    {
      title: "Sprint board overview",
      description: "Snapshot of issues grouped by workflow state for a team.",
      argsSchema: teamArg,
    },
    async ({ team_id }) => {
      return {
        messages: [
          userMessage(
            `For team ${team_id ?? "(default)"}: call linear_list_workflow_states and linear_list_issues (limit 50). Group issues by state name. Flag unassigned high-priority items and stale in-progress work.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "issue_triage",
    {
      title: "Issue triage",
      description: "Triage new/unassigned issues — suggest assignee, labels, and priority.",
      argsSchema: teamArg,
    },
    async ({ team_id }) => {
      return {
        messages: [
          userMessage(
            `For team ${team_id ?? "(default)"}: call linear_list_issues, linear_list_users, and linear_list_labels. Find unassigned or backlog issues. For each, suggest assignee, labels, priority, and next state. Do not mutate unless the user confirms.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "blocked_issues_scan",
    {
      title: "Blocked issues scan",
      description: "Find issues that may be blocked — search comments and titles.",
      argsSchema: {
        ...teamArg,
        search_terms: z.string().optional().describe('Terms like "blocked" (default: blocked).'),
      },
    },
    async ({ team_id, search_terms }) => {
      const term = search_terms ?? "blocked";
      return {
        messages: [
          userMessage(
            `Search issues with linear_search_issues query "${term}" for team ${team_id ?? "(default)"}. For top matches, call linear_get_issue and linear_list_comments. Summarize blockers and recommended unblock actions.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "create_bug_report",
    {
      title: "Create bug report",
      description: "Draft and create a structured bug issue.",
      argsSchema: {
        ...teamArg,
        summary: z.string().describe("Short bug summary for the title."),
        details: z.string().optional().describe("Steps to reproduce, expected vs actual."),
      },
    },
    async ({ team_id, summary, details }) => {
      return {
        messages: [
          userMessage(
            `Create a bug on team ${team_id ?? "(default)"} with linear_create_issue. Title: [Bug] ${summary}. Description: ${details ?? "Fill in repro steps, expected behavior, actual behavior, and environment."}. Ask before creating if details are incomplete.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "release_readiness_issues",
    {
      title: "Release readiness",
      description: "Check open high-priority issues before a release.",
      argsSchema: teamArg,
    },
    async ({ team_id }) => {
      return {
        messages: [
          userMessage(
            `For team ${team_id ?? "(default)"}: call linear_list_issues and linear_list_workflow_states. List open non-done issues with priority 1-2. Output a release go/no-go summary with counts by state.`,
          ),
        ],
      };
    },
  );
}
