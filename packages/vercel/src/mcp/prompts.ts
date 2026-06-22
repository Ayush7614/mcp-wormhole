import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { VercelClient } from "../client.js";

const projectArg = {
  project_id: z.string().describe("Vercel project ID or name."),
};

function userMessage(text: string) {
  return { role: "user" as const, content: { type: "text" as const, text } };
}

export function registerVercelPrompts(server: McpServer, _client: VercelClient) {
  server.registerPrompt(
    "deployment_health_check",
    {
      title: "Deployment health check",
      description: "Assess the latest production deployment for a project.",
      argsSchema: projectArg,
    },
    async ({ project_id }) => {
      return {
        messages: [
          userMessage(
            `For project ${project_id}: call vercel_get_project, vercel_get_latest_production_deployment, and vercel_get_deployment. Summarize: state, URL, target, creator, and whether production looks healthy.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "failed_deploy_triage",
    {
      title: "Failed deploy triage",
      description: "Find failed deployments and extract build errors from logs.",
      argsSchema: {
        ...projectArg,
        limit: z.number().int().min(1).max(20).optional(),
      },
    },
    async ({ project_id, limit }) => {
      const n = limit ?? 5;
      return {
        messages: [
          userMessage(
            `Use vercel_list_failed_deployments for project ${project_id} (limit ${n}). For each failure, call vercel_get_deployment_events and extract the error lines. Output: deployment ID, branch, error summary, suggested fix.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "production_rollback_plan",
    {
      title: "Production rollback plan",
      description: "Identify rollback candidates and recommend a safe rollback target.",
      argsSchema: projectArg,
    },
    async ({ project_id }) => {
      return {
        messages: [
          userMessage(
            `For project ${project_id}: call vercel_get_latest_production_deployment, vercel_list_deployments with rollback_candidate=true and target=production. Recommend which deployment to roll back to and why. Do NOT call vercel_rollback unless the user explicitly confirms.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "project_status_snapshot",
    {
      title: "Project status snapshot",
      description: "Executive snapshot of a Vercel project — framework, domains, latest deploys.",
      argsSchema: projectArg,
    },
    async ({ project_id }) => {
      return {
        messages: [
          userMessage(
            `Gather vercel_get_project, vercel_list_project_domains, vercel_list_deployments (limit 5), and vercel_get_latest_production_deployment for ${project_id}. Write a concise status snapshot suitable for Slack.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "build_log_analysis",
    {
      title: "Build log analysis",
      description: "Parse build events and highlight errors, warnings, and timing.",
      argsSchema: {
        deployment_id: z.string().describe("Deployment ID or URL."),
      },
    },
    async ({ deployment_id }) => {
      return {
        messages: [
          userMessage(
            `Call vercel_get_deployment and vercel_get_deployment_events for ${deployment_id}. Summarize build phases, surface errors/warnings, and estimate root cause.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "rollback_candidate_review",
    {
      title: "Rollback candidate review",
      description: "Compare rollback-eligible deployments for a project.",
      argsSchema: projectArg,
    },
    async ({ project_id }) => {
      return {
        messages: [
          userMessage(
            `Use vercel_list_deployments with project_id=${project_id}, target=production, rollback_candidate=true. Compare candidates by age, git meta, and state. Rank best rollback options.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "release_readiness_check",
    {
      title: "Release readiness check",
      description: "Pre-promote checklist for a preview deployment.",
      argsSchema: {
        project_id: z.string().describe("Project ID or name."),
        deployment_id: z.string().describe("Preview deployment to evaluate."),
      },
    },
    async ({ project_id, deployment_id }) => {
      return {
        messages: [
          userMessage(
            `For project ${project_id} deployment ${deployment_id}: verify state=READY via vercel_get_deployment, scan vercel_get_deployment_events for errors, check vercel_list_env_vars for missing production secrets. Return go/no-go with blockers.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "domain_audit",
    {
      title: "Domain audit",
      description: "List and validate domains attached to a project.",
      argsSchema: projectArg,
    },
    async ({ project_id }) => {
      return {
        messages: [
          userMessage(
            `Call vercel_list_project_domains and vercel_get_project for ${project_id}. Report custom domains, verification status, and any misconfigurations.`,
          ),
        ],
      };
    },
  );
}
