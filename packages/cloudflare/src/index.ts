import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClientFromEnv } from "./client.js";
import { registerCloudflarePrompts } from "./mcp/prompts.js";
import { registerCloudflareResources } from "./mcp/resources.js";
import { registerCloudflareTools } from "./mcp/tools.js";

const server = new McpServer({
  name: "mcp-wormhole-cloudflare",
  version: "0.1.0",
});

const client = createClientFromEnv();
registerCloudflareTools(server, client);
registerCloudflarePrompts(server, client);
registerCloudflareResources(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
