import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

function section(title) {
  console.log(`\n==> ${title}`);
}

function parseToolResult(result) {
  const block = result.content?.find((item) => item.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Tool returned no text content");
  }
  return JSON.parse(block.text);
}

async function main() {
  if (!process.env.ASANA_ACCESS_TOKEN) {
    throw new Error("ASANA_ACCESS_TOKEN is required");
  }

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@mcp-wormhole/asana"],
    env: process.env,
  });

  const client = new Client({ name: "npm-smoke-test", version: "1.0.0" });
  await client.connect(transport);

  section("List MCP tools");
  const { tools } = await client.listTools();
  console.log(`  ${tools.length} tools available`);
  for (const tool of tools.slice(0, 4)) {
    console.log(`  - ${tool.name}`);
  }
  if (tools.length > 4) {
    console.log(`  ... and ${tools.length - 4} more`);
  }

  section("asana_get_me");
  const me = parseToolResult(await client.callTool({ name: "asana_get_me", arguments: {} }));
  const email = me.email ? me.email.replace(/^(.{1}).*(@.*)$/, "$1***$2") : "no email";
  console.log(`  ${me.name} (${email})`);
  console.log(`  gid: ${me.gid}`);

  section("asana_list_workspaces");
  const workspaces = parseToolResult(
    await client.callTool({ name: "asana_list_workspaces", arguments: {} }),
  );
  console.log(`  ${workspaces.workspaces.length} workspace(s)`);
  for (const workspace of workspaces.workspaces) {
    console.log(`  - ${workspace.name} (${workspace.gid})`);
  }

  const workspaceGid = workspaces.workspaces[0]?.gid;
  if (!workspaceGid) {
    throw new Error("No workspaces found for this token");
  }

  section("asana_list_my_tasks");
  const tasks = parseToolResult(
    await client.callTool({
      name: "asana_list_my_tasks",
      arguments: { workspace_gid: workspaceGid, limit: 3 },
    }),
  );
  const taskList = tasks.tasks ?? [];
  if (taskList.length === 0) {
    console.log("  (none)");
  } else {
    for (const task of taskList) {
      const status = task.completed ? "done" : "open";
      console.log(`  - [${status}] ${task.name}`);
    }
  }

  console.log("\nAll npm package smoke tests passed.");
  await client.close();
}

main().catch((error) => {
  console.error("\nSmoke test failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
