export interface VercelUser {
  id: string;
  email?: string;
  name?: string | null;
  username?: string;
  defaultTeamId?: string;
}

export interface VercelTeam {
  id: string;
  slug: string;
  name: string;
}

export interface VercelProjectSummary {
  id: string;
  name: string;
  framework?: string | null;
  updatedAt?: number;
  createdAt?: number;
  link?: { type?: string; repo?: string } | null;
}

export interface VercelDeploymentSummary {
  uid: string;
  name: string;
  url?: string | null;
  state?: string;
  readyState?: string;
  target?: string | null;
  createdAt?: number;
  creator?: { username?: string; email?: string };
  meta?: Record<string, string>;
}

export interface VercelDeploymentEvent {
  type: string;
  created: number;
  payload?: { text?: string; [key: string]: unknown };
}

export class VercelError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
    this.name = "VercelError";
  }
}

type QueryValue = string | number | boolean | undefined;

export class VercelClient {
  private readonly baseUrl = "https://api.vercel.com";
  private teamIdResolved = false;

  constructor(
    private readonly token: string,
    private teamId?: string,
  ) {
    if (!token.trim()) {
      throw new Error("VERCEL_TOKEN is required");
    }
  }

  private async ensureTeamScope(): Promise<void> {
    if (this.teamId || this.teamIdResolved) return;
    this.teamIdResolved = true;
    try {
      const result = await this.request<{ user: { defaultTeamId?: string } }>(`/v2/user`);
      if (result.user?.defaultTeamId) {
        this.teamId = result.user.defaultTeamId;
      }
    } catch {
      // Personal account or token without user scope — proceed without teamId.
    }
  }

