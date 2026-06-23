export type ServerStatus = "available" | "in-progress" | "planned";

import {
  ASANA_PROMPT_COUNT,
  ASANA_RESOURCE_TEMPLATE_COUNT,
  ASANA_TOOL_NAMES,
  asanaServerDescription,
} from "./asanaCatalog";
import { VERCEL_TOOL_NAMES, VERCEL_PROMPT_COUNT, VERCEL_RESOURCE_TEMPLATE_COUNT, vercelServerDescription } from "./vercelCatalog";
import {
  GCAL_TOOL_NAMES,
  GCAL_PROMPT_COUNT,
  GCAL_RESOURCE_TEMPLATE_COUNT,
  googleCalendarServerDescription,
} from "./googleCalendarCatalog";
import {
  LINEAR_TOOL_NAMES,
  LINEAR_PROMPT_COUNT,
  LINEAR_RESOURCE_TEMPLATE_COUNT,
  linearServerDescription,
} from "./linearCatalog";
import {
  CLOUDFLARE_TOOL_NAMES,
  CLOUDFLARE_PROMPT_COUNT,
  CLOUDFLARE_RESOURCE_TEMPLATE_COUNT,
  cloudflareServerDescription,
} from "./cloudflareCatalog";

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
  /** Hide npm version/download shields (e.g. while stats propagate). */
  hideNpmBadges?: boolean;
}

export function shouldShowNpmBadges(server: McpServer): boolean {
  return server.status === "available" && !server.hideNpmBadges;
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
    promptCount: VERCEL_PROMPT_COUNT,
    resourceTemplateCount: VERCEL_RESOURCE_TEMPLATE_COUNT,
    docsUrl: "https://vercel.com/docs/rest-api",
    demoAsset: "demo/vercel-verify.gif",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: googleCalendarServerDescription(),
    status: "available",
    npmPackage: "@mcp-wormhole/google-calendar",
    auth: "OAuth2 / service account",
    env: [
      {
        key: "GOOGLE_CALENDAR_CREDENTIALS",
        description: "OAuth2 credentials JSON (refresh_token) or service account JSON",
        docsUrl: "https://developers.google.com/calendar/api/guides/auth",
      },
      {
        key: "GOOGLE_CALENDAR_ID",
        description: "Optional default calendar ID (default: primary)",
      },
    ],
    tools: [...GCAL_TOOL_NAMES],
    promptCount: GCAL_PROMPT_COUNT,
    resourceTemplateCount: GCAL_RESOURCE_TEMPLATE_COUNT,
    docsUrl: "https://developers.google.com/calendar/api/v3/reference",
    demoAsset: "demo/google-calendar-verify.gif",
    hideNpmBadges: true,
  },
  {
    id: "linear",
    name: "Linear",
    description: linearServerDescription(),
    status: "available",
    npmPackage: "@mcp-wormhole/linear",
    auth: "API key",
    env: [
      {
        key: "LINEAR_API_KEY",
        description: "Linear personal API key",
        docsUrl: "https://linear.app/settings/account/security",
      },
      {
        key: "LINEAR_TEAM_ID",
        description: "Optional default team ID",
      },
    ],
    tools: [...LINEAR_TOOL_NAMES],
    promptCount: LINEAR_PROMPT_COUNT,
    resourceTemplateCount: LINEAR_RESOURCE_TEMPLATE_COUNT,
    docsUrl: "https://developers.linear.app/docs/graphql/working-with-the-graphql-api",
    demoAsset: "demo/linear-verify.gif",
    hideNpmBadges: true,
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: cloudflareServerDescription(),
    status: "available",
    npmPackage: "@mcp-wormhole/cloudflare",
    auth: "API token",
    env: [
      {
        key: "CLOUDFLARE_API_TOKEN",
        description: "Cloudflare API token",
        docsUrl: "https://dash.cloudflare.com/profile/api-tokens",
      },
      {
        key: "CLOUDFLARE_ACCOUNT_ID",
        description: "Optional default account ID for Workers",
      },
      {
        key: "CLOUDFLARE_ZONE_ID",
        description: "Optional default zone ID for DNS/cache/firewall",
      },
    ],
    tools: [...CLOUDFLARE_TOOL_NAMES],
    promptCount: CLOUDFLARE_PROMPT_COUNT,
    resourceTemplateCount: CLOUDFLARE_RESOURCE_TEMPLATE_COUNT,
    docsUrl: "https://developers.cloudflare.com/api/",
    demoAsset: "demo/cloudflare-verify.gif",
    hideNpmBadges: true,
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
];

export function getServer(id: string): McpServer | undefined {
  return servers.find((server) => server.id === id);
}
