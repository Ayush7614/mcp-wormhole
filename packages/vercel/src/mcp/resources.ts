import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { VercelClient } from "../client.js";
import {
  VERCEL_PROMPT_NAMES,
  VERCEL_RESOURCE_URIS,
  VERCEL_TOOL_NAMES,
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

export function registerVercelResources(server: McpServer, client: VercelClient) {
  server.registerResource(
    "vercel_catalog",
    "vercel://catalog",
    {
      title: "Vercel MCP catalog",
      description: "Tool, prompt, and resource index for mcp-wormhole Vercel.",
      mimeType: "application/json",
    },
    async (uri) =>
      textResource(uri.href, {
        server: "mcp-wormhole-vercel",
        tools: VERCEL_TOOL_NAMES.length,
        tool_names: VERCEL_TOOL_NAMES,
        prompts: VERCEL_PROMPT_NAMES.length,
        prompt_names: VERCEL_PROMPT_NAMES,
        resource_templates: VERCEL_RESOURCE_URIS,
      }),
  );

  server.registerResource(
    "vercel_projects",
    "vercel://projects",
    {
      title: "All projects",
      description: "Browse Vercel projects accessible to your token.",
      mimeType: "application/json",
    },
    async (uri) => textResource(uri.href, { projects: await client.listProjects({ limit: 50 }) }),
  );

  server.registerResource(
    "vercel_project",
    new ResourceTemplate("vercel://project/{project_id}", {
      list: async () => {
        const projects = await client.listProjects({ limit: 50 });
        return {
          resources: projects.map((p) => ({
            uri: `vercel://project/${p.id}`,
            name: p.name,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        project_id: async () => (await client.listProjects({ limit: 50 })).map((p) => p.id),
      },
    }),
    {
      title: "Project",
      description: "Project metadata and navigation links.",
      mimeType: "application/json",
    },
    async (uri, { project_id }) => {
      const id = param(project_id);
      const project = await client.getProject(id);
      return textResource(uri.href, {
        project_id: id,
        project,
        browse: {
          deployments: `vercel://project/${id}/deployments`,
        },
      });
    },
  );

  server.registerResource(
    "vercel_project_deployments",
    new ResourceTemplate("vercel://project/{project_id}/deployments", {
      list: undefined,
      complete: {
        project_id: async () => (await client.listProjects({ limit: 50 })).map((p) => p.id),
      },
    }),
    {
      title: "Project deployments",
      description: "Recent deployments for a project.",
      mimeType: "application/json",
    },
    async (uri, { project_id }) => {
      const id = param(project_id);
      const deployments = await client.listDeployments({ projectId: id, limit: 20 });
      return textResource(uri.href, { project_id: id, deployments });
    },
  );

  server.registerResource(
    "vercel_deployment",
    new ResourceTemplate("vercel://deployment/{deployment_id}", {
      list: undefined,
      complete: {
        deployment_id: async () => [],
      },
    }),
    {
      title: "Deployment",
      description: "Single deployment record.",
      mimeType: "application/json",
    },
    async (uri, { deployment_id }) => {
      const id = param(deployment_id);
      const deployment = await client.getDeployment(id);
      return textResource(uri.href, { deployment_id: id, deployment });
    },
  );
}
