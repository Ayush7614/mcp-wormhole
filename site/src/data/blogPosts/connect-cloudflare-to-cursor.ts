import type { BlogPost } from "../blogTypes";
import { cloudflareCursorFlow } from "../blogPosterConnections";

export const connectCloudflareToCursor: BlogPost = {
  slug: "connect-cloudflare-to-cursor",
  title: "Connect Cloudflare to Cursor in 5 minutes",
  excerpt:
    "Complete walkthrough: API token setup, mcp.json config, verification, example prompts, and troubleshooting for Cursor + Cloudflare MCP.",
  date: "2026-06-26",
  author: "Ayush Kumar",
  tags: ["cloudflare", "cursor", "tutorial", "dns"],
  readTime: "8 min",
  poster: {
    posterAsset: "demo/posters/poster-connect-cloudflare-cursor.gif",
    eyebrow: "BLOG / TUTORIAL",
    headline: "Cloudflare MCP for Cursor",
    tagline:
      "Paste one JSON block into mcp.json and ask Cursor to list zones, manage DNS, and purge cache.",
    badge: "5 MIN SETUP",
    connection: cloudflareCursorFlow,
    stats: [
      { value: "5 min", label: "Setup" },
      { value: "14", label: "Tools" },
      { value: "Cursor", label: "Client" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "Create a User API token at dash.cloudflare.com/profile/api-tokens using the Edit zone DNS template + Zone Read.",
        "Add @mcp-wormhole/cloudflare to ~/.cursor/mcp.json with CLOUDFLARE_API_TOKEN.",
        "Optional: set CLOUDFLARE_ZONE_ID and CLOUDFLARE_ACCOUNT_ID for defaults.",
        "Fully quit and reopen Cursor — MCP servers load at startup.",
        "Ask naturally: \"List my Cloudflare zones\" or \"Show DNS records for my zone.\"",
        "Full interactive guide: /guides/cursor/cloudflare on the docs site.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "Cursor's agent can manage DNS, purge cache, and inspect Workers — but only if Cloudflare is wired up through MCP first. This guide connects @mcp-wormhole/cloudflare so your agent can manage infrastructure without leaving the editor.",
    },
    {
      type: "p",
      text: "The server runs locally via npx. No repo clone, no Docker, no cloud proxy. Your API token stays in your MCP config env block on your machine.",
    },
    {
      type: "diagram",
      title: "Cursor + Cloudflare MCP architecture",
      code: `┌──────────────────────────────────────────────────────────────┐
│  Cursor IDE                                                  │
│  ┌─────────────┐    MCP stdio     ┌────────────────────────┐ │
│  │ Agent /     │ ◄──────────────► │ npx @mcp-wormhole/     │ │
│  │ Composer    │  tools/list      │ cloudflare             │ │
│  └─────────────┘  tools/call      └───────────┬────────────┘ │
└───────────────────────────────────────────────│──────────────┘
                                                │ HTTPS + token
                                                ▼
                                     ┌─────────────────────┐
                                     │  api.cloudflare.com │
                                     │  /client/v4         │
                                     └─────────────────────┘`,
    },
    { type: "h2", text: "Prerequisites" },
    {
      type: "ul",
      items: [
        "Cursor with MCP support enabled",
        "Node.js 18+ (for npx)",
        "A Cloudflare account with at least one domain (for DNS tools)",
        "A Cloudflare API token from My Profile → API Tokens",
      ],
    },
    { type: "h2", text: "Step 1 — Create a Cloudflare API token" },
    {
      type: "ol",
      items: [
        "Open https://dash.cloudflare.com/profile/api-tokens",
        "Click Create Token → Use template: Edit zone DNS",
        "Add permission: Zone → Zone → Read (required to list zones)",
        "Zone Resources: Include → All zones from an account → your account",
        "Skip Client IP filtering and TTL → Create Token",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: "Security",
      text: "Never commit your API token to git or share it in chat logs. Keep it in mcp.json env vars only on your local machine. Rotate immediately if exposed.",
    },
    { type: "h2", text: "Step 2 — Add MCP config" },
    {
      type: "p",
      text: "Global config (all projects): ~/.cursor/mcp.json. Per-project config: .cursor/mcp.json in your repo root.",
    },
    {
      type: "code",
      language: "json",
      code: `{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your_token_here",
        "CLOUDFLARE_ZONE_ID": "optional_default_zone_id"
      }
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Default zone",
      text: "CLOUDFLARE_ZONE_ID is optional. When set, DNS and cache tools default to that zone when zone_id is omitted.",
    },
    { type: "h2", text: "Step 3 — Restart Cursor" },
    {
      type: "p",
      text: "MCP servers load at startup. A window reload is not enough — fully quit Cursor (Cmd+Q on macOS) and reopen. You should see cloudflare listed under MCP tools in settings.",
    },
    { type: "h2", text: "Step 4 — Verify it works" },
    {
      type: "p",
      text: "Open Agent or Composer and try a simple prompt. Cursor will call cf_list_zones or cf_list_dns_records under the hood.",
    },
    {
      type: "image",
      src: "demo/cloudflare-verify.gif",
      alt: "Cloudflare MCP server verification demo",
      caption: "What verification looks like — real API calls against api.cloudflare.com.",
    },
    { type: "h2", text: "Example prompts" },
    { type: "h3", text: "Read operations" },
    {
      type: "ul",
      items: [
        "List my Cloudflare zones",
        "Show DNS records for my default zone",
        "Get details for zone example.com",
        "List Workers scripts in my account",
        "Review firewall rules for my production zone",
      ],
    },
    { type: "h3", text: "Write operations" },
    {
      type: "ul",
      items: [
        "Create an A record api.example.com pointing to 192.0.2.1",
        "Update the TTL on DNS record abc123 to 300",
        "Purge all cache for zone example.com",
        "Delete DNS record xyz789 from my zone",
      ],
    },
    { type: "h2", text: "Troubleshooting" },
    { type: "h3", text: "Tools not showing up" },
    {
      type: "ul",
      items: [
        "Fully quit Cursor (not just reload window)",
        "Check mcp.json syntax with a JSON validator",
        "Run npx -y @mcp-wormhole/cloudflare manually to see startup errors",
      ],
    },
    { type: "h3", text: "Empty zone list" },
    {
      type: "ul",
      items: [
        "Add a domain to Cloudflare first — empty accounts return zero zones",
        "Ensure token has Zone → Zone → Read permission",
        "Use My Profile → API Tokens (user token), not Manage Account tokens, for simplest setup",
        "Set CLOUDFLARE_ZONE_ID manually if list zones is unavailable",
      ],
    },
    { type: "h3", text: "403 or authentication errors" },
    {
      type: "ul",
      items: [
        "Verify CLOUDFLARE_API_TOKEN is set in the env block",
        "Regenerate token if revoked or expired",
        "Confirm token has DNS Edit on the target zone",
        "Run pnpm verify in packages/cloudflare to test outside Cursor",
      ],
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "You now have Cloudflare wired into Cursor with 14 tools for zones, DNS, cache purge, Workers, and firewall rules. Start with read prompts, then try dns_audit or cache_purge_plan MCP prompt workflows for richer ops help.",
    },
    {
      type: "p",
      text: "For the full tool reference, hero demo, and copy-paste config variants, visit the Cursor + Cloudflare guide on the docs site.",
    },
  ],
};
