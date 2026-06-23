import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CloudflareClient } from "../client.js";
import {
  CLOUDFLARE_PROMPT_NAMES,
  CLOUDFLARE_RESOURCE_URIS,
  CLOUDFLARE_TOOL_NAMES,
} from "./catalog.js";

function textResource(uri: string, data: unknown) {
  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function param(value: string | string[]): string {
  return Array.isArray(value) ? value[0]! : value;
}

export function registerCloudflareResources(server: McpServer, client: CloudflareClient) {
  server.registerResource(
    "cf_catalog",
    "cf://catalog",
    {
      title: "Cloudflare MCP catalog",
      description: "Tool, prompt, and resource index for mcp-wormhole Cloudflare.",
      mimeType: "application/json",
    },
    async (uri) =>
      textResource(uri.href, {
        server: "mcp-wormhole-cloudflare",
        tools: CLOUDFLARE_TOOL_NAMES.length,
        tool_names: CLOUDFLARE_TOOL_NAMES,
        prompts: CLOUDFLARE_PROMPT_NAMES.length,
        prompt_names: CLOUDFLARE_PROMPT_NAMES,
        resource_templates: CLOUDFLARE_RESOURCE_URIS,
      }),
  );

  server.registerResource(
    "cf_zones",
    "cf://zones",
    {
      title: "All zones",
      description: "Browse Cloudflare zones accessible to your API token.",
      mimeType: "application/json",
    },
    async (uri) => textResource(uri.href, { zones: await client.listZones({ perPage: 50 }) }),
  );

  server.registerResource(
    "cf_zone",
    new ResourceTemplate("cf://zone/{zone_id}", {
      list: async () => {
        const zones = await client.listZones({ perPage: 50 });
        return {
          resources: zones.map((zone) => ({
            uri: `cf://zone/${zone.id}`,
            name: zone.name,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        zone_id: async () => (await client.listZones({ perPage: 50 })).map((zone) => zone.id),
      },
    }),
    {
      title: "Zone",
      description: "Zone details.",
      mimeType: "application/json",
    },
    async (uri, { zone_id }) => {
      const id = param(zone_id);
      return textResource(uri.href, await client.getZone(id));
    },
  );

  server.registerResource(
    "cf_zone_dns",
    new ResourceTemplate("cf://zone/{zone_id}/dns", {
      list: async () => {
        const zones = await client.listZones({ perPage: 25 });
        return {
          resources: zones.map((zone) => ({
            uri: `cf://zone/${zone.id}/dns`,
            name: `${zone.name} DNS`,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        zone_id: async () => (await client.listZones({ perPage: 50 })).map((zone) => zone.id),
      },
    }),
    {
      title: "Zone DNS records",
      description: "DNS records for a zone.",
      mimeType: "application/json",
    },
    async (uri, { zone_id }) => {
      const id = param(zone_id);
      const records = await client.listDnsRecords(id, { perPage: 100 });
      return textResource(uri.href, { zone_id: id, records });
    },
  );
}
