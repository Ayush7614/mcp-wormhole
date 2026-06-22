export type ServerStatus = "available" | "in-progress" | "planned";

import {
  ASANA_PROMPT_COUNT,
  ASANA_RESOURCE_TEMPLATE_COUNT,
  ASANA_TOOL_NAMES,
  asanaServerDescription,
} from "./asanaCatalog";
import { VERCEL_TOOL_NAMES, vercelServerDescription } from "./vercelCatalog";

export interface EnvVar {
  key: string;
  description: string;
  docsUrl?: string;
}

export interface McpServer {
  id: string;
  name: string;
  description: string;
  status: ServerStatus;
  npmPackage: string;
  auth: string;
  env: EnvVar[];
  tools: string[];
  promptCount?: number;
  resourceTemplateCount?: number;
  docsUrl?: string;
  demoAsset?: string;
}

export const servers: McpServer[] = [
  {
    id: "asana",
    name: "Asana",
    description: asanaServerDescription(),
    status: "available",
    npmPackage: "@mcp-wormhole/asana",
    auth: "Personal Access Token",
    env: [
      {
        key: "ASANA_ACCESS_TOKEN",
        description: "Asana Personal Access Token",
        docsUrl: "https://app.asana.com/0/my-apps",
      },
    ],
    tools: [...ASANA_TOOL_NAMES],
    promptCount: ASANA_PROMPT_COUNT,
    resourceTemplateCount: ASANA_RESOURCE_TEMPLATE_COUNT,
    docsUrl: "https://developers.asana.com/reference/rest-api-reference",
    demoAsset: "demo/asana-verify.gif",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Search channels, read threads, post messages.",
    status: "planned",
    npmPackage: "@mcp-wormhole/slack",
    auth: "Bot token",
    env: [{ key: "SLACK_BOT_TOKEN", description: "Slack Bot User OAuth Token" }],
    tools: ["slack_search_messages", "slack_post_message", "slack_list_channels"],
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Search issues, inspect events, resolve and assign.",
    status: "planned",
    npmPackage: "@mcp-wormhole/sentry",
    auth: "Auth token",
    env: [{ key: "SENTRY_AUTH_TOKEN", description: "Sentry user auth token" }],
    tools: ["sentry_search_issues", "sentry_get_issue", "sentry_resolve_issue"],
  },
  {
    id: "vercel",
    name: "Vercel",
    description: vercelServerDescription(),
    status: "available",
    npmPackage: "@mcp-wormhole/vercel",
    auth: "API token",
    env: [
      {
        key: "VERCEL_TOKEN",
        description: "Vercel API token",
        docsUrl: "https://vercel.com/account/tokens",
      },
      {
        key: "VERCEL_TEAM_ID",
        description: "Optional team ID for team-scoped requests",
      },
    ],
    tools: [...VERCEL_TOOL_NAMES],
    docsUrl: "https://vercel.com/docs/rest-api",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "List events, find free slots, create and update meetings.",
    status: "planned",
    npmPackage: "@mcp-wormhole/google-calendar",
    auth: "OAuth",
    env: [{ key: "GOOGLE_CALENDAR_CREDENTIALS", description: "OAuth credentials JSON" }],
    tools: ["gcal_list_events", "gcal_create_event", "gcal_find_free_slots"],
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Query bases, list records, create and update rows.",
    status: "planned",
    npmPackage: "@mcp-wormhole/airtable",
    auth: "Personal Access Token",
    env: [{ key: "AIRTABLE_PAT", description: "Airtable personal access token" }],
    tools: ["airtable_list_records", "airtable_create_record", "airtable_search"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Customers, subscriptions, invoices, and payment status.",
    status: "planned",
    npmPackage: "@mcp-wormhole/stripe",
    auth: "Secret key",
    env: [{ key: "STRIPE_SECRET_KEY", description: "Stripe secret API key" }],
    tools: ["stripe_search_customers", "stripe_get_subscription", "stripe_list_invoices"],
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "DNS records, cache purge, Workers, and firewall rules.",
    status: "planned",
    npmPackage: "@mcp-wormhole/cloudflare",
    auth: "API token",
    env: [{ key: "CLOUDFLARE_API_TOKEN", description: "Cloudflare API token" }],
    tools: ["cf_list_dns", "cf_purge_cache", "cf_list_workers"],
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    description: "Workflow runs, logs, reruns, and PR checks.",
    status: "planned",
    npmPackage: "@mcp-wormhole/github-actions",
    auth: "Personal Access Token",
    env: [{ key: "GITHUB_TOKEN", description: "GitHub PAT with actions scope" }],
    tools: ["gh_list_runs", "gh_rerun_job", "gh_get_logs"],
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Incidents, on-call schedules, acknowledge and resolve.",
    status: "planned",
    npmPackage: "@mcp-wormhole/pagerduty",
    auth: "API key",
    env: [{ key: "PAGERDUTY_API_KEY", description: "PagerDuty REST API key" }],
    tools: ["pd_list_incidents", "pd_acknowledge", "pd_resolve"],
  },
  {
    id: "linear",
    name: "Linear",
    description: "Issues, teams, and comments. (Official Linear MCP also available.)",
    status: "planned",
    npmPackage: "@mcp-wormhole/linear",
    auth: "API key",
    env: [{ key: "LINEAR_API_KEY", description: "Linear API key" }],
    tools: ["linear_create_issue", "linear_search_issues", "linear_add_comment"],
  },
];

export function getServer(id: string): McpServer | undefined {
  return servers.find((server) => server.id === id);
}
