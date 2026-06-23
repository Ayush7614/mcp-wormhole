import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { LinearClient } from "../client.js";
import { json, toolError } from "./helpers.js";

const teamId = z.string().optional().describe("Linear team ID (defaults to LINEAR_TEAM_ID or first team).");
const issueId = z.string().describe("Linear issue ID or identifier (e.g. ENG-123).");
const limit = z.number().int().min(1).max(100).optional();

function wrap(client: LinearClient, fn: () => Promise<unknown>) {
  return async () => {
    try {
      return json(await fn());
    } catch (error) {
      return toolError(error);
    }
  };
}

export function registerLinearTools(server: McpServer, client: LinearClient) {
  server.registerTool(
    "linear_get_viewer",
    {
      title: "Get viewer",
      description: "Authenticated Linear user profile.",
      inputSchema: {},
    },
    wrap(client, () => client.getViewer()),
  );

  server.registerTool(
    "linear_list_teams",
    {
      title: "List teams",
      description: "Teams accessible to the API key.",
      inputSchema: { limit: limit.describe("Max teams (default 25).") },
    },
    async ({ limit: teamLimit }) => {
      try {
        return json({ teams: await client.listTeams(teamLimit ?? 25) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_get_team",
    {
      title: "Get team",
      description: "Team details by ID.",
      inputSchema: { team_id: z.string().describe("Linear team ID.") },
    },
    async ({ team_id }) => wrap(client, () => client.getTeam(team_id))(),
  );

  server.registerTool(
    "linear_list_users",
    {
      title: "List users",
      description: "Organization members.",
      inputSchema: { limit: limit.describe("Max users (default 50).") },
    },
    async ({ limit: userLimit }) => {
      try {
        return json({ users: await client.listUsers(userLimit ?? 50) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_list_projects",
    {
      title: "List projects",
      description: "Projects for a team.",
      inputSchema: {
        team_id: teamId,
        limit: limit.describe("Max projects (default 25)."),
      },
    },
    async ({ team_id, limit: projectLimit }) => {
      try {
        const resolved = await client.resolveTeamId(team_id);
        return json({
          team_id: resolved,
          projects: await client.listProjects(resolved, projectLimit ?? 25),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_list_workflow_states",
    {
      title: "List workflow states",
      description: "Workflow states (Backlog, In Progress, Done, …) for a team.",
      inputSchema: { team_id: teamId },
    },
    async ({ team_id }) => {
      try {
        const resolved = await client.resolveTeamId(team_id);
        return json({
          team_id: resolved,
          states: await client.listWorkflowStates(resolved),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_list_labels",
    {
      title: "List labels",
      description: "Issue labels for a team.",
      inputSchema: {
        team_id: teamId,
        limit: limit.describe("Max labels (default 50)."),
      },
    },
    async ({ team_id, limit: labelLimit }) => {
      try {
        const resolved = await client.resolveTeamId(team_id);
        return json({
          team_id: resolved,
          labels: await client.listLabels(resolved, labelLimit ?? 50),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_list_issues",
    {
      title: "List issues",
      description: "Issues for a team, optionally filtered by assignee, state, or project.",
      inputSchema: {
        team_id: teamId,
        assignee_id: z.string().optional().describe("Filter by assignee user ID."),
        state_id: z.string().optional().describe("Filter by workflow state ID."),
        project_id: z.string().optional().describe("Filter by project ID."),
        limit: limit.describe("Max issues (default 25)."),
      },
    },
    async ({ team_id, assignee_id, state_id, project_id, limit: issueLimit }) => {
      try {
        const resolved = await client.resolveTeamId(team_id);
        return json({
          team_id: resolved,
          issues: await client.listIssues({
            teamId: resolved,
            first: issueLimit ?? 25,
            assigneeId: assignee_id,
            stateId: state_id,
            projectId: project_id,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_get_issue",
    {
      title: "Get issue",
      description: "Full issue record by ID or identifier.",
      inputSchema: { issue_id: issueId },
    },
    async ({ issue_id }) => wrap(client, () => client.getIssue(issue_id))(),
  );

  server.registerTool(
    "linear_search_issues",
    {
      title: "Search issues",
      description: "Full-text search across issues.",
      inputSchema: {
        query: z.string().describe("Search query."),
        team_id: teamId,
        limit: limit.describe("Max results (default 25)."),
      },
    },
    async ({ query, team_id, limit: searchLimit }) => {
      try {
        const resolved = team_id ? await client.resolveTeamId(team_id) : undefined;
        return json({
          query,
          team_id: resolved,
          issues: await client.searchIssues(query, resolved, searchLimit ?? 25),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_create_issue",
    {
      title: "Create issue",
      description: "Create a new issue on a team.",
      inputSchema: {
        team_id: teamId,
        title: z.string().describe("Issue title."),
        description: z.string().optional().describe("Markdown description."),
        assignee_id: z.string().optional(),
        state_id: z.string().optional(),
        priority: z.number().int().min(0).max(4).optional().describe("0=none, 1=urgent, 4=low."),
        label_ids: z.array(z.string()).optional(),
        project_id: z.string().optional(),
      },
    },
    async ({
      team_id,
      title,
      description,
      assignee_id,
      state_id,
      priority,
      label_ids,
      project_id,
    }) => {
      try {
        const resolved = await client.resolveTeamId(team_id);
        return json({
          issue: await client.createIssue({
            teamId: resolved,
            title,
            description,
            assigneeId: assignee_id,
            stateId: state_id,
            priority,
            labelIds: label_ids,
            projectId: project_id,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_update_issue",
    {
      title: "Update issue",
      description: "Update title, description, assignee, state, priority, labels, or project.",
      inputSchema: {
        issue_id: issueId,
        title: z.string().optional(),
        description: z.string().optional(),
        assignee_id: z.string().optional(),
        state_id: z.string().optional(),
        priority: z.number().int().min(0).max(4).optional(),
        label_ids: z.array(z.string()).optional(),
        project_id: z.string().optional(),
      },
    },
    async ({
      issue_id,
      title,
      description,
      assignee_id,
      state_id,
      priority,
      label_ids,
      project_id,
    }) => {
      try {
        return json({
          issue: await client.updateIssue(issue_id, {
            title,
            description,
            assigneeId: assignee_id,
            stateId: state_id,
            priority,
            labelIds: label_ids,
            projectId: project_id,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_add_comment",
    {
      title: "Add comment",
      description: "Add a comment to an issue.",
      inputSchema: {
        issue_id: issueId,
        body: z.string().describe("Comment body (Markdown supported)."),
      },
    },
    async ({ issue_id, body }) => {
      try {
        return json({ comment: await client.addComment(issue_id, body) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "linear_list_comments",
    {
      title: "List comments",
      description: "Comments on an issue.",
      inputSchema: {
        issue_id: issueId,
        limit: limit.describe("Max comments (default 25)."),
      },
    },
    async ({ issue_id, limit: commentLimit }) => {
      try {
        return json({
          comments: await client.listComments(issue_id, commentLimit ?? 25),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
