import type { BlogPost } from "../blogTypes";
import { cloudflareDeepFlow } from "../blogPosterConnections";

export const insideCloudflareMcpServer: BlogPost = {
  slug: "inside-cloudflare-mcp-server",
  title: "Inside @mcp-wormhole/cloudflare: 14 tools, 6 prompts, and browsable resources",
  excerpt:
    "Deep dive into the Cloudflare MCP server — architecture, DNS tools, prompt workflows, cf:// resources, and live API verification.",
  date: "2026-06-26",
  author: "Ayush Kumar",
  tags: ["cloudflare", "mcp", "deep-dive", "dns"],
  readTime: "12 min",
  poster: {
    posterAsset: "demo/posters/poster-inside-cloudflare-mcp.gif",
    eyebrow: "BLOG / DEEP DIVE",
    headline: "Inside Cloudflare MCP Server",
    tagline:
      "14 tools, 6 prompt workflows, and browsable cf:// resources — zones, DNS, cache purge, Workers, firewall.",
    badge: "v0.1.0 LIVE",
    connection: cloudflareDeepFlow,
    stats: [
      { value: "14", label: "Tools" },
      { value: "6", label: "Prompts" },
      { value: "4", label: "Resources" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "@mcp-wormhole/cloudflare@0.1.0 exposes 14 MCP tools, 6 prompt workflows, and 4 cf:// resource templates.",
        "Architecture: index.ts → mcp/{tools,prompts,resources}.ts → CloudflareClient → api.cloudflare.com/client/v4.",
        "Tools cover token verify, zones, DNS CRUD, cache purge, Workers, and legacy firewall rules.",
        "Prompts like dns_audit and cache_purge_plan guide multi-step agent infrastructure workflows.",
        "Run pnpm verify in packages/cloudflare to smoke-test against your real Cloudflare account.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "DNS and CDN ops are where agents need careful, scoped access — zone IDs, record types, and cache purge semantics matter. The Cloudflare server wraps the official API v4 as MCP tools, prompts, and browsable cf:// resources so any client can manage zones and DNS without custom glue code.",
    },
    {
      type: "diagram",
      title: "Server architecture",
      code: `┌─────────────────────────────────────────────────────────────────┐
│  index.ts                                                       │
│  McpServer + StdioServerTransport                               │
│  CLOUDFLARE_API_TOKEN → CloudflareClient                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│  mcp/tools.ts   │ │ mcp/prompts.ts  │ │ mcp/resources.ts    │
│  14 registerTool│ │ 6 registerPrompt│ │ 4 resource templates│
│  Zod schemas    │ │ workflow msgs   │ │ cf:// URIs          │
└────────┬────────┘ └────────┬────────┘ └──────────┬──────────┘
         │                   │                     │
         └───────────────────┼─────────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │  client.ts          │
                  │  CloudflareClient   │
                  │  Bearer token REST  │
                  └──────────┬──────────┘
                             │ HTTPS
                             ▼
                  ┌─────────────────────┐
                  │  api.cloudflare.com │
                  │  /client/v4         │
                  └─────────────────────┘`,
    },
    { type: "h2", text: "Getting started" },
    {
      type: "code",
      language: "json",
      code: `{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your_token_here"
      }
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Environment variables",
      text: "CLOUDFLARE_API_TOKEN is required. Optional: CLOUDFLARE_ACCOUNT_ID (Workers default), CLOUDFLARE_ZONE_ID (DNS/cache/firewall default). Supports user tokens (cfut_) and account-owned tokens (cfat_).",
    },
    { type: "h2", text: "The 14 tools — by category" },
    { type: "h3", text: "Account" },
    {
      type: "ul",
      items: [
        "cf_verify_token — validate token (user or account-owned)",
        "cf_get_user — authenticated user profile",
        "cf_list_accounts — accounts accessible to the token",
      ],
    },
    { type: "h3", text: "Zones" },
    {
      type: "ul",
      items: [
        "cf_list_zones — DNS zones for the token",
        "cf_get_zone — zone details by ID",
      ],
    },
    { type: "h3", text: "DNS" },
    {
      type: "ul",
      items: [
        "cf_list_dns_records — filter by type and name",
        "cf_get_dns_record — single record by ID",
        "cf_create_dns_record — create A, CNAME, TXT, …",
        "cf_update_dns_record — patch record fields",
        "cf_delete_dns_record — remove a record",
      ],
    },
    { type: "h3", text: "Cache, Workers, Firewall" },
    {
      type: "ul",
      items: [
        "cf_purge_cache — purge everything, URLs, tags, or hosts",
        "cf_list_workers — Workers scripts in an account",
        "cf_get_worker — script metadata by name",
        "cf_list_firewall_rules — legacy firewall rules for a zone",
      ],
    },
    { type: "h2", text: "6 MCP prompt workflows" },
    {
      type: "ul",
      items: [
        "dns_audit — review DNS records, duplicates, apex coverage",
        "cache_purge_plan — recommend safe cache purge strategy",
        "workers_inventory — list Workers scripts in an account",
        "zone_health_snapshot — zone status, DNS count, firewall rules",
        "firewall_rules_review — review legacy firewall rules",
        "incident_dns_check — DNS verification during an outage",
      ],
    },
    { type: "h2", text: "Browsable cf:// resources" },
    {
      type: "ul",
      items: [
        "cf://catalog — tool, prompt, and resource index",
        "cf://zones — all zones",
        "cf://zone/{zone_id} — zone details",
        "cf://zone/{zone_id}/dns — DNS records for a zone",
      ],
    },
    { type: "h2", text: "Verification against the live API" },
    {
      type: "image",
      src: "demo/cloudflare-verify.gif",
      alt: "Live Cloudflare API verification recording",
      caption: "pnpm verify — real API token, real calls against api.cloudflare.com.",
    },
    {
      type: "code",
      language: "bash",
      code: `cd packages/cloudflare
cp .env.example .env   # add CLOUDFLARE_API_TOKEN
pnpm install && pnpm build && pnpm verify`,
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "@mcp-wormhole/cloudflare brings DNS and CDN intelligence to any MCP client. Install with npx, paste your API token, and give your agent real access to zones, DNS, cache, Workers, and firewall rules — the same mcp-wormhole patterns as Vercel and Linear, tuned for infrastructure ops.",
    },
  ],
};
