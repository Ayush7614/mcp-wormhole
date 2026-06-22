import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AsanaClient, AsanaError } from "./client.js";

function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function toolError(error: unknown) {
  if (error instanceof AsanaError) {
    return json({
      error: error.message,
      status: error.status,
      details: error.body,
    });
  }

  return json({
    error: error instanceof Error ? error.message : String(error),
  });
}

export function registerAsanaTools(server: McpServer, client: AsanaClient) {
  server.registerTool(
    "asana_get_me",
    {
      title: "Get current Asana user",
      description: "Returns the authenticated Asana user (name, email, gid).",
      inputSchema: {},
    },
    async () => {
      try {
        return json(await client.getMe());
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_workspaces",
    {
      title: "List Asana workspaces",
      description: "List workspaces available to the authenticated user.",
      inputSchema: {},
    },
    async () => {
      try {
        return json({ workspaces: await client.listWorkspaces() });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_projects",
    {
      title: "List Asana projects",
      description: "List active projects in a workspace.",
      inputSchema: {
        workspace_gid: z.string().describe("Workspace GID."),
      },
    },
    async ({ workspace_gid }) => {
      try {
        return json({ projects: await client.listProjects(workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_my_tasks",
    {
      title: "List my Asana tasks",
      description: "List tasks assigned to the authenticated user.",
      inputSchema: {
        workspace_gid: z
          .string()
          .optional()
          .describe("Workspace GID (defaults to your first workspace)."),
        limit: z.number().int().min(1).max(100).optional().describe("Max tasks to return (default 20)."),
      },
    },
    async ({ workspace_gid, limit }) => {
      try {
        return json({ tasks: await client.listMyTasks(limit ?? 20, workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_search_tasks",
    {
      title: "Search Asana tasks",
      description: "Search tasks in a workspace by text, assignee, and completion status.",
      inputSchema: {
        workspace_gid: z.string().describe("Workspace GID to search in."),
        text: z.string().optional().describe("Text to match in task name or notes."),
        assignee: z
          .enum(["me"])
          .optional()
          .describe("Filter to tasks assigned to the authenticated user."),
        completed: z.boolean().optional().describe("Filter by completion status."),
        limit: z.number().int().min(1).max(100).optional().describe("Max results (default 20)."),
      },
    },
    async ({ workspace_gid, text, assignee, completed, limit }) => {
      try {
        return json({
          tasks: await client.searchTasks({
            workspaceGid: workspace_gid,
            text,
            assignee,
            completed,
            limit,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_get_task",
    {
      title: "Get Asana task",
      description: "Fetch a single task by GID.",
      inputSchema: {
        task_gid: z.string().describe("Task GID."),
      },
    },
    async ({ task_gid }) => {
      try {
        return json(await client.getTask(task_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_task",
    {
      title: "Create Asana task",
      description: "Create a task in a project or workspace.",
      inputSchema: {
        name: z.string().describe("Task title."),
        project_gid: z.string().optional().describe("Project GID (preferred when available)."),
        workspace_gid: z.string().optional().describe("Workspace GID (used when no project is set)."),
        notes: z.string().optional().describe("Task description."),
        due_on: z.string().optional().describe("Due date in YYYY-MM-DD format."),
      },
    },
    async ({ name, project_gid, workspace_gid, notes, due_on }) => {
      try {
        if (!project_gid && !workspace_gid) {
          return json({ error: "Provide project_gid or workspace_gid" });
        }

        return json(
          await client.createTask({
            name,
            projectGid: project_gid,
            workspaceGid: workspace_gid,
            notes,
            dueOn: due_on,
          }),
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_update_task",
    {
      title: "Update Asana task",
      description: "Update task fields such as name, notes, completion, or due date.",
      inputSchema: {
        task_gid: z.string().describe("Task GID."),
        name: z.string().optional().describe("New task title."),
        notes: z.string().optional().describe("New task description."),
        completed: z.boolean().optional().describe("Mark complete or incomplete."),
        due_on: z.string().nullable().optional().describe("Due date YYYY-MM-DD, or null to clear."),
      },
    },
    async ({ task_gid, name, notes, completed, due_on }) => {
      try {
        return json(
          await client.updateTask(task_gid, {
            name,
            notes,
            completed,
            dueOn: due_on,
          }),
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_add_comment",
    {
      title: "Add comment to Asana task",
      description: "Post a comment on a task.",
      inputSchema: {
        task_gid: z.string().describe("Task GID."),
        text: z.string().describe("Comment text."),
      },
    },
    async ({ task_gid, text }) => {
      try {
        return json(await client.addComment(task_gid, text));
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
