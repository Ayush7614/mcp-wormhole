import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { AsanaClient } from "../client.js";
import { json, toolError } from "./helpers.js";

const gid = z.string().describe("Asana GID.");
const workspaceGid = z.string().describe("Workspace GID.");
const projectGid = z.string().describe("Project GID.");
const taskGid = z.string().describe("Task GID.");
const sectionGid = z.string().describe("Section GID.");
const tagGid = z.string().describe("Tag GID.");
const limit = z.number().int().min(1).max(100).optional();

function wrap(client: AsanaClient, fn: () => Promise<unknown>) {
  return async () => {
    try {
      return json(await fn());
    } catch (error) {
      return toolError(error);
    }
  };
}

export function registerAsanaTools(server: McpServer, client: AsanaClient) {
  // ── Users & workspaces ──
  server.registerTool(
    "asana_get_me",
    { title: "Get current user", description: "Authenticated Asana user profile.", inputSchema: {} },
    wrap(client, () => client.getMe()),
  );

  server.registerTool(
    "asana_get_user",
    {
      title: "Get user",
      description: "Fetch a user by GID or email.",
      inputSchema: { user_gid: gid.describe("User GID or 'me'.") },
    },
    async ({ user_gid }) => {
      try {
        return json(await client.getUser(user_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_workspace_users",
    {
      title: "List workspace users",
      description: "All members in a workspace.",
      inputSchema: { workspace_gid: workspaceGid },
    },
    async ({ workspace_gid }) => {
      try {
        return json({ users: await client.listWorkspaceUsers(workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_workspaces",
    { title: "List workspaces", description: "Workspaces accessible to the token.", inputSchema: {} },
    wrap(client, () => client.listWorkspaces().then((workspaces) => ({ workspaces }))),
  );

  // ── Projects ──
  server.registerTool(
    "asana_list_projects",
    {
      title: "List projects",
      description: "Active projects in a workspace.",
      inputSchema: { workspace_gid: workspaceGid },
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
    "asana_get_project",
    { title: "Get project", description: "Project details by GID.", inputSchema: { project_gid: projectGid } },
    async ({ project_gid }) => {
      try {
        return json(await client.getProject(project_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_project",
    {
      title: "Create project",
      description: "Create a project in a workspace.",
      inputSchema: {
        workspace_gid: workspaceGid,
        name: z.string(),
        notes: z.string().optional(),
        team_gid: z.string().optional(),
        public: z.boolean().optional(),
      },
    },
    async (args) => {
      try {
        return json(
          await client.createProject({
            workspaceGid: args.workspace_gid,
            name: args.name,
            notes: args.notes,
            teamGid: args.team_gid,
            public: args.public,
          }),
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_update_project",
    {
      title: "Update project",
      description: "Update project name, notes, archive state, or visibility.",
      inputSchema: {
        project_gid: projectGid,
        name: z.string().optional(),
        notes: z.string().optional(),
        archived: z.boolean().optional(),
        public: z.boolean().optional(),
      },
    },
    async ({ project_gid, ...input }) => {
      try {
        return json(await client.updateProject(project_gid, input));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_delete_project",
    { title: "Delete project", description: "Permanently delete a project.", inputSchema: { project_gid: projectGid } },
    async ({ project_gid }) => {
      try {
        await client.deleteProject(project_gid);
        return json({ deleted: true, project_gid });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_project_sections",
    {
      title: "List project sections",
      description: "Board/list columns in a project.",
      inputSchema: { project_gid: projectGid },
    },
    async ({ project_gid }) => {
      try {
        return json({ sections: await client.listProjectSections(project_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_project_tasks",
    {
      title: "List project tasks",
      description: "Tasks belonging to a project.",
      inputSchema: { project_gid: projectGid, limit },
    },
    async ({ project_gid, limit: lim }) => {
      try {
        return json({ tasks: await client.listProjectTasks(project_gid, lim ?? 50) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  // ── Sections ──
  server.registerTool(
    "asana_create_section",
    {
      title: "Create section",
      description: "Add a section to a project.",
      inputSchema: { project_gid: projectGid, name: z.string() },
    },
    async ({ project_gid, name }) => {
      try {
        return json(await client.createSection(project_gid, name));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_update_section",
    {
      title: "Update section",
      description: "Rename a section.",
      inputSchema: { section_gid: sectionGid, name: z.string() },
    },
    async ({ section_gid, name }) => {
      try {
        return json(await client.updateSection(section_gid, name));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_delete_section",
    { title: "Delete section", description: "Remove a section.", inputSchema: { section_gid: sectionGid } },
    async ({ section_gid }) => {
      try {
        await client.deleteSection(section_gid);
        return json({ deleted: true, section_gid });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_section_tasks",
    {
      title: "List section tasks",
      description: "Tasks in a specific section.",
      inputSchema: { section_gid: sectionGid, limit },
    },
    async ({ section_gid, limit: lim }) => {
      try {
        return json({ tasks: await client.listSectionTasks(section_gid, lim ?? 50) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_add_task_to_section",
    {
      title: "Add task to section",
      description: "Move or add a task into a section.",
      inputSchema: { task_gid: taskGid, section_gid: sectionGid },
    },
    async ({ task_gid, section_gid }) => {
      try {
        await client.addTaskToSection(task_gid, section_gid);
        return json({ task_gid, section_gid, added: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_remove_task_from_section",
    {
      title: "Remove task from section",
      description: "Remove a task from a section.",
      inputSchema: { task_gid: taskGid, section_gid: sectionGid },
    },
    async ({ task_gid, section_gid }) => {
      try {
        await client.removeTaskFromSection(task_gid, section_gid);
        return json({ task_gid, section_gid, removed: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  registerTaskTools(server, client);
  registerTagTools(server, client);
  registerStoryAttachmentTools(server, client);
  registerMetaTools(server, client);
}

function registerTaskTools(server: McpServer, client: AsanaClient) {
  server.registerTool(
    "asana_list_my_tasks",
    {
      title: "List my tasks",
      description: "Tasks assigned to the authenticated user.",
      inputSchema: {
        workspace_gid: z.string().optional().describe("Defaults to first workspace."),
        limit,
      },
    },
    async ({ workspace_gid, limit: lim }) => {
      try {
        return json({ tasks: await client.listMyTasks(lim ?? 20, workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_search_tasks",
    {
      title: "Search tasks",
      description: "Search tasks in a workspace by text, assignee, and completion.",
      inputSchema: {
        workspace_gid: z.string().describe("Workspace GID."),
        text: z.string().optional(),
        assignee: z.enum(["me"]).optional(),
        completed: z.boolean().optional(),
        limit,
      },
    },
    async (input) => {
      try {
        return json({
          tasks: await client.searchTasks({
            workspaceGid: input.workspace_gid,
            text: input.text,
            assignee: input.assignee,
            completed: input.completed,
            limit: input.limit,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_get_task",
    { title: "Get task", description: "Full task details.", inputSchema: { task_gid: taskGid } },
    async ({ task_gid }) => {
      try {
        return json(await client.getTask(task_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_get_tasks_batch",
    {
      title: "Get tasks batch",
      description: "Fetch up to 25 tasks by GID in one call.",
      inputSchema: { task_gids: z.array(z.string()).min(1).max(25) },
    },
    async ({ task_gids }) => {
      try {
        return json({ tasks: await client.getTasksBatch(task_gids) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_task",
    {
      title: "Create task",
      description: "Create a task in a project, section, or workspace.",
      inputSchema: {
        name: z.string(),
        project_gid: z.string().optional(),
        workspace_gid: z.string().optional(),
        section_gid: z.string().optional(),
        notes: z.string().optional(),
        due_on: z.string().optional().describe("YYYY-MM-DD"),
        assignee_gid: z.string().optional(),
      },
    },
    async (input) => {
      try {
        return json(
          await client.createTask({
            name: input.name,
            projectGid: input.project_gid,
            workspaceGid: input.workspace_gid,
            sectionGid: input.section_gid,
            notes: input.notes,
            dueOn: input.due_on,
            assigneeGid: input.assignee_gid,
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
      title: "Update task",
      description: "Update task fields including completion and assignee.",
      inputSchema: {
        task_gid: taskGid,
        name: z.string().optional(),
        notes: z.string().optional(),
        completed: z.boolean().optional(),
        due_on: z.string().nullable().optional(),
        assignee_gid: z.string().nullable().optional(),
      },
    },
    async ({ task_gid, due_on, assignee_gid, ...rest }) => {
      try {
        return json(
          await client.updateTask(task_gid, {
            ...rest,
            dueOn: due_on,
            assigneeGid: assignee_gid,
          }),
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_delete_task",
    { title: "Delete task", description: "Permanently delete a task.", inputSchema: { task_gid: taskGid } },
    async ({ task_gid }) => {
      try {
        await client.deleteTask(task_gid);
        return json({ deleted: true, task_gid });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_duplicate_task",
    {
      title: "Duplicate task",
      description: "Clone a task (optionally with a new name).",
      inputSchema: { task_gid: taskGid, name: z.string().optional() },
    },
    async ({ task_gid, name }) => {
      try {
        return json(await client.duplicateTask(task_gid, name));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_add_task_to_project",
    {
      title: "Add task to project",
      description: "Multi-home a task into another project.",
      inputSchema: { task_gid: taskGid, project_gid: projectGid },
    },
    async ({ task_gid, project_gid }) => {
      try {
        await client.addTaskToProject(task_gid, project_gid);
        return json({ task_gid, project_gid, added: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_remove_task_from_project",
    {
      title: "Remove task from project",
      description: "Remove a task from a project.",
      inputSchema: { task_gid: taskGid, project_gid: projectGid },
    },
    async ({ task_gid, project_gid }) => {
      try {
        await client.removeTaskFromProject(task_gid, project_gid);
        return json({ task_gid, project_gid, removed: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_subtasks",
    { title: "List subtasks", description: "Child tasks of a parent task.", inputSchema: { task_gid: taskGid } },
    async ({ task_gid }) => {
      try {
        return json({ subtasks: await client.listSubtasks(task_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_subtask",
    {
      title: "Create subtask",
      description: "Add a subtask under a parent task.",
      inputSchema: {
        parent_task_gid: taskGid,
        name: z.string(),
        notes: z.string().optional(),
        assignee_gid: z.string().optional(),
        due_on: z.string().optional(),
      },
    },
    async ({ parent_task_gid, name, notes, assignee_gid, due_on }) => {
      try {
        return json(
          await client.createSubtask(parent_task_gid, {
            name,
            notes,
            assigneeGid: assignee_gid,
            dueOn: due_on,
          }),
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_set_task_parent",
    {
      title: "Set task parent",
      description: "Reparent a task or promote to top-level (null parent).",
      inputSchema: {
        task_gid: taskGid,
        parent_task_gid: z.string().nullable().describe("Parent GID or null to detach."),
      },
    },
    async ({ task_gid, parent_task_gid }) => {
      try {
        return json(await client.setTaskParent(task_gid, parent_task_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_task_dependencies",
    {
      title: "List task dependencies",
      description: "Tasks this task is blocked by.",
      inputSchema: { task_gid: taskGid },
    },
    async ({ task_gid }) => {
      try {
        return json({ dependencies: await client.listTaskDependencies(task_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_task_dependents",
    {
      title: "List task dependents",
      description: "Tasks blocked by this task.",
      inputSchema: { task_gid: taskGid },
    },
    async ({ task_gid }) => {
      try {
        return json({ dependents: await client.listTaskDependents(task_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_add_task_dependency",
    {
      title: "Add task dependency",
      description: "Mark task as blocked by another task.",
      inputSchema: { task_gid: taskGid, depends_on_gid: gid.describe("Blocking task GID.") },
    },
    async ({ task_gid, depends_on_gid }) => {
      try {
        await client.addTaskDependency(task_gid, depends_on_gid);
        return json({ task_gid, depends_on_gid, added: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_remove_task_dependency",
    {
      title: "Remove task dependency",
      description: "Remove a blocking dependency.",
      inputSchema: { task_gid: taskGid, depends_on_gid: gid },
    },
    async ({ task_gid, depends_on_gid }) => {
      try {
        await client.removeTaskDependency(task_gid, depends_on_gid);
        return json({ task_gid, depends_on_gid, removed: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );
}

function registerTagTools(server: McpServer, client: AsanaClient) {
  server.registerTool(
    "asana_list_tags",
    { title: "List tags", description: "Tags in a workspace.", inputSchema: { workspace_gid: workspaceGid } },
    async ({ workspace_gid }) => {
      try {
        return json({ tags: await client.listTags(workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_tag",
    {
      title: "Create tag",
      description: "Create a workspace tag.",
      inputSchema: {
        workspace_gid: workspaceGid,
        name: z.string(),
        color: z.string().optional(),
      },
    },
    async ({ workspace_gid, name, color }) => {
      try {
        return json(await client.createTag(workspace_gid, name, color));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_update_tag",
    {
      title: "Update tag",
      description: "Rename or recolor a tag.",
      inputSchema: { tag_gid: tagGid, name: z.string().optional(), color: z.string().optional() },
    },
    async ({ tag_gid, name, color }) => {
      try {
        return json(await client.updateTag(tag_gid, { name, color }));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_delete_tag",
    { title: "Delete tag", description: "Delete a tag.", inputSchema: { tag_gid: tagGid } },
    async ({ tag_gid }) => {
      try {
        await client.deleteTag(tag_gid);
        return json({ deleted: true, tag_gid });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_task_tags",
    { title: "List task tags", description: "Tags on a task.", inputSchema: { task_gid: taskGid } },
    async ({ task_gid }) => {
      try {
        return json({ tags: await client.listTaskTags(task_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_add_tag_to_task",
    {
      title: "Add tag to task",
      description: "Apply a tag to a task.",
      inputSchema: { task_gid: taskGid, tag_gid: tagGid },
    },
    async ({ task_gid, tag_gid }) => {
      try {
        await client.addTagToTask(task_gid, tag_gid);
        return json({ task_gid, tag_gid, added: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_remove_tag_from_task",
    {
      title: "Remove tag from task",
      description: "Remove a tag from a task.",
      inputSchema: { task_gid: taskGid, tag_gid: tagGid },
    },
    async ({ task_gid, tag_gid }) => {
      try {
        await client.removeTagFromTask(task_gid, tag_gid);
        return json({ task_gid, tag_gid, removed: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );
}

function registerStoryAttachmentTools(server: McpServer, client: AsanaClient) {
  server.registerTool(
    "asana_list_stories",
    {
      title: "List task stories",
      description: "Comments and activity feed for a task.",
      inputSchema: { task_gid: taskGid },
    },
    async ({ task_gid }) => {
      try {
        return json({ stories: await client.listStories(task_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_add_comment",
    {
      title: "Add comment",
      description: "Plain-text comment on a task.",
      inputSchema: { task_gid: taskGid, text: z.string() },
    },
    async ({ task_gid, text }) => {
      try {
        return json(await client.addComment(task_gid, text));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_add_comment_html",
    {
      title: "Add HTML comment",
      description: "Rich HTML comment on a task.",
      inputSchema: { task_gid: taskGid, html_text: z.string() },
    },
    async ({ task_gid, html_text }) => {
      try {
        return json(await client.addCommentHtml(task_gid, html_text));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_attachments",
    {
      title: "List attachments",
      description: "Attachments on a task or project.",
      inputSchema: { parent_gid: gid.describe("Task or project GID.") },
    },
    async ({ parent_gid }) => {
      try {
        return json({ attachments: await client.listAttachments(parent_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_get_attachment",
    {
      title: "Get attachment",
      description: "Attachment metadata including download URL.",
      inputSchema: { attachment_gid: gid.describe("Attachment GID.") },
    },
    async ({ attachment_gid }) => {
      try {
        return json(await client.getAttachment(attachment_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_delete_attachment",
    {
      title: "Delete attachment",
      description: "Remove an attachment.",
      inputSchema: { attachment_gid: gid.describe("Attachment GID.") },
    },
    async ({ attachment_gid }) => {
      try {
        await client.deleteAttachment(attachment_gid);
        return json({ deleted: true, attachment_gid });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_attach_external_url",
    {
      title: "Attach external URL",
      description: "Link an external URL to a task or project.",
      inputSchema: {
        parent_gid: gid,
        url: z.string().url(),
        name: z.string().optional(),
      },
    },
    async ({ parent_gid, url, name }) => {
      try {
        return json(await client.attachExternalUrl(parent_gid, url, name));
      } catch (error) {
        return toolError(error);
      }
    },
  );
}

function registerMetaTools(server: McpServer, client: AsanaClient) {
  server.registerTool(
    "asana_list_teams",
    { title: "List teams", description: "Teams in a workspace.", inputSchema: { workspace_gid: workspaceGid } },
    async ({ workspace_gid }) => {
      try {
        return json({ teams: await client.listTeams(workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_get_team",
    { title: "Get team", description: "Team details.", inputSchema: { team_gid: gid.describe("Team GID.") } },
    async ({ team_gid }) => {
      try {
        return json(await client.getTeam(team_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_typeahead",
    {
      title: "Typeahead search",
      description: "Fuzzy search tasks, projects, users, tags, teams, portfolios, or goals by name.",
      inputSchema: {
        workspace_gid: workspaceGid,
        resource_type: z
          .enum(["task", "project", "user", "tag", "team", "portfolio", "goal"])
          .describe("Resource type to search."),
        query: z.string(),
        count: z.number().int().min(1).max(100).optional(),
      },
    },
    async ({ workspace_gid, resource_type, query, count }) => {
      try {
        return json({
          results: await client.typeahead(workspace_gid, resource_type, query, count ?? 20),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_custom_fields",
    {
      title: "List custom fields",
      description: "Custom field definitions in a workspace.",
      inputSchema: { workspace_gid: workspaceGid },
    },
    async ({ workspace_gid }) => {
      try {
        return json({ custom_fields: await client.listCustomFields(workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_custom_field",
    {
      title: "Create custom field",
      description: "Create a custom field definition.",
      inputSchema: {
        workspace_gid: workspaceGid,
        name: z.string(),
        resource_subtype: z.string().describe("e.g. text, number, enum"),
        enum_options: z.array(z.string()).optional(),
      },
    },
    async ({ workspace_gid, name, resource_subtype, enum_options }) => {
      try {
        return json(
          await client.createCustomField({
            workspaceGid: workspace_gid,
            name,
            resourceSubtype: resource_subtype,
            enumOptions: enum_options,
          }),
        );
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_portfolios",
    {
      title: "List portfolios",
      description: "Portfolios in a workspace.",
      inputSchema: { workspace_gid: workspaceGid },
    },
    async ({ workspace_gid }) => {
      try {
        return json({ portfolios: await client.listPortfolios(workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_get_portfolio",
    {
      title: "Get portfolio",
      description: "Portfolio details.",
      inputSchema: { portfolio_gid: gid.describe("Portfolio GID.") },
    },
    async ({ portfolio_gid }) => {
      try {
        return json(await client.getPortfolio(portfolio_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_portfolio",
    {
      title: "Create portfolio",
      description: "Create a portfolio in a workspace.",
      inputSchema: { workspace_gid: workspaceGid, name: z.string() },
    },
    async ({ workspace_gid, name }) => {
      try {
        return json(await client.createPortfolio(workspace_gid, name));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_portfolio_items",
    {
      title: "List portfolio items",
      description: "Projects in a portfolio.",
      inputSchema: { portfolio_gid: gid.describe("Portfolio GID.") },
    },
    async ({ portfolio_gid }) => {
      try {
        return json({ items: await client.listPortfolioItems(portfolio_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_add_portfolio_item",
    {
      title: "Add portfolio item",
      description: "Add a project to a portfolio.",
      inputSchema: { portfolio_gid: gid, project_gid: projectGid },
    },
    async ({ portfolio_gid, project_gid }) => {
      try {
        await client.addItemToPortfolio(portfolio_gid, project_gid);
        return json({ portfolio_gid, project_gid, added: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_remove_portfolio_item",
    {
      title: "Remove portfolio item",
      description: "Remove a project from a portfolio.",
      inputSchema: { portfolio_gid: gid, project_gid: projectGid },
    },
    async ({ portfolio_gid, project_gid }) => {
      try {
        await client.removeItemFromPortfolio(portfolio_gid, project_gid);
        return json({ portfolio_gid, project_gid, removed: true });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_goals",
    { title: "List goals", description: "Goals in a workspace.", inputSchema: { workspace_gid: workspaceGid } },
    async ({ workspace_gid }) => {
      try {
        return json({ goals: await client.listGoals(workspace_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_get_goal",
    { title: "Get goal", description: "Goal details.", inputSchema: { goal_gid: gid.describe("Goal GID.") } },
    async ({ goal_gid }) => {
      try {
        return json(await client.getGoal(goal_gid));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_goal",
    {
      title: "Create goal",
      description: "Create a workspace goal.",
      inputSchema: { workspace_gid: workspaceGid, name: z.string() },
    },
    async ({ workspace_gid, name }) => {
      try {
        return json(await client.createGoal(workspace_gid, name));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_update_goal",
    {
      title: "Update goal",
      description: "Update goal name or status.",
      inputSchema: {
        goal_gid: gid.describe("Goal GID."),
        name: z.string().optional(),
        status: z.string().optional(),
      },
    },
    async ({ goal_gid, name, status }) => {
      try {
        return json(await client.updateGoal(goal_gid, { name, status }));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_list_time_entries",
    {
      title: "List time entries",
      description: "Time tracking entries on a task.",
      inputSchema: { task_gid: taskGid },
    },
    async ({ task_gid }) => {
      try {
        return json({ entries: await client.listTimeTrackingEntries(task_gid) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_create_time_entry",
    {
      title: "Create time entry",
      description: "Log time on a task.",
      inputSchema: {
        task_gid: taskGid,
        duration_minutes: z.number().int().min(1),
        entered_on: z.string().optional().describe("YYYY-MM-DD"),
      },
    },
    async ({ task_gid, duration_minutes, entered_on }) => {
      try {
        return json(await client.createTimeTrackingEntry(task_gid, duration_minutes, entered_on));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "asana_delete_time_entry",
    {
      title: "Delete time entry",
      description: "Remove a time tracking entry.",
      inputSchema: { entry_gid: gid.describe("Time entry GID.") },
    },
    async ({ entry_gid }) => {
      try {
        await client.deleteTimeTrackingEntry(entry_gid);
        return json({ deleted: true, entry_gid });
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
