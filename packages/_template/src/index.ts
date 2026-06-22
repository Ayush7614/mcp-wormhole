import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

const server = new McpServer({
  name: "mcp-wormhole-template",
  version: "0.0.0",
});

server.registerTool(
  "ping",
  {
    title: "Ping",
    description: "Health check — replace with real vendor API tools.",
    inputSchema: {
      message: z.string().optional().describe("Optional echo message."),
    },
  },
  async ({ message }) =>
    json({
      ok: true,
      server: "mcp-wormhole-template",
      echo: message ?? "pong",
    }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
