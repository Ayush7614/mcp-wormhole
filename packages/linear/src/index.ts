import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClientFromEnv } from "./client.js";
import { registerLinearPrompts } from "./mcp/prompts.js";
import { registerLinearResources } from "./mcp/resources.js";
import { registerLinearTools } from "./mcp/tools.js";

const server = new McpServer({
  name: "mcp-wormhole-linear",
  version: "0.1.0",
});

const client = createClientFromEnv();
registerLinearTools(server, client);
registerLinearPrompts(server, client);
registerLinearResources(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
