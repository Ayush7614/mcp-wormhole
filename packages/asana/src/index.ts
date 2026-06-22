import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClientFromEnv } from "./client.js";
import { registerAsanaTools } from "./tools.js";

const server = new McpServer({
  name: "mcp-wormhole-asana",
  version: "0.1.0",
});

registerAsanaTools(server, createClientFromEnv());

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
