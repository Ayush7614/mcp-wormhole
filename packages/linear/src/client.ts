const LINEAR_GRAPHQL_URL = "https://api.linear.app/graphql";

export interface LinearViewer {
  id: string;
  name: string;
  email?: string | null;
  displayName?: string | null;
  admin?: boolean;
}

export interface LinearTeamSummary {
  id: string;
  name: string;
  key: string;
  description?: string | null;
}

export interface LinearUserSummary {
  id: string;
  name: string;
  email?: string | null;
  displayName?: string | null;
  active?: boolean;
}

export interface LinearProjectSummary {
  id: string;
  name: string;
  slugId?: string | null;
  state?: string | null;
  progress?: number | null;
}

export interface LinearWorkflowStateSummary {
  id: string;
  name: string;
  type: string;
  color?: string | null;
}

export interface LinearLabelSummary {
  id: string;
  name: string;
  color?: string | null;
}

export interface LinearIssueSummary {
  id: string;
  identifier: string;
  title: string;
  priority?: number;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  state?: { id: string; name: string; type?: string } | null;
  assignee?: { id: string; name: string } | null;
  team?: { id: string; key: string; name?: string } | null;
}

export interface LinearIssueDetail extends LinearIssueSummary {
  description?: string | null;
  branchName?: string | null;
  labels?: { nodes: LinearLabelSummary[] };
  project?: { id: string; name: string } | null;
}

export interface LinearCommentSummary {
  id: string;
  body: string;
  createdAt: string;
  user?: { id: string; name: string } | null;
}

export class LinearError extends Error {
  constructor(
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "LinearError";
  }
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: unknown }>;
};

export class LinearClient {
  constructor(
    private readonly apiKey: string,
    private readonly defaultTeamId?: string,
  ) {
    if (!apiKey.trim()) {
      throw new Error("LINEAR_API_KEY is required");
    }
  }