  private buildQuery(params?: Record<string, QueryValue>): string {
    const search = new URLSearchParams();
    if (this.teamId) search.set("teamId", this.teamId);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) search.set(key, String(value));
      }
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
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
      throw new VercelError(`Vercel API error (${response.status})`, response.status, text);
    }

    if (!text) return {} as T;
    return JSON.parse(text) as T;
  }

  async getUser(): Promise<VercelUser> {
    const result = await this.request<{ user: VercelUser }>(`/v2/user${this.buildQuery()}`);
    return result.user;
  }

  async listTeams(limit = 20): Promise<VercelTeam[]> {
    await this.ensureTeamScope();
    try {
      const result = await this.request<{ teams: VercelTeam[] }>(
        `/v2/teams${this.buildQuery({ limit })}`,
      );
      return result.teams ?? [];
    } catch (error) {
      if (error instanceof VercelError && error.status === 403) {
        return [];
      }
      throw error;
    }
  }

  async listProjects(options?: { limit?: number; search?: string }): Promise<VercelProjectSummary[]> {
    await this.ensureTeamScope();
    const result = await this.request<{ projects: VercelProjectSummary[] }>(
      `/v10/projects${this.buildQuery({
        limit: options?.limit ?? 20,
        search: options?.search,
      })}`,
    );
    return result.projects ?? [];
  }

  async getProject(idOrName: string): Promise<VercelProjectSummary & Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(`/v9/projects/${encodeURIComponent(idOrName)}${this.buildQuery()}`);
  }

  async listDeployments(options?: {
    projectId?: string;
    limit?: number;
    target?: string;
    state?: string;
    branch?: string;
    rollbackCandidate?: boolean;
  }): Promise<VercelDeploymentSummary[]> {
    await this.ensureTeamScope();
    const result = await this.request<{ deployments: VercelDeploymentSummary[] }>(
      `/v6/deployments${this.buildQuery({
        projectId: options?.projectId,
        limit: options?.limit ?? 20,
        target: options?.target,
        state: options?.state,
        branch: options?.branch,
        rollbackCandidate: options?.rollbackCandidate,
      })}`,
    );
    return result.deployments ?? [];
  }

  async getDeployment(idOrUrl: string): Promise<Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(
      `/v13/deployments/${encodeURIComponent(idOrUrl)}${this.buildQuery()}`,
    );
  }

  async getDeploymentEvents(
    idOrUrl: string,
    limit = 100,
  ): Promise<VercelDeploymentEvent[]> {
    await this.ensureTeamScope();
    const result = await this.request<VercelDeploymentEvent[] | { events?: VercelDeploymentEvent[] }>(
      `/v3/deployments/${encodeURIComponent(idOrUrl)}/events${this.buildQuery({ limit })}`,
    );
    return Array.isArray(result) ? result : (result.events ?? []);
  }

  async listProjectDomains(projectIdOrName: string): Promise<Record<string, unknown>[]> {
    await this.ensureTeamScope();
    const result = await this.request<{ domains?: Record<string, unknown>[] }>(
      `/v9/projects/${encodeURIComponent(projectIdOrName)}/domains${this.buildQuery()}`,
    );
    return result.domains ?? [];
  }

  async promote(projectId: string, deploymentId: string): Promise<Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(
      `/v10/projects/${encodeURIComponent(projectId)}/promote/${encodeURIComponent(deploymentId)}${this.buildQuery()}`,
      { method: "POST" },
    );
  }

  async rollback(
    projectId: string,
    deploymentId: string,
    description?: string,
  ): Promise<Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(
      `/v1/projects/${encodeURIComponent(projectId)}/rollback/${encodeURIComponent(deploymentId)}${this.buildQuery({ description })}`,
      { method: "POST" },
    );
  }

  async cancelDeployment(deploymentId: string): Promise<Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(
      `/v12/deployments/${encodeURIComponent(deploymentId)}/cancel${this.buildQuery()}`,
      { method: "PATCH" },
    );
  }

  async getTeam(teamId: string): Promise<Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(`/v2/teams/${encodeURIComponent(teamId)}${this.buildQuery()}`);
  }

  async listEnvVars(projectIdOrName: string): Promise<Record<string, unknown>[]> {
    await this.ensureTeamScope();
    const result = await this.request<{ envs?: Record<string, unknown>[] }>(
      `/v10/projects/${encodeURIComponent(projectIdOrName)}/env${this.buildQuery()}`,
    );
    return result.envs ?? [];
  }

  async createEnvVar(
    projectIdOrName: string,
    input: {
      key: string;
      value: string;
      target?: string[];
      type?: "encrypted" | "plain" | "secret" | "system";
    },
  ): Promise<Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(
      `/v10/projects/${encodeURIComponent(projectIdOrName)}/env${this.buildQuery()}`,
      {
        method: "POST",
        body: JSON.stringify({
          key: input.key,
          value: input.value,
          target: input.target ?? ["production", "preview", "development"],
          type: input.type ?? "encrypted",
        }),
      },
    );
  }

  async updateEnvVar(
    projectIdOrName: string,
    envId: string,
    input: { value?: string; target?: string[] },
  ): Promise<Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(
      `/v10/projects/${encodeURIComponent(projectIdOrName)}/env/${encodeURIComponent(envId)}${this.buildQuery()}`,
      { method: "PATCH", body: JSON.stringify(input) },
    );
  }

  async deleteEnvVar(projectIdOrName: string, envId: string): Promise<Record<string, unknown>> {
    await this.ensureTeamScope();
    return this.request(
      `/v10/projects/${encodeURIComponent(projectIdOrName)}/env/${encodeURIComponent(envId)}${this.buildQuery()}`,
      { method: "DELETE" },
    );
  }

  async getLatestProductionDeployment(
    projectId: string,
  ): Promise<VercelDeploymentSummary | null> {
    const deployments = await this.listDeployments({
      projectId,
      limit: 1,
      target: "production",
      state: "READY",
    });
    return deployments[0] ?? null;
  }
}

export function createClientFromEnv(): VercelClient {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error("Missing VERCEL_TOKEN environment variable");
  }
  const teamId = process.env.VERCEL_TEAM_ID?.trim() || undefined;
  return new VercelClient(token, teamId);
}
