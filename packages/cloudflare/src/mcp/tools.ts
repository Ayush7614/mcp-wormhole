import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { CloudflareClient } from "../client.js";
import { json, ok, toolError } from "./helpers.js";

const zoneId = z.string().optional().describe("Cloudflare zone ID (defaults to CLOUDFLARE_ZONE_ID).");
const accountId = z.string().optional().describe("Cloudflare account ID (defaults to CLOUDFLARE_ACCOUNT_ID).");
const page = z.number().int().min(1).optional();
const perPage = z.number().int().min(1).max(100).optional();

function wrap(client: CloudflareClient, fn: () => Promise<unknown>) {
  return async () => {
    try {
      return json(await fn());
    } catch (error) {
      return toolError(error);
    }
  };
}

export function registerCloudflareTools(server: McpServer, client: CloudflareClient) {
  server.registerTool(
    "cf_verify_token",
    {
      title: "Verify API token",
      description: "Validate the configured Cloudflare API token and return its status.",
      inputSchema: {},
    },
    wrap(client, () => client.verifyToken()),
  );

  server.registerTool(
    "cf_get_user",
    {
      title: "Get user",
      description: "Authenticated Cloudflare user profile.",
      inputSchema: {},
    },
    wrap(client, () => client.getUser()),
  );

  server.registerTool(
    "cf_list_accounts",
    {
      title: "List accounts",
      description: "Cloudflare accounts accessible to the API token.",
      inputSchema: {
        page: page.describe("Page number (default 1)."),
        per_page: perPage.describe("Results per page (default 20)."),
      },
    },
    async ({ page: p, per_page }) => {
      try {
        return json({ accounts: await client.listAccounts(p ?? 1, per_page ?? 20) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_list_zones",
    {
      title: "List zones",
      description: "DNS zones accessible to the API token.",
      inputSchema: {
        name: z.string().optional().describe("Filter by zone name."),
        status: z.string().optional().describe("Filter by zone status (e.g. active)."),
        page: page.describe("Page number (default 1)."),
        per_page: perPage.describe("Results per page (default 25)."),
      },
    },
    async ({ name, status, page: p, per_page }) => {
      try {
        return json({
          zones: await client.listZones({
            name,
            status,
            page: p ?? 1,
            perPage: per_page ?? 25,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_get_zone",
    {
      title: "Get zone",
      description: "Zone details by ID.",
      inputSchema: { zone_id: zoneId },
    },
    async ({ zone_id }) => {
      try {
        const resolved = await client.resolveZoneId(zone_id);
        return json(await client.getZone(resolved));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_list_dns_records",
    {
      title: "List DNS records",
      description: "DNS records for a zone.",
      inputSchema: {
        zone_id: zoneId,
        type: z.string().optional().describe("Record type filter (A, AAAA, CNAME, …)."),
        name: z.string().optional().describe("Record name filter."),
        page: page.describe("Page number (default 1)."),
        per_page: perPage.describe("Results per page (default 50)."),
      },
    },
    async ({ zone_id, type, name, page: p, per_page }) => {
      try {
        const resolved = await client.resolveZoneId(zone_id);
        return json({
          zone_id: resolved,
          records: await client.listDnsRecords(resolved, {
            type,
            name,
            page: p ?? 1,
            perPage: per_page ?? 50,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_get_dns_record",
    {
      title: "Get DNS record",
      description: "Single DNS record by ID.",
      inputSchema: {
        zone_id: zoneId,
        record_id: z.string().describe("DNS record ID."),
      },
    },
    async ({ zone_id, record_id }) => {
      try {
        const resolved = await client.resolveZoneId(zone_id);
        return json(await client.getDnsRecord(resolved, record_id));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_create_dns_record",
    {
      title: "Create DNS record",
      description: "Create a DNS record in a zone.",
      inputSchema: {
        zone_id: zoneId,
        type: z.string().describe("Record type (A, AAAA, CNAME, TXT, …)."),
        name: z.string().describe("Record name (e.g. www.example.com)."),
        content: z.string().describe("Record content / value."),
        ttl: z.number().int().optional().describe("TTL in seconds (1 = automatic when proxied)."),
        proxied: z.boolean().optional().describe("Whether traffic is proxied through Cloudflare."),
        priority: z.number().int().optional().describe("MX/SRV priority when applicable."),
        comment: z.string().optional().describe("Optional record comment."),
      },
    },
    async ({ zone_id, type, name, content, ttl, proxied, priority, comment }) => {
      try {
        const resolved = await client.resolveZoneId(zone_id);
        const record = await client.createDnsRecord(resolved, {
          type,
          name,
          content,
          ttl,
          proxied,
          priority,
          comment,
        });
        return ok("DNS record created", { zone_id: resolved, record });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_update_dns_record",
    {
      title: "Update DNS record",
      description: "Patch fields on an existing DNS record.",
      inputSchema: {
        zone_id: zoneId,
        record_id: z.string().describe("DNS record ID."),
        type: z.string().optional(),
        name: z.string().optional(),
        content: z.string().optional(),
        ttl: z.number().int().optional(),
        proxied: z.boolean().optional(),
        priority: z.number().int().optional(),
        comment: z.string().optional(),
      },
    },
    async ({ zone_id, record_id, type, name, content, ttl, proxied, priority, comment }) => {
      try {
        const resolved = await client.resolveZoneId(zone_id);
        const record = await client.updateDnsRecord(resolved, record_id, {
          type,
          name,
          content,
          ttl,
          proxied,
          priority,
          comment,
        });
        return ok("DNS record updated", { zone_id: resolved, record });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_delete_dns_record",
    {
      title: "Delete DNS record",
      description: "Delete a DNS record from a zone.",
      inputSchema: {
        zone_id: zoneId,
        record_id: z.string().describe("DNS record ID."),
      },
    },
    async ({ zone_id, record_id }) => {
      try {
        const resolved = await client.resolveZoneId(zone_id);
        const result = await client.deleteDnsRecord(resolved, record_id);
        return ok("DNS record deleted", { zone_id: resolved, ...result });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_purge_cache",
    {
      title: "Purge cache",
      description: "Purge cached assets for a zone — everything, specific URLs, tags, or hosts.",
      inputSchema: {
        zone_id: zoneId,
        purge_everything: z.boolean().optional().describe("Purge entire zone cache."),
        files: z.array(z.string()).optional().describe("Full URLs to purge."),
        tags: z.array(z.string()).optional().describe("Cache tags to purge."),
        hosts: z.array(z.string()).optional().describe("Hostnames to purge."),
      },
    },
    async ({ zone_id, purge_everything, files, tags, hosts }) => {
      try {
        const resolved = await client.resolveZoneId(zone_id);
        const result = await client.purgeCache(resolved, {
          purge_everything,
          files,
          tags,
          hosts,
        });
        return ok("Cache purge requested", { zone_id: resolved, ...result });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_list_workers",
    {
      title: "List Workers scripts",
      description: "Workers scripts in a Cloudflare account.",
      inputSchema: { account_id: accountId },
    },
    async ({ account_id }) => {
      try {
        const resolved = await client.resolveAccountId(account_id);
        return json({
          account_id: resolved,
          scripts: await client.listWorkers(resolved),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_get_worker",
    {
      title: "Get Worker script",
      description: "Worker script metadata by name.",
      inputSchema: {
        account_id: accountId,
        script_name: z.string().describe("Workers script name."),
      },
    },
    async ({ account_id, script_name }) => {
      try {
        const resolved = await client.resolveAccountId(account_id);
        return json(await client.getWorker(resolved, script_name));
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "cf_list_firewall_rules",
    {
      title: "List firewall rules",
      description: "Legacy firewall rules for a zone.",
      inputSchema: {
        zone_id: zoneId,
        page: page.describe("Page number (default 1)."),
        per_page: perPage.describe("Results per page (default 25)."),
      },
    },
    async ({ zone_id, page: p, per_page }) => {
      try {
        const resolved = await client.resolveZoneId(zone_id);
        return json({
          zone_id: resolved,
          rules: await client.listFirewallRules(resolved, p ?? 1, per_page ?? 25),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
