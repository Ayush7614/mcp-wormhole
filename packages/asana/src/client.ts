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
}

export interface AsanaStory {
  gid: string;
  text: string;
  created_at?: string;
  created_by?: { gid: string; name: string };
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

  async getMe(): Promise<AsanaUser> {
    const result = await this.request<AsanaItemResponse<AsanaUser>>(
      "/users/me?opt_fields=gid,name,email",
    );
    return result.data;
  }

  async listWorkspaces(): Promise<AsanaWorkspace[]> {
    const result = await this.request<AsanaListResponse<AsanaWorkspace>>("/workspaces");
    return result.data;
  }

  async listProjects(workspaceGid: string): Promise<AsanaProject[]> {
    const params = new URLSearchParams({
      workspace: workspaceGid,
      opt_fields: "gid,name,archived",
    });
    const result = await this.request<AsanaListResponse<AsanaProject>>(`/projects?${params}`);
    return result.data.filter((project) => !project.archived);
  }

  async listMyTasks(limit = 20, workspaceGid?: string): Promise<AsanaTask[]> {
    const workspace =
      workspaceGid ?? (await this.listWorkspaces()).find((item) => item.gid)?.gid;
    if (!workspace) return [];

    const params = new URLSearchParams({
      assignee: "me",
      workspace,
      opt_fields: "gid,name,notes,completed,due_on,assignee.name,projects.name,permalink_url",
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
    const params = new URLSearchParams({
      opt_fields: "gid,name,notes,completed,due_on,assignee.name,projects.name,permalink_url",
    });

    if (input.text) params.set("text", input.text);
    if (input.assignee === "me") params.set("assignee.any", "me");
    else if (input.assignee) params.set("assignee.any", input.assignee);
    if (input.completed !== undefined) params.set("completed", String(input.completed));

    const result = await this.request<AsanaListResponse<AsanaTask>>(
      `/workspaces/${input.workspaceGid}/tasks/search?${params}`,
    );

    const limit = input.limit ?? 20;
    return result.data.slice(0, limit);
  }

  async getTask(taskGid: string): Promise<AsanaTask> {
    const params = new URLSearchParams({
      opt_fields: "gid,name,notes,completed,due_on,assignee.name,projects.name,permalink_url",
    });
    const result = await this.request<AsanaItemResponse<AsanaTask>>(`/tasks/${taskGid}?${params}`);
    return result.data;
  }

  async createTask(input: {
    name: string;
    workspaceGid?: string;
    projectGid?: string;
    notes?: string;
    dueOn?: string;
  }): Promise<AsanaTask> {
    const data: Record<string, unknown> = { name: input.name };
    if (input.notes) data.notes = input.notes;
    if (input.dueOn) data.due_on = input.dueOn;
    if (input.projectGid) data.projects = [input.projectGid];
    else if (input.workspaceGid) data.workspace = input.workspaceGid;

    const result = await this.request<AsanaItemResponse<AsanaTask>>("/tasks", {
      method: "POST",
      body: JSON.stringify({ data }),
    });

    return this.getTask(result.data.gid);
  }

  async updateTask(
    taskGid: string,
    input: {
      name?: string;
      notes?: string;
      completed?: boolean;
      dueOn?: string | null;
    },
  ): Promise<AsanaTask> {
    const data: Record<string, unknown> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.notes !== undefined) data.notes = input.notes;
    if (input.completed !== undefined) data.completed = input.completed;
    if (input.dueOn !== undefined) data.due_on = input.dueOn;

    await this.request<AsanaItemResponse<AsanaTask>>(`/tasks/${taskGid}`, {
      method: "PUT",
      body: JSON.stringify({ data }),
    });

    return this.getTask(taskGid);
  }

  async addComment(taskGid: string, text: string): Promise<AsanaStory> {
    const result = await this.request<AsanaItemResponse<AsanaStory>>(`/tasks/${taskGid}/stories`, {
      method: "POST",
      body: JSON.stringify({ data: { text } }),
    });
    return result.data;
  }
}

export function createClientFromEnv(): AsanaClient {
  const token = process.env.ASANA_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Missing ASANA_ACCESS_TOKEN environment variable");
  }
  return new AsanaClient(token);
}
