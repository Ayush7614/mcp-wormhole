export interface AsanaUser {
  gid: string;
  name: string;
  email?: string;
}

export interface AsanaWorkspace {
  gid: string;
  name: string;
}

export interface AsanaProject {
  gid: string;
  name: string;
  archived?: boolean;
  notes?: string;
  color?: string;
  public?: boolean;
  workspace?: { gid: string; name: string };
}

export interface AsanaSection {
  gid: string;
  name: string;
}

export interface AsanaTag {
  gid: string;
  name: string;
  color?: string;
}

export interface AsanaTask {
  gid: string;
  name: string;
  notes?: string;
  completed?: boolean;
  due_on?: string | null;
  assignee?: { gid: string; name: string } | null;
  projects?: Array<{ gid: string; name: string }>;
  permalink_url?: string;
  memberships?: Array<{ section?: { gid: string; name: string } }>;
  parent?: { gid: string; name: string } | null;
  tags?: Array<{ gid: string; name: string }>;
}

export interface AsanaStory {
  gid: string;
  text?: string;
  html_text?: string;
  created_at?: string;
  created_by?: { gid: string; name: string };
  resource_subtype?: string;
}

export interface AsanaAttachment {
  gid: string;
  name: string;
  download_url?: string;
  permanent_url?: string;
  resource_subtype?: string;
}

export interface AsanaTeam {
  gid: string;
  name: string;
}

export interface AsanaPortfolio {
  gid: string;
  name: string;
}

export interface AsanaGoal {
  gid: string;
  name: string;
  status?: string;
}

export interface AsanaCustomField {
  gid: string;
  name: string;
  resource_subtype?: string;
  type?: string;
}

export interface AsanaTimeTrackingEntry {
  gid: string;
  duration_minutes?: number;
  entered_on?: string;
  attributable_to?: { gid: string; name: string };
}

export interface AsanaTypeaheadResult {
  gid: string;
  name: string;
  resource_type?: string;
  resource_subtype?: string;
}

interface AsanaListResponse<T> {
  data: T[];
  next_page?: { offset: string; path: string; uri: string } | null;
}

interface AsanaItemResponse<T> {
  data: T;
}

export class AsanaError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
    this.name = "AsanaError";
  }
}

const TASK_FIELDS =
  "gid,name,notes,completed,due_on,assignee.name,projects.name,permalink_url,memberships.section.name,parent.name,tags.name";
const PROJECT_FIELDS = "gid,name,archived,notes,color,public,workspace.name";

export class AsanaClient {
  private readonly baseUrl = "https://app.asana.com/api/1.0";

  constructor(private readonly token: string) {
    if (!token.trim()) {
      throw new Error("ASANA_ACCESS_TOKEN is required");
    }
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    const text = await response.text();
    if (!response.ok) {
      throw new AsanaError(`Asana API error (${response.status})`, response.status, text);
    }

    return JSON.parse(text) as T;
  }

  private async listAll<T>(path: string, limit?: number): Promise<T[]> {
    const items: T[] = [];
    let offset: string | undefined;

    do {
      const params = new URLSearchParams();
      if (offset) params.set("offset", offset);
      const suffix = params.size ? `${path.includes("?") ? "&" : "?"}${params}` : "";
      const result = await this.request<AsanaListResponse<T>>(`${path}${suffix}`);
      items.push(...result.data);
      offset = result.next_page?.offset;
      if (limit && items.length >= limit) return items.slice(0, limit);
    } while (offset);

    return items;
  }

  async getMe(): Promise<AsanaUser> {
    const result = await this.request<AsanaItemResponse<AsanaUser>>(
      "/users/me?opt_fields=gid,name,email",
    );
    return result.data;
  }

  async getUser(userGid: string): Promise<AsanaUser> {
    const result = await this.request<AsanaItemResponse<AsanaUser>>(
      `/users/${userGid}?opt_fields=gid,name,email`,
    );
    return result.data;
  }

  async listWorkspaceUsers(workspaceGid: string): Promise<AsanaUser[]> {
    return this.listAll<AsanaUser>(
      `/workspaces/${workspaceGid}/users?opt_fields=gid,name,email`,
    );
  }

