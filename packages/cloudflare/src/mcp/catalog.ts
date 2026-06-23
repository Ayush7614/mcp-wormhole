/** Canonical tool names — keep in sync with registerCloudflareTools. */
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

export const CLOUDFLARE_PROMPT_NAMES = [
  "dns_audit",
  "cache_purge_plan",
  "workers_inventory",
  "zone_health_snapshot",
  "firewall_rules_review",
  "incident_dns_check",
] as const;

export const CLOUDFLARE_RESOURCE_URIS = [
  "cf://catalog",
  "cf://zones",
  "cf://zone/{zone_id}",
  "cf://zone/{zone_id}/dns",
] as const;

export const CLOUDFLARE_TOOL_COUNT = CLOUDFLARE_TOOL_NAMES.length;
export const CLOUDFLARE_PROMPT_COUNT = CLOUDFLARE_PROMPT_NAMES.length;
export const CLOUDFLARE_RESOURCE_TEMPLATE_COUNT = CLOUDFLARE_RESOURCE_URIS.length;