  async gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(LINEAR_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.apiKey,
      },
      body: JSON.stringify({ query, variables }),
    });

    const body = (await response.json()) as GraphQLResponse<T>;

    if (!response.ok) {
      throw new LinearError(
        `Linear API HTTP ${response.status}`,
        body.errors ?? body,
      );
    }

    if (body.errors?.length) {
      throw new LinearError(
        body.errors.map((error) => error.message).join("; "),
        body.errors,
      );
    }

    if (!body.data) {
      throw new LinearError("Linear API returned no data");
    }

    return body.data;
  }

  async resolveTeamId(teamId?: string): Promise<string> {
    if (teamId?.trim()) return teamId.trim();
    if (this.defaultTeamId?.trim()) return this.defaultTeamId.trim();
    const teams = await this.listTeams(1);
    if (teams.length === 0) {
      throw new LinearError("No teams found — set LINEAR_TEAM_ID or pass team_id");
    }
    return teams[0]!.id;
  }

  async getViewer(): Promise<LinearViewer> {
    const data = await this.gql<{ viewer: LinearViewer }>(`
      query Viewer {
        viewer {
          id
          name
          email
          displayName
          admin
        }
      }
    `);
    return data.viewer;
  }

  async listTeams(first = 25): Promise<LinearTeamSummary[]> {
    const data = await this.gql<{ teams: { nodes: LinearTeamSummary[] } }>(`
      query Teams($first: Int!) {
        teams(first: $first) {
          nodes {
            id
            name
            key
            description
          }
        }
      }
    `, { first });
    return data.teams.nodes;
  }

  async getTeam(teamId: string): Promise<LinearTeamSummary> {
    const data = await this.gql<{ team: LinearTeamSummary }>(`
      query Team($id: String!) {
        team(id: $id) {
          id
          name
          key
          description
        }
      }
    `, { id: teamId });
    return data.team;
  }

  async listUsers(first = 50): Promise<LinearUserSummary[]> {
    const data = await this.gql<{ users: { nodes: LinearUserSummary[] } }>(`
      query Users($first: Int!) {
        users(first: $first) {
          nodes {
            id
            name
            email
            displayName
            active
          }
        }
      }
    `, { first });
    return data.users.nodes;
  }

  async listProjects(teamId: string, first = 25): Promise<LinearProjectSummary[]> {
    const data = await this.gql<{ team: { projects: { nodes: LinearProjectSummary[] } } }>(`
      query TeamProjects($teamId: String!, $first: Int!) {
        team(id: $teamId) {
          projects(first: $first) {
            nodes {
              id
              name
              slugId
              state
              progress
            }
          }
        }
      }
    `, { teamId, first });
    return data.team.projects.nodes;
  }

  async listWorkflowStates(teamId: string): Promise<LinearWorkflowStateSummary[]> {
    const data = await this.gql<{ workflowStates: { nodes: LinearWorkflowStateSummary[] } }>(`
      query WorkflowStates($teamId: ID!) {
        workflowStates(filter: { team: { id: { eq: $teamId } } }) {
          nodes {
            id
            name
            type
            color
          }
        }
      }
    `, { teamId });
    return data.workflowStates.nodes;
  }

  async listLabels(teamId: string, first = 50): Promise<LinearLabelSummary[]> {
    const data = await this.gql<{ issueLabels: { nodes: LinearLabelSummary[] } }>(`
      query IssueLabels($teamId: ID!, $first: Int!) {
        issueLabels(filter: { team: { id: { eq: $teamId } } }, first: $first) {
          nodes {
            id
            name
            color
          }
        }
      }
    `, { teamId, first });
    return data.issueLabels.nodes;
  }

  async listIssues(options: {
    teamId: string;
    first?: number;
    assigneeId?: string;
    stateId?: string;
    projectId?: string;
  }): Promise<LinearIssueSummary[]> {
    const filter: Record<string, unknown> = {
      team: { id: { eq: options.teamId } },
    };
    if (options.assigneeId) {
      filter.assignee = { id: { eq: options.assigneeId } };
    }
    if (options.stateId) {
      filter.state = { id: { eq: options.stateId } };
    }
    if (options.projectId) {
      filter.project = { id: { eq: options.projectId } };
    }

    const data = await this.gql<{ issues: { nodes: LinearIssueSummary[] } }>(`
      query Issues($filter: IssueFilter, $first: Int!) {
        issues(filter: $filter, first: $first, orderBy: updatedAt) {
          nodes {
            id
            identifier
            title
            priority
            url
            createdAt
            updatedAt
            state { id name type }
            assignee { id name }
            team { id key name }
          }
        }
      }
    `, { filter, first: options.first ?? 25 });
    return data.issues.nodes;
  }

  async getIssue(issueId: string): Promise<LinearIssueDetail> {
    const data = await this.gql<{ issue: LinearIssueDetail }>(`
      query Issue($id: String!) {
        issue(id: $id) {
          id
          identifier
          title
          description
          priority
          url
          branchName
          createdAt
          updatedAt
          state { id name type }
          assignee { id name }
          team { id key name }
          project { id name }
          labels { nodes { id name color } }
        }
      }
    `, { id: issueId });
    return data.issue;
  }

  async searchIssues(query: string, teamId?: string, first = 25): Promise<LinearIssueSummary[]> {
    const filter = teamId ? { team: { id: { eq: teamId } } } : undefined;
    const data = await this.gql<{ issueSearch: { nodes: LinearIssueSummary[] } }>(`
      query SearchIssues($query: String!, $filter: IssueFilter, $first: Int!) {
        issueSearch(query: $query, filter: $filter, first: $first) {
          nodes {
            id
            identifier
            title
            priority
            url
            state { id name type }
            assignee { id name }
            team { id key name }
          }
        }
      }
    `, { query, filter, first });
    return data.issueSearch.nodes;
  }

  async createIssue(input: {
    teamId: string;
    title: string;
    description?: string;
    assigneeId?: string;
    stateId?: string;
    priority?: number;
    labelIds?: string[];
    projectId?: string;
  }): Promise<LinearIssueSummary> {
    const data = await this.gql<{
      issueCreate: { success: boolean; issue?: LinearIssueSummary };
    }>(`
      mutation CreateIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            identifier
            title
            url
            state { id name type }
            assignee { id name }
            team { id key name }
          }
        }
      }
    `, {
      input: {
        teamId: input.teamId,
        title: input.title,
        description: input.description,
        assigneeId: input.assigneeId,
        stateId: input.stateId,
        priority: input.priority,
        labelIds: input.labelIds,
        projectId: input.projectId,
      },
    });

    if (!data.issueCreate.success || !data.issueCreate.issue) {
      throw new LinearError("issueCreate failed");
    }
    return data.issueCreate.issue;
  }

  async updateIssue(
    issueId: string,
    input: {
      title?: string;
      description?: string;
      assigneeId?: string;
      stateId?: string;
      priority?: number;
      labelIds?: string[];
      projectId?: string;
    },
  ): Promise<LinearIssueSummary> {
    const data = await this.gql<{
      issueUpdate: { success: boolean; issue?: LinearIssueSummary };
    }>(`
      mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
          issue {
            id
            identifier
            title
            url
            state { id name type }
            assignee { id name }
            team { id key name }
          }
        }
      }
    `, { id: issueId, input });

    if (!data.issueUpdate.success || !data.issueUpdate.issue) {
      throw new LinearError("issueUpdate failed");
    }
    return data.issueUpdate.issue;
  }

  async addComment(issueId: string, body: string): Promise<LinearCommentSummary> {
    const data = await this.gql<{
      commentCreate: { success: boolean; comment?: LinearCommentSummary };
    }>(`
      mutation CommentCreate($input: CommentCreateInput!) {
        commentCreate(input: $input) {
          success
          comment {
            id
            body
            createdAt
            user { id name }
          }
        }
      }
    `, { input: { issueId, body } });

    if (!data.commentCreate.success || !data.commentCreate.comment) {
      throw new LinearError("commentCreate failed");
    }
    return data.commentCreate.comment;
  }

  async listComments(issueId: string, first = 25): Promise<LinearCommentSummary[]> {
    const data = await this.gql<{ issue: { comments: { nodes: LinearCommentSummary[] } } }>(`
      query IssueComments($id: String!, $first: Int!) {
        issue(id: $id) {
          comments(first: $first) {
            nodes {
              id
              body
              createdAt
              user { id name }
            }
          }
        }
      }
    `, { id: issueId, first });
    return data.issue.comments.nodes;
  }
}

export function createClientFromEnv(): LinearClient {
  const apiKey = process.env.LINEAR_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("LINEAR_API_KEY is required");
  }
  return new LinearClient(apiKey, process.env.LINEAR_TEAM_ID?.trim());
}