  async listWorkspaces(): Promise<AsanaWorkspace[]> {
    const result = await this.request<AsanaListResponse<AsanaWorkspace>>("/workspaces");
    return result.data;
  }

  async listProjects(workspaceGid: string): Promise<AsanaProject[]> {
    const params = new URLSearchParams({ workspace: workspaceGid, opt_fields: PROJECT_FIELDS });
    const result = await this.request<AsanaListResponse<AsanaProject>>(`/projects?${params}`);
    return result.data.filter((project) => !project.archived);
  }

  async getProject(projectGid: string): Promise<AsanaProject> {
    const result = await this.request<AsanaItemResponse<AsanaProject>>(
      `/projects/${projectGid}?opt_fields=${PROJECT_FIELDS}`,
    );
    return result.data;
  }

  async createProject(input: {
    workspaceGid: string;
    name: string;
    notes?: string;
    teamGid?: string;
    public?: boolean;
  }): Promise<AsanaProject> {
    const data: Record<string, unknown> = {
      name: input.name,
      workspace: input.workspaceGid,
    };
    if (input.notes) data.notes = input.notes;
    if (input.teamGid) data.team = input.teamGid;
    if (input.public !== undefined) data.public = input.public;

    const result = await this.request<AsanaItemResponse<AsanaProject>>("/projects", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
    return this.getProject(result.data.gid);
  }

  async updateProject(
    projectGid: string,
    input: { name?: string; notes?: string; archived?: boolean; public?: boolean },
  ): Promise<AsanaProject> {
    const data: Record<string, unknown> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.notes !== undefined) data.notes = input.notes;
    if (input.archived !== undefined) data.archived = input.archived;
    if (input.public !== undefined) data.public = input.public;

    await this.request(`/projects/${projectGid}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    });
    return this.getProject(projectGid);
  }

  async deleteProject(projectGid: string): Promise<void> {
    await this.request(`/projects/${projectGid}`, { method: "DELETE" });
  }

  async listProjectSections(projectGid: string): Promise<AsanaSection[]> {
    const result = await this.request<AsanaListResponse<AsanaSection>>(
      `/projects/${projectGid}/sections?opt_fields=gid,name`,
    );
    return result.data;
  }

  async listSectionTasks(sectionGid: string, limit = 50): Promise<AsanaTask[]> {
    const params = new URLSearchParams({ opt_fields: TASK_FIELDS, limit: String(limit) });
    const result = await this.request<AsanaListResponse<AsanaTask>>(
      `/sections/${sectionGid}/tasks?${params}`,
    );
    return result.data;
  }

  async listProjectTasks(projectGid: string, limit = 50): Promise<AsanaTask[]> {
    const params = new URLSearchParams({ opt_fields: TASK_FIELDS, limit: String(limit) });
    const result = await this.request<AsanaListResponse<AsanaTask>>(
      `/projects/${projectGid}/tasks?${params}`,
    );
    return result.data;
  }

  async createSection(projectGid: string, name: string): Promise<AsanaSection> {
    const result = await this.request<AsanaItemResponse<AsanaSection>>(
      `/projects/${projectGid}/sections`,
      {
        method: "POST",
        body: JSON.stringify({ data: { name } }),
      },
    );
    return result.data;
  }

  async updateSection(sectionGid: string, name: string): Promise<AsanaSection> {
    const result = await this.request<AsanaItemResponse<AsanaSection>>(`/sections/${sectionGid}`, {
      method: "PUT",
      body: JSON.stringify({ data: { name } }),
    });
    return result.data;
  }

  async deleteSection(sectionGid: string): Promise<void> {
    await this.request(`/sections/${sectionGid}`, { method: "DELETE" });
  }

  async addTaskToSection(taskGid: string, sectionGid: string): Promise<void> {
    await this.request(`/sections/${sectionGid}/addTask`, {
      method: "POST",
      body: JSON.stringify({ data: { task: taskGid } }),
    });
  }

  async removeTaskFromSection(taskGid: string, sectionGid: string): Promise<void> {
    await this.request(`/sections/${sectionGid}/removeTask`, {
      method: "POST",
      body: JSON.stringify({ data: { task: taskGid } }),
    });
  }

  async listMyTasks(limit = 20, workspaceGid?: string): Promise<AsanaTask[]> {
    const workspace =
      workspaceGid ?? (await this.listWorkspaces()).find((item) => item.gid)?.gid;
    if (!workspace) return [];

    const params = new URLSearchParams({
      assignee: "me",
      workspace,
      opt_fields: TASK_FIELDS,
      limit: String(Math.min(limit, 100)),
    });
    const result = await this.request<AsanaListResponse<AsanaTask>>(`/tasks?${params}`);
    return result.data;
  }

  async searchTasks(input: {
    workspaceGid: string;
    text?: string;
    assignee?: "me" | string;
    completed?: boolean;
    limit?: number;
  }): Promise<AsanaTask[]> {
    const params = new URLSearchParams({ opt_fields: TASK_FIELDS });
    if (input.text) params.set("text", input.text);
    if (input.assignee === "me") params.set("assignee.any", "me");
    else if (input.assignee) params.set("assignee.any", input.assignee);
    if (input.completed !== undefined) params.set("completed", String(input.completed));

    const result = await this.request<AsanaListResponse<AsanaTask>>(
      `/workspaces/${input.workspaceGid}/tasks/search?${params}`,
    );
    return result.data.slice(0, input.limit ?? 20);
  }

  async getTask(taskGid: string): Promise<AsanaTask> {
    const result = await this.request<AsanaItemResponse<AsanaTask>>(
      `/tasks/${taskGid}?opt_fields=${TASK_FIELDS}`,
    );
    return result.data;
  }

  async getTasksBatch(taskGids: string[]): Promise<AsanaTask[]> {
    const params = new URLSearchParams({
      opt_fields: TASK_FIELDS,
      limit: String(Math.min(taskGids.length, 25)),
    });
    for (const gid of taskGids.slice(0, 25)) {
      params.append("gid", gid);
    }
    const result = await this.request<AsanaListResponse<AsanaTask>>(`/tasks?${params}`);
    return result.data;
  }

  async createTask(input: {
    name: string;
    workspaceGid?: string;
    projectGid?: string;
    sectionGid?: string;
    notes?: string;
    dueOn?: string;
    assigneeGid?: string;
  }): Promise<AsanaTask> {
    const data: Record<string, unknown> = { name: input.name };
    if (input.notes) data.notes = input.notes;
    if (input.dueOn) data.due_on = input.dueOn;
    if (input.assigneeGid) data.assignee = input.assigneeGid;
    if (input.projectGid) data.projects = [input.projectGid];
    else if (input.workspaceGid) data.workspace = input.workspaceGid;

    const result = await this.request<AsanaItemResponse<AsanaTask>>("/tasks", {
      method: "POST",
      body: JSON.stringify({ data }),
    });

    if (input.sectionGid) {
      await this.addTaskToSection(result.data.gid, input.sectionGid);
    }

    return this.getTask(result.data.gid);
  }

  async updateTask(
    taskGid: string,
    input: {
      name?: string;
      notes?: string;
      completed?: boolean;
      dueOn?: string | null;
      assigneeGid?: string | null;
    },
  ): Promise<AsanaTask> {
    const data: Record<string, unknown> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.notes !== undefined) data.notes = input.notes;
    if (input.completed !== undefined) data.completed = input.completed;
    if (input.dueOn !== undefined) data.due_on = input.dueOn;
    if (input.assigneeGid !== undefined) data.assignee = input.assigneeGid;

    await this.request(`/tasks/${taskGid}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    });
    return this.getTask(taskGid);
  }

  async deleteTask(taskGid: string): Promise<void> {
    await this.request(`/tasks/${taskGid}`, { method: "DELETE" });
  }

  async duplicateTask(taskGid: string, name?: string): Promise<AsanaTask> {
    const data: Record<string, unknown> = {};
    if (name) data.name = name;
    const result = await this.request<AsanaItemResponse<AsanaTask>>(
      `/tasks/${taskGid}/duplicate`,
      { method: "POST", body: JSON.stringify({ data }) },
    );
    return this.getTask(result.data.gid);
  }

  async addTaskToProject(taskGid: string, projectGid: string): Promise<void> {
    await this.request(`/tasks/${taskGid}/addProject`, {
      method: "POST",
      body: JSON.stringify({ data: { project: projectGid } }),
    });
  }

  async removeTaskFromProject(taskGid: string, projectGid: string): Promise<void> {
    await this.request(`/tasks/${taskGid}/removeProject`, {
      method: "POST",
      body: JSON.stringify({ data: { project: projectGid } }),
    });
  }

  async listSubtasks(taskGid: string): Promise<AsanaTask[]> {
    const result = await this.request<AsanaListResponse<AsanaTask>>(
      `/tasks/${taskGid}/subtasks?opt_fields=${TASK_FIELDS}`,
    );
    return result.data;
  }

  async createSubtask(
    parentGid: string,
    input: { name: string; notes?: string; assigneeGid?: string; dueOn?: string },
  ): Promise<AsanaTask> {
    const data: Record<string, unknown> = { name: input.name };
    if (input.notes) data.notes = input.notes;
    if (input.assigneeGid) data.assignee = input.assigneeGid;
    if (input.dueOn) data.due_on = input.dueOn;

    const result = await this.request<AsanaItemResponse<AsanaTask>>(
      `/tasks/${parentGid}/subtasks`,
      { method: "POST", body: JSON.stringify({ data }) },
    );
    return this.getTask(result.data.gid);
  }

  async setTaskParent(taskGid: string, parentGid: string | null): Promise<AsanaTask> {
    await this.request(`/tasks/${taskGid}/setParent`, {
      method: "POST",
      body: JSON.stringify({ data: { parent: parentGid } }),
    });
    return this.getTask(taskGid);
  }

  async addTaskDependency(taskGid: string, dependsOnGid: string): Promise<void> {
    await this.request(`/tasks/${taskGid}/addDependencies`, {
      method: "POST",
      body: JSON.stringify({ data: { dependencies: [dependsOnGid] } }),
    });
  }

  async removeTaskDependency(taskGid: string, dependsOnGid: string): Promise<void> {
    await this.request(`/tasks/${taskGid}/removeDependencies`, {
      method: "POST",
      body: JSON.stringify({ data: { dependencies: [dependsOnGid] } }),
    });
  }

  async listTaskDependencies(taskGid: string): Promise<AsanaTask[]> {
    const result = await this.request<AsanaListResponse<AsanaTask>>(
      `/tasks/${taskGid}/dependencies?opt_fields=gid,name,completed`,
    );
    return result.data;
  }

  async listTaskDependents(taskGid: string): Promise<AsanaTask[]> {
    const result = await this.request<AsanaListResponse<AsanaTask>>(
      `/tasks/${taskGid}/dependents?opt_fields=gid,name,completed`,
    );
    return result.data;
  }

  async listTags(workspaceGid: string): Promise<AsanaTag[]> {
    const result = await this.request<AsanaListResponse<AsanaTag>>(
      `/workspaces/${workspaceGid}/tags?opt_fields=gid,name,color`,
    );
    return result.data;
  }

  async createTag(workspaceGid: string, name: string, color?: string): Promise<AsanaTag> {
    const data: Record<string, unknown> = { name, workspace: workspaceGid };
    if (color) data.color = color;
    const result = await this.request<AsanaItemResponse<AsanaTag>>("/tags", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
    return result.data;
  }

  async updateTag(tagGid: string, input: { name?: string; color?: string }): Promise<AsanaTag> {
    const result = await this.request<AsanaItemResponse<AsanaTag>>(`/tags/${tagGid}`, {
      method: "PUT",
      body: JSON.stringify({ data: input }),
    });
    return result.data;
  }

  async deleteTag(tagGid: string): Promise<void> {
    await this.request(`/tags/${tagGid}`, { method: "DELETE" });
  }

  async addTagToTask(taskGid: string, tagGid: string): Promise<void> {
    await this.request(`/tasks/${taskGid}/addTag`, {
      method: "POST",
      body: JSON.stringify({ data: { tag: tagGid } }),
    });
  }

  async removeTagFromTask(taskGid: string, tagGid: string): Promise<void> {
    await this.request(`/tasks/${taskGid}/removeTag`, {
      method: "POST",
      body: JSON.stringify({ data: { tag: tagGid } }),
    });
  }

  async listTaskTags(taskGid: string): Promise<AsanaTag[]> {
    const result = await this.request<AsanaListResponse<AsanaTag>>(
      `/tasks/${taskGid}/tags?opt_fields=gid,name,color`,
    );
    return result.data;
  }

  async listStories(taskGid: string): Promise<AsanaStory[]> {
    const result = await this.request<AsanaListResponse<AsanaStory>>(
      `/tasks/${taskGid}/stories?opt_fields=gid,text,html_text,created_at,created_by.name,resource_subtype`,
    );
    return result.data;
  }

  async addComment(taskGid: string, text: string): Promise<AsanaStory> {
    const result = await this.request<AsanaItemResponse<AsanaStory>>(`/tasks/${taskGid}/stories`, {
      method: "POST",
      body: JSON.stringify({ data: { text } }),
    });
    return result.data;
  }

  async addCommentHtml(taskGid: string, htmlText: string): Promise<AsanaStory> {
    const result = await this.request<AsanaItemResponse<AsanaStory>>(`/tasks/${taskGid}/stories`, {
      method: "POST",
      body: JSON.stringify({ data: { html_text: htmlText } }),
    });
    return result.data;
  }

  async listAttachments(parentGid: string): Promise<AsanaAttachment[]> {
    const result = await this.request<AsanaListResponse<AsanaAttachment>>(
      `/attachments?parent=${parentGid}&opt_fields=gid,name,download_url,permanent_url,resource_subtype`,
    );
    return result.data;
  }

  async getAttachment(attachmentGid: string): Promise<AsanaAttachment> {
    const result = await this.request<AsanaItemResponse<AsanaAttachment>>(
      `/attachments/${attachmentGid}?opt_fields=gid,name,download_url,permanent_url,resource_subtype`,
    );
    return result.data;
  }

  async deleteAttachment(attachmentGid: string): Promise<void> {
    await this.request(`/attachments/${attachmentGid}`, { method: "DELETE" });
  }

  async attachExternalUrl(parentGid: string, url: string, name?: string): Promise<AsanaAttachment> {
    const data: Record<string, unknown> = {
      parent: parentGid,
      resource_subtype: "external",
      url,
    };
    if (name) data.name = name;
    const result = await this.request<AsanaItemResponse<AsanaAttachment>>("/attachments", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
    return result.data;
  }

  async listTeams(workspaceGid: string): Promise<AsanaTeam[]> {
    const result = await this.request<AsanaListResponse<AsanaTeam>>(
      `/workspaces/${workspaceGid}/teams?opt_fields=gid,name`,
    );
    return result.data;
  }

  async getTeam(teamGid: string): Promise<AsanaTeam> {
    const result = await this.request<AsanaItemResponse<AsanaTeam>>(
      `/teams/${teamGid}?opt_fields=gid,name`,
    );
    return result.data;
  }

  async typeahead(
    workspaceGid: string,
    resourceType: string,
    query: string,
    count = 20,
  ): Promise<AsanaTypeaheadResult[]> {
    const params = new URLSearchParams({
      resource_type: resourceType,
      query,
      count: String(count),
      opt_fields: "gid,name,resource_type,resource_subtype",
    });
    const result = await this.request<AsanaListResponse<AsanaTypeaheadResult>>(
      `/workspaces/${workspaceGid}/typeahead?${params}`,
    );
    return result.data;
  }

  async listCustomFields(workspaceGid: string): Promise<AsanaCustomField[]> {
    const result = await this.request<AsanaListResponse<AsanaCustomField>>(
      `/workspaces/${workspaceGid}/custom_fields?opt_fields=gid,name,resource_subtype,type`,
    );
    return result.data;
  }

  async createCustomField(input: {
    workspaceGid: string;
    name: string;
    resourceSubtype: string;
    enumOptions?: string[];
  }): Promise<AsanaCustomField> {
    const data: Record<string, unknown> = {
      name: input.name,
      workspace: input.workspaceGid,
      resource_subtype: input.resourceSubtype,
    };
    if (input.enumOptions?.length) {
      data.enum_options = input.enumOptions.map((name) => ({ name }));
    }
    const result = await this.request<AsanaItemResponse<AsanaCustomField>>("/custom_fields", {
      method: "POST",
      body: JSON.stringify({ data }),
    });
    return result.data;
  }

  async listPortfolios(workspaceGid: string): Promise<AsanaPortfolio[]> {
    const result = await this.request<AsanaListResponse<AsanaPortfolio>>(
      `/portfolios?workspace=${workspaceGid}&opt_fields=gid,name`,
    );
    return result.data;
  }

  async getPortfolio(portfolioGid: string): Promise<AsanaPortfolio> {
    const result = await this.request<AsanaItemResponse<AsanaPortfolio>>(
      `/portfolios/${portfolioGid}?opt_fields=gid,name`,
    );
    return result.data;
  }

  async createPortfolio(workspaceGid: string, name: string): Promise<AsanaPortfolio> {
    const result = await this.request<AsanaItemResponse<AsanaPortfolio>>("/portfolios", {
      method: "POST",
      body: JSON.stringify({ data: { name, workspace: workspaceGid } }),
    });
    return result.data;
  }

  async listPortfolioItems(portfolioGid: string): Promise<AsanaProject[]> {
    const result = await this.request<AsanaListResponse<AsanaProject>>(
      `/portfolios/${portfolioGid}/items?opt_fields=gid,name,archived`,
    );
    return result.data;
  }

  async addItemToPortfolio(portfolioGid: string, projectGid: string): Promise<void> {
    await this.request(`/portfolios/${portfolioGid}/addItem`, {
      method: "POST",
      body: JSON.stringify({ data: { item: projectGid } }),
    });
  }

  async removeItemFromPortfolio(portfolioGid: string, projectGid: string): Promise<void> {
    await this.request(`/portfolios/${portfolioGid}/removeItem`, {
      method: "POST",
      body: JSON.stringify({ data: { item: projectGid } }),
    });
  }

  async listGoals(workspaceGid: string): Promise<AsanaGoal[]> {
    const result = await this.request<AsanaListResponse<AsanaGoal>>(
      `/goals?workspace=${workspaceGid}&opt_fields=gid,name,status`,
    );
    return result.data;
  }

  async getGoal(goalGid: string): Promise<AsanaGoal> {
    const result = await this.request<AsanaItemResponse<AsanaGoal>>(
      `/goals/${goalGid}?opt_fields=gid,name,status`,
    );
    return result.data;
  }

  async createGoal(workspaceGid: string, name: string): Promise<AsanaGoal> {
    const result = await this.request<AsanaItemResponse<AsanaGoal>>("/goals", {
      method: "POST",
      body: JSON.stringify({ data: { name, workspace: workspaceGid } }),
    });
    return result.data;
  }

  async updateGoal(goalGid: string, input: { name?: string; status?: string }): Promise<AsanaGoal> {
    const result = await this.request<AsanaItemResponse<AsanaGoal>>(`/goals/${goalGid}`, {
      method: "PUT",
      body: JSON.stringify({ data: input }),
    });
    return result.data;
  }

  async listTimeTrackingEntries(taskGid: string): Promise<AsanaTimeTrackingEntry[]> {
    const result = await this.request<AsanaListResponse<AsanaTimeTrackingEntry>>(
      `/tasks/${taskGid}/time_tracking_entries?opt_fields=gid,duration_minutes,entered_on,attributable_to.name`,
    );
    return result.data;
  }

  async createTimeTrackingEntry(
    taskGid: string,
    durationMinutes: number,
    enteredOn?: string,
  ): Promise<AsanaTimeTrackingEntry> {
    const data: Record<string, unknown> = { duration_minutes: durationMinutes };
    if (enteredOn) data.entered_on = enteredOn;
    const result = await this.request<AsanaItemResponse<AsanaTimeTrackingEntry>>(
      `/tasks/${taskGid}/time_tracking_entries`,
      { method: "POST", body: JSON.stringify({ data }) },
    );
    return result.data;
  }

  async deleteTimeTrackingEntry(entryGid: string): Promise<void> {
    await this.request(`/time_tracking_entries/${entryGid}`, { method: "DELETE" });
  }

  async defaultWorkspaceGid(): Promise<string | undefined> {
    return (await this.listWorkspaces())[0]?.gid;
  }
}

export function createClientFromEnv(): AsanaClient {
  const token = process.env.ASANA_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Missing ASANA_ACCESS_TOKEN environment variable");
  }
  return new AsanaClient(token);
}
