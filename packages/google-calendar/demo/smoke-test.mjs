import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXPECTED_TOOLS = 12;
const EXPECTED_PROMPTS = 6;

function section(title) {
  console.log(`\n==> ${title}`);
}

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
    env: {
      ...process.env,
      GOOGLE_CALENDAR_CREDENTIALS: JSON.stringify({
        client_id: "smoke-test-client-id",
        client_secret: "smoke-test-client-secret",
        refresh_token: "smoke-test-refresh-token",
      }),
    },
    cwd: join(__dirname, ".."),
  });

  const client = new Client({ name: "gcal-smoke-test", version: "1.0.0" });
  await client.connect(transport);

  section("List MCP tools");
  const { tools } = await client.listTools();
  console.log(`  ${tools.length} tools registered (expected ${EXPECTED_TOOLS})`);
  if (tools.length !== EXPECTED_TOOLS) {
    throw new Error(`Expected ${EXPECTED_TOOLS} tools, got ${tools.length}`);
  }
  for (const tool of tools.slice(0, 4)) {
    console.log(`  - ${tool.name}`);
  }
  console.log(`  ... and ${EXPECTED_TOOLS - 4} more`);

  section("List MCP prompts");
  const { prompts } = await client.listPrompts();
  console.log(`  ${prompts.length} prompts registered (expected ${EXPECTED_PROMPTS})`);
  if (prompts.length !== EXPECTED_PROMPTS) {
    throw new Error(`Expected ${EXPECTED_PROMPTS} prompts, got ${prompts.length}`);
  }

  section("List MCP resources");
  try {
    const { resources } = await client.listResources();
    console.log(`  ${resources.length} static resources registered`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("invalid_client") || message.includes("invalid_grant")) {
      console.log("  skipped live resource fetch (dummy credentials — expected)");
    } else {
      throw error;
    }
  }

  console.log("\nMCP smoke test passed (stdio + tool/prompt registration).");
  console.log("Run pnpm verify with real GOOGLE_CALENDAR_CREDENTIALS for live API checks.");
  await client.close();
}

main().catch((error) => {
  console.error("\nSmoke test failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
