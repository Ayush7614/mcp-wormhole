import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClientFromEnv } from "./client.js";
import { registerGoogleCalendarPrompts } from "./mcp/prompts.js";
import { registerGoogleCalendarResources } from "./mcp/resources.js";
import { registerGoogleCalendarTools } from "./mcp/tools.js";

const server = new McpServer({
  name: "mcp-wormhole-google-calendar",
  version: "0.1.0",
});

const client = await createClientFromEnv();
registerGoogleCalendarTools(server, client);
registerGoogleCalendarPrompts(server, client);
registerGoogleCalendarResources(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
