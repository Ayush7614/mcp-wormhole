import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClientFromEnv } from "./client.js";
import { registerAsanaPrompts } from "./mcp/prompts.js";
import { registerAsanaResources } from "./mcp/resources.js";
import { registerAsanaTools } from "./mcp/tools.js";

const server = new McpServer({
  name: "mcp-wormhole-asana",
  version: "0.2.0",
});

const client = createClientFromEnv();
registerAsanaTools(server, client);
registerAsanaPrompts(server, client);
registerAsanaResources(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
