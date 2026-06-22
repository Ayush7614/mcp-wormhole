import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { VercelClient } from "../client.js";
import { json, toolError } from "./helpers.js";

const projectId = z.string().describe("Vercel project ID or name.");
const deploymentId = z.string().describe("Vercel deployment ID or URL.");
const limit = z.number().int().min(1).max(100).optional();

function wrap(client: VercelClient, fn: () => Promise<unknown>) {
  return async () => {
    try {
      return json(await fn());
    } catch (error) {
      return toolError(error);
    }
  };
}

export function registerVercelTools(server: McpServer, client: VercelClient) {
  server.registerTool(
    "vercel_get_user",
    {
      title: "Get current user",
      description: "Authenticated Vercel user profile.",
      inputSchema: {},
    },
    wrap(client, () => client.getUser()),
  );

  server.registerTool(
    "vercel_list_teams",
    {
      title: "List teams",
      description: "Teams accessible to the token. Use team IDs with VERCEL_TEAM_ID for team-scoped requests.",
      inputSchema: { limit: limit.describe("Max teams to return (default 20).") },
    },
    async ({ limit: teamLimit }) => {
      try {
        return json({ teams: await client.listTeams(teamLimit ?? 20) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_list_projects",
    {
      title: "List projects",
      description: "Projects for the authenticated user or team.",
      inputSchema: {
        limit: limit.describe("Max projects (default 20)."),
        search: z.string().optional().describe("Filter by project name."),
      },
    },
    async ({ limit: projectLimit, search }) => {
      try {
        return json({
          projects: await client.listProjects({ limit: projectLimit ?? 20, search }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_get_project",
    {
      title: "Get project",
      description: "Project details by ID or name — framework, link, production deployment, etc.",
      inputSchema: { project_id: projectId },
    },
    async ({ project_id }) => {
      try {
        return json(await client.getProject(project_id));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_list_deployments",
    {
      title: "List deployments",
      description: "Deployments for a project or account. Filter by target (production/preview), state, or branch.",
      inputSchema: {
        project_id: projectId.optional(),
        limit: limit.describe("Max deployments (default 20)."),
        target: z.enum(["production", "preview"]).optional(),
        state: z
          .enum(["BUILDING", "ERROR", "INITIALIZING", "QUEUED", "READY", "CANCELED"])
          .optional(),
        branch: z.string().optional(),
        rollback_candidate: z.boolean().optional().describe("Only deployments eligible for rollback."),
      },
    },
    async ({ project_id, limit: depLimit, target, state, branch, rollback_candidate }) => {
      try {
        return json({
          deployments: await client.listDeployments({
            projectId: project_id,
            limit: depLimit ?? 20,
            target,
            state,
            branch,
            rollbackCandidate: rollback_candidate,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_get_deployment",
    {
      title: "Get deployment",
      description: "Full deployment record by ID or URL.",
      inputSchema: { deployment_id: deploymentId },
    },
    async ({ deployment_id }) => {
      try {
        return json(await client.getDeployment(deployment_id));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_get_deployment_events",
    {
      title: "Get deployment build logs",
      description: "Build/deploy event stream for a deployment (stdout-style log lines).",
      inputSchema: {
        deployment_id: deploymentId,
        limit: limit.describe("Max events (default 100)."),
      },
    },
    async ({ deployment_id, limit: eventLimit }) => {
      try {
        const events = await client.getDeploymentEvents(deployment_id, eventLimit ?? 100);
        return json({ events, count: events.length });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_list_project_domains",
    {
      title: "List project domains",
      description: "Custom and assigned domains for a project.",
      inputSchema: { project_id: projectId },
    },
    async ({ project_id }) => {
      try {
        return json({ domains: await client.listProjectDomains(project_id) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_promote",
    {
      title: "Promote deployment",
      description: "Point production traffic to a deployment without rebuilding.",
      inputSchema: {
        project_id: projectId,
        deployment_id: deploymentId,
      },
    },
    async ({ project_id, deployment_id }) => {
      try {
        return json(await client.promote(project_id, deployment_id));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_rollback",
    {
      title: "Rollback deployment",
      description: "Instant rollback — route production traffic to a previous deployment.",
      inputSchema: {
        project_id: projectId,
        deployment_id: deploymentId.describe("Deployment ID to roll back TO."),
        description: z.string().optional().describe("Reason shown in deployment history."),
      },
    },
    async ({ project_id, deployment_id, description }) => {
      try {
        return json(await client.rollback(project_id, deployment_id, description));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "vercel_cancel_deployment",
    {
      title: "Cancel deployment",
      description: "Cancel a deployment that is still building.",
      inputSchema: { deployment_id: deploymentId },
    },
    async ({ deployment_id }) => {
      try {
        return json(await client.cancelDeployment(deployment_id));
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
