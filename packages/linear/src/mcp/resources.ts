import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { LinearClient } from "../client.js";
import {
  LINEAR_PROMPT_NAMES,
  LINEAR_RESOURCE_URIS,
  LINEAR_TOOL_NAMES,
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

function param(value: string | string[]): string {
  return Array.isArray(value) ? value[0]! : value;
}

export function registerLinearResources(server: McpServer, client: LinearClient) {
  server.registerResource(
    "linear_catalog",
    "linear://catalog",
    {
      title: "Linear MCP catalog",
      description: "Tool, prompt, and resource index for mcp-wormhole Linear.",
      mimeType: "application/json",
    },
    async (uri) =>
      textResource(uri.href, {
        server: "mcp-wormhole-linear",
        tools: LINEAR_TOOL_NAMES.length,
        tool_names: LINEAR_TOOL_NAMES,
        prompts: LINEAR_PROMPT_NAMES.length,
        prompt_names: LINEAR_PROMPT_NAMES,
        resource_templates: LINEAR_RESOURCE_URIS,
      }),
  );

  server.registerResource(
    "linear_teams",
    "linear://teams",
    {
      title: "All teams",
      description: "Browse Linear teams accessible to your API key.",
      mimeType: "application/json",
    },
    async (uri) => textResource(uri.href, { teams: await client.listTeams(50) }),
  );

  server.registerResource(
    "linear_team_issues",
    new ResourceTemplate("linear://team/{team_id}/issues", {
      list: async () => {
        const teams = await client.listTeams(50);
        return {
          resources: teams.map((team) => ({
            uri: `linear://team/${team.id}/issues`,
            name: `${team.key} issues`,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        team_id: async () => (await client.listTeams(50)).map((team) => team.id),
      },
    }),
    {
      title: "Team issues",
      description: "Recent issues for a Linear team.",
      mimeType: "application/json",
    },
    async (uri, { team_id }) => {
      const id = param(team_id);
      const issues = await client.listIssues({ teamId: id, first: 50 });
      return textResource(uri.href, { team_id: id, issues });
    },
  );

  server.registerResource(
    "linear_issue",
    new ResourceTemplate("linear://issue/{issue_id}", {
      list: async () => {
        const teamId = await client.resolveTeamId();
        const issues = await client.listIssues({ teamId, first: 25 });
        return {
          resources: issues.map((issue) => ({
            uri: `linear://issue/${issue.identifier}`,
            name: `${issue.identifier} ${issue.title}`,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        issue_id: async () => {
          const teamId = await client.resolveTeamId();
          const issues = await client.listIssues({ teamId, first: 25 });
          return issues.map((issue) => issue.identifier);
        },
      },
    }),
    {
      title: "Issue",
      description: "Full issue record.",
      mimeType: "application/json",
    },
    async (uri, { issue_id }) => {
      const id = param(issue_id);
      return textResource(uri.href, await client.getIssue(id));
    },
  );
}
