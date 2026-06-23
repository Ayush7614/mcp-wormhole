/** Site catalog — mirrors packages/cloudflare/src/mcp/catalog.ts */
export const CLOUDFLARE_TOOL_NAMES = [
  "cf_verify_token",
  "cf_get_user",
  "cf_list_accounts",
  "cf_list_zones",
  "cf_get_zone",
  "cf_list_dns_records",
  "cf_get_dns_record",
  "cf_create_dns_record",
  "cf_update_dns_record",
  "cf_delete_dns_record",
  "cf_purge_cache",
  "cf_list_workers",
  "cf_get_worker",
  "cf_list_firewall_rules",
] as const;

export const CLOUDFLARE_PROMPT_COUNT = 6;
export const CLOUDFLARE_RESOURCE_TEMPLATE_COUNT = 4;

export const CLOUDFLARE_TOOL_COUNT = CLOUDFLARE_TOOL_NAMES.length;

export function cloudflareServerDescription(): string {
  return `Full-stack Cloudflare MCP — ${CLOUDFLARE_TOOL_COUNT} tools, ${CLOUDFLARE_PROMPT_COUNT} prompt workflows, and ${CLOUDFLARE_RESOURCE_TEMPLATE_COUNT} browsable resources.`;
}

export function cloudflareToolSummary(): string {
  return `${CLOUDFLARE_TOOL_COUNT} tools · ${CLOUDFLARE_PROMPT_COUNT} prompts · ${CLOUDFLARE_RESOURCE_TEMPLATE_COUNT} resources`;
}
