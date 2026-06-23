import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { CloudflareClient } from "../client.js";

const zoneArg = {
  zone_id: z.string().optional().describe("Cloudflare zone ID (defaults to CLOUDFLARE_ZONE_ID)."),
};

const accountArg = {
  account_id: z.string().optional().describe("Cloudflare account ID (defaults to CLOUDFLARE_ACCOUNT_ID)."),
};

function userMessage(text: string) {
  return { role: "user" as const, content: { type: "text" as const, text } };
}

export function registerCloudflarePrompts(server: McpServer, _client: CloudflareClient) {
  server.registerPrompt(
    "dns_audit",
    {
      title: "DNS audit",
      description: "Review DNS records across zones — duplicates, missing apex, stale records.",
      argsSchema: zoneArg,
    },
    async ({ zone_id }) => {
      return {
        messages: [
          userMessage(
            `For zone ${zone_id ?? "(default)"}: call cf_list_dns_records and cf_get_zone. Summarize record types, flag duplicate names, missing apex/root coverage, and proxied vs DNS-only records. Do not mutate unless the user confirms.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "cache_purge_plan",
    {
      title: "Cache purge plan",
      description: "Recommend a safe cache purge strategy for a deployment or content update.",
      argsSchema: {
        ...zoneArg,
        change_summary: z.string().optional().describe("What changed (e.g. static assets, API response)."),
      },
    },
    async ({ zone_id, change_summary }) => {
      return {
        messages: [
          userMessage(
            `For zone ${zone_id ?? "(default)"} after change: ${change_summary ?? "(describe the change)"}. Recommend whether to purge everything, specific files, tags, or hosts. If purging, call cf_purge_cache only after user confirmation.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "workers_inventory",
    {
      title: "Workers inventory",
      description: "List Workers scripts and summarize deployment surface.",
      argsSchema: accountArg,
    },
    async ({ account_id }) => {
      return {
        messages: [
          userMessage(
            `For account ${account_id ?? "(default)"}: call cf_list_workers. Summarize script names, created/modified dates, and suggest follow-up checks (routes, bindings) the user may want.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "zone_health_snapshot",
    {
      title: "Zone health snapshot",
      description: "Quick zone status — plan, paused state, DNS count, firewall rule count.",
      argsSchema: zoneArg,
    },
    async ({ zone_id }) => {
      return {
        messages: [
          userMessage(
            `For zone ${zone_id ?? "(default)"}: call cf_get_zone, cf_list_dns_records (limit 100), and cf_list_firewall_rules. Output a health snapshot: status, plan, paused, record count, active firewall rules.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "firewall_rules_review",
    {
      title: "Firewall rules review",
      description: "Review legacy firewall rules — paused rules, block/challenge actions, priorities.",
      argsSchema: zoneArg,
    },
    async ({ zone_id }) => {
      return {
        messages: [
          userMessage(
            `For zone ${zone_id ?? "(default)"}: call cf_list_firewall_rules. Group by action, flag paused rules, and note expressions that may overlap or be overly broad.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "incident_dns_check",
    {
      title: "Incident DNS check",
      description: "During an outage — verify DNS records and zone status for a hostname.",
      argsSchema: {
        ...zoneArg,
        hostname: z.string().optional().describe("Hostname to inspect (e.g. api.example.com)."),
      },
    },
    async ({ zone_id, hostname }) => {
      return {
        messages: [
          userMessage(
            `Incident check for ${hostname ?? "the affected hostname"} on zone ${zone_id ?? "(default)"}: call cf_get_zone and cf_list_dns_records filtered by name when possible. Report matching records, proxied status, TTL, and content. Suggest likely misconfigurations.`,
          ),
        ],
      };
    },
  );
}
