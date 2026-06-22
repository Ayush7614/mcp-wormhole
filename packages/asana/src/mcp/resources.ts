import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AsanaClient } from "../client.js";
import {
  ASANA_PROMPT_NAMES,
  ASANA_RESOURCE_URIS,
  ASANA_TOOL_NAMES,
} from "./catalog.js";

function textResource(uri: string, data: unknown) {
  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function registerAsanaResources(server: McpServer, client: AsanaClient) {
  server.registerResource(
    "asana_catalog",
    "asana://catalog",
    {
      title: "Asana MCP catalog",
      description: "Tool, prompt, and resource index for mcp-wormhole Asana.",
      mimeType: "application/json",
    },
    async (uri) =>
      textResource(uri.href, {
        server: "mcp-wormhole-asana",
        tools: ASANA_TOOL_NAMES.length,
        tool_names: ASANA_TOOL_NAMES,
        prompts: ASANA_PROMPT_NAMES.length,
        prompt_names: ASANA_PROMPT_NAMES,
        resource_templates: ASANA_RESOURCE_URIS,
      }),
  );

  server.registerResource(
    "asana_workspaces",
    "asana://workspaces",
    {
      title: "All workspaces",
      description: "Browse workspaces accessible to your token.",
      mimeType: "application/json",
    },
    async (uri) => textResource(uri.href, { workspaces: await client.listWorkspaces() }),
  );

  server.registerResource(
    "asana_workspace",
    new ResourceTemplate("asana://workspace/{workspace_gid}", {
      list: async () => {
        const workspaces = await client.listWorkspaces();
        return {
          resources: workspaces.map((ws) => ({
            uri: `asana://workspace/${ws.gid}`,
            name: ws.name,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        workspace_gid: async () => (await client.listWorkspaces()).map((ws) => ws.gid),
      },
    }),
    {
      title: "Workspace",
      description: "Workspace metadata and navigation links.",
      mimeType: "application/json",
    },
    async (uri, { workspace_gid }) => {
      const projects = await client.listProjects(workspace_gid);
      const teams = await client.listTeams(workspace_gid);
      return textResource(uri.href, {
        workspace_gid,
        projects_count: projects.length,
        teams_count: teams.length,
        browse: {
          projects: `asana://workspace/${workspace_gid}/projects`,
        },
      });
    },
  );

  server.registerResource(
    "asana_workspace_projects",
    new ResourceTemplate("asana://workspace/{workspace_gid}/projects", {
      list: undefined,
      complete: {
        workspace_gid: async () => (await client.listWorkspaces()).map((ws) => ws.gid),
      },
    }),
    {
      title: "Workspace projects",
      description: "All active projects in a workspace.",
      mimeType: "application/json",
    },
    async (uri, { workspace_gid }) => {
      const projects = await client.listProjects(workspace_gid);
      return textResource(uri.href, {
        workspace_gid,
        projects,
        links: projects.map((p) => ({
          uri: `asana://project/${p.gid}`,
          name: p.name,
        })),
      });
    },
  );

  server.registerResource(
    "asana_project",
    new ResourceTemplate("asana://project/{project_gid}", {
      list: async () => {
        const workspace = await client.defaultWorkspaceGid();
        if (!workspace) return { resources: [] };
        const projects = await client.listProjects(workspace);
        return {
          resources: projects.map((p) => ({
            uri: `asana://project/${p.gid}`,
            name: p.name,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        project_gid: async () => {
          const workspace = await client.defaultWorkspaceGid();
          if (!workspace) return [];
          return (await client.listProjects(workspace)).map((p) => p.gid);
        },
      },
    }),
    {
      title: "Project",
      description: "Project details, sections, and task browse link.",
      mimeType: "application/json",
    },
    async (uri, { project_gid }) => {
      const [project, sections] = await Promise.all([
        client.getProject(project_gid),
        client.listProjectSections(project_gid),
      ]);
      return textResource(uri.href, {
        project,
        sections,
        browse_tasks: `asana://project/${project_gid}/tasks`,
      });
    },
  );

  server.registerResource(
    "asana_project_tasks",
    new ResourceTemplate("asana://project/{project_gid}/tasks", {
      list: undefined,
      complete: {
        project_gid: async () => {
          const workspace = await client.defaultWorkspaceGid();
          if (!workspace) return [];
          return (await client.listProjects(workspace)).map((p) => p.gid);
        },
      },
    }),
    {
      title: "Project tasks",
      description: "Tasks in a project (up to 50).",
      mimeType: "application/json",
    },
    async (uri, { project_gid }) => {
      const tasks = await client.listProjectTasks(project_gid, 50);
      return textResource(uri.href, {
        project_gid,
        tasks,
        links: tasks.map((t) => ({ uri: `asana://task/${t.gid}`, name: t.name })),
      });
    },
  );

  server.registerResource(
    "asana_task",
    new ResourceTemplate("asana://task/{task_gid}", {
      list: async () => {
        const workspace = await client.defaultWorkspaceGid();
        if (!workspace) return { resources: [] };
        const tasks = await client.listMyTasks(20, workspace);
        return {
          resources: tasks.map((t) => ({
            uri: `asana://task/${t.gid}`,
            name: t.name,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        task_gid: async () => {
          const workspace = await client.defaultWorkspaceGid();
          if (!workspace) return [];
          return (await client.listMyTasks(25, workspace)).map((t) => t.gid);
        },
      },
    }),
    {
      title: "Task",
      description: "Full task snapshot with subtasks and stories.",
      mimeType: "application/json",
    },
    async (uri, { task_gid }) => {
      const [task, subtasks, stories] = await Promise.all([
        client.getTask(task_gid),
        client.listSubtasks(task_gid),
        client.listStories(task_gid),
      ]);
      return textResource(uri.href, { task, subtasks, stories });
    },
  );
}
