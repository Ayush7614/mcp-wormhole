import type { BlogPost } from "../blogTypes";
import { vercelDeepFlow } from "../blogPosterConnections";

export const insideVercelMcpServer: BlogPost = {
  slug: "inside-vercel-mcp-server",
  title: "Inside @mcp-wormhole/vercel: 18 tools, 8 prompts, and browsable resources",
  excerpt:
    "Deep dive into the Vercel MCP server — architecture, deployment tools, prompt workflows, vercel:// resources, and live API verification.",
  date: "2026-06-23",
  author: "Ayush Kumar",
  tags: ["vercel", "mcp", "deep-dive", "deployments"],
  readTime: "14 min",
  poster: {
    posterAsset: "demo/posters/poster-inside-vercel-mcp.gif",
    eyebrow: "BLOG / DEEP DIVE",
    headline: "Inside Vercel MCP Server",
    tagline: "18 tools, 8 prompt workflows, and browsable vercel:// resources — deployments, logs, env vars, rollback.",
    badge: "v0.2.0 LIVE",
    connection: vercelDeepFlow,
    stats: [
      { value: "18", label: "Tools" },
      { value: "8", label: "Prompts" },
      { value: "5", label: "Resources" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "@mcp-wormhole/vercel@0.2.0 exposes 18 MCP tools, 8 prompt workflows, and 5 vercel:// resource templates.",
        "Architecture: index.ts → mcp/{tools,prompts,resources}.ts → VercelClient → api.vercel.com.",
        "Tools cover projects, deployments, build logs, domains, env vars, promote, rollback, and cancel.",
        "Prompts like failed_deploy_triage and production_rollback_plan guide multi-step agent workflows.",
        "Run pnpm verify in packages/vercel to smoke-test against your real Vercel account.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "After Asana, Vercel was the natural second server for mcp-wormhole: every team ships on Vercel, the REST API is mature, and agents constantly need deployment context — logs, production state, rollback targets. Version 0.2.0 goes beyond a thin wrapper with workflow prompts and browsable vercel:// resources.",
    },
    {
      type: "diagram",
      title: "Server architecture",
      code: `┌─────────────────────────────────────────────────────────────────┐
│  index.ts                                                       │
│  McpServer + StdioServerTransport                               │
│  VERCEL_TOKEN → new VercelClient(token, teamId?)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│  mcp/tools.ts   │ │ mcp/prompts.ts  │ │ mcp/resources.ts    │
│  18 registerTool│ │ 8 registerPrompt│ │ 5 resource templates│
│  Zod schemas    │ │ workflow msgs   │ │ vercel:// URIs      │
└────────┬────────┘ └────────┬────────┘ └──────────┬──────────┘
         │                   │                     │
         └───────────────────┼─────────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │  client.ts          │
                  │  VercelClient       │
                  │  auto team scope    │
                  └──────────┬──────────┘
                             │ HTTPS Bearer token
                             ▼
                  ┌─────────────────────┐
                  │  api.vercel.com     │
                  └─────────────────────┘`,
    },
    { type: "h2", text: "Getting started" },
    {
      type: "code",
      language: "json",
      code: `{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/vercel"],
      "env": {
        "VERCEL_TOKEN": "your_api_token"
      }
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Environment variables",
      text: "VERCEL_TOKEN is required. Optional: VERCEL_TEAM_ID for team-scoped projects. When omitted, the client auto-resolves defaultTeamId from vercel_get_user.",
    },
    { type: "h2", text: "The 18 tools — by category" },
    { type: "h3", text: "Account & teams" },
    {
      type: "ul",
      items: [
        "vercel_get_user — authenticated profile + defaultTeamId",
        "vercel_list_teams — teams for the token (graceful 403 for limited tokens)",
        "vercel_get_team — team details by ID",
      ],
    },
    { type: "h3", text: "Projects & domains" },
    {
      type: "ul",
      items: [
        "vercel_list_projects, vercel_get_project — catalog and detail",
        "vercel_list_project_domains — custom and assigned domains",
      ],
    },
    { type: "h3", text: "Deployments & logs" },
    {
      type: "ul",
      items: [
        "vercel_list_deployments — filter by target, state, branch, rollback candidates",
        "vercel_list_failed_deployments — ERROR state shortcut",
        "vercel_get_latest_production_deployment — current prod deploy",
        "vercel_get_deployment, vercel_get_deployment_events — record + build logs",
      ],
    },
    { type: "h3", text: "Environment variables" },
    {
      type: "ul",
      items: [
        "vercel_list_env_vars — keys and metadata per project",
        "vercel_create_env_var, vercel_update_env_var, vercel_delete_env_var",
      ],
    },
    { type: "h3", text: "Production ops" },
    {
      type: "ul",
      items: [
        "vercel_promote — point production to a deployment without rebuild",
        "vercel_rollback — instant rollback to a prior deployment",
        "vercel_cancel_deployment — stop in-flight builds",
      ],
    },
    { type: "h2", text: "8 MCP prompt workflows" },
    {
      type: "ul",
      items: [
        "deployment_health_check — latest production deployment health",
        "failed_deploy_triage — ERROR deploys + log extraction",
        "production_rollback_plan — rollback candidates without auto-executing",
        "project_status_snapshot — executive project summary",
        "build_log_analysis — parse build events for root cause",
        "rollback_candidate_review — compare eligible production deploys",
        "release_readiness_check — pre-promote go/no-go checklist",
        "domain_audit — domain verification and config review",
      ],
    },
    { type: "h2", text: "Browsable vercel:// resources" },
    {
      type: "ul",
      items: [
        "vercel://catalog — tool/prompt counts and name lists",
        "vercel://projects — all projects",
        "vercel://project/{project_id} — project detail",
        "vercel://project/{project_id}/deployments — recent deployments",
        "vercel://deployment/{deployment_id} — deployment record",
      ],
    },
    { type: "h2", text: "Verification against the live API" },
    {
      type: "image",
      src: "demo/vercel-verify.gif",
      alt: "Live Vercel API verification recording",
      caption: "pnpm verify — real token, real api.vercel.com calls.",
    },
    {
      type: "code",
      language: "bash",
      code: `cd packages/vercel
cp .env.example .env   # add VERCEL_TOKEN
pnpm verify`,
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "@mcp-wormhole/vercel brings deployment intelligence to any MCP client. Install with npx, paste your config, and give your agent real access to projects, logs, and production ops — the same patterns we established with Asana, tuned for how teams ship on Vercel.",
    },
  ],
};
