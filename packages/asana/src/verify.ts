import { createClientFromEnv } from "./client.js";

function section(title: string) {
  console.log(`\n==> ${title}`);
}

async function main() {
  const client = createClientFromEnv();

  section("Authenticated user");
  const me = await client.getMe();
  console.log(`  ${me.name} (${me.email ?? "no email"})`);
  console.log(`  gid: ${me.gid}`);

  section("Workspaces");
  const workspaces = await client.listWorkspaces();
  for (const workspace of workspaces) {
    console.log(`  - ${workspace.name} (${workspace.gid})`);
  }

  if (workspaces.length === 0) {
    throw new Error("No workspaces found for this token");
  }

  const workspace = workspaces[0];

  section("My open tasks (up to 5)");
  const myTasks = await client.listMyTasks(5, workspace.gid);
  if (myTasks.length === 0) {
    console.log("  (none)");
  } else {
    for (const task of myTasks) {
      const status = task.completed ? "done" : "open";
      console.log(`  - [${status}] ${task.name} (${task.gid})`);
    }
  }

  section("Create verification task");
  const stamp = new Date().toISOString();
  const created = await client.createTask({
    name: `[mcp-wormhole] Asana MCP verification ${stamp}`,
    workspaceGid: workspace.gid,
    notes: "Created by packages/asana verify script to confirm API integration.",
  });
  console.log(`  created: ${created.name}`);
  console.log(`  gid: ${created.gid}`);
  if (created.permalink_url) {
    console.log(`  url: ${created.permalink_url}`);
  }

  section("Add comment to verification task");
  const comment = await client.addComment(
    created.gid,
    "Verification comment from mcp-wormhole/asana — integration working.",
  );
  console.log(`  comment gid: ${comment.gid}`);

  section("Fetch task back");
  const fetched = await client.getTask(created.gid);
  console.log(`  name: ${fetched.name}`);
  console.log(`  completed: ${fetched.completed ?? false}`);
  console.log(`  notes: ${fetched.notes?.slice(0, 80) ?? "(empty)"}`);

  section("Search for verification task");
  const matches = await client.searchTasks({
    workspaceGid: workspace.gid,
    text: "mcp-wormhole",
    assignee: "me",
    limit: 5,
  });
  console.log(`  found ${matches.length} matching task(s)`);
  for (const task of matches) {
    console.log(`  - ${task.name} (${task.gid})`);
  }

  section("Mark verification task complete");
  const completed = await client.updateTask(created.gid, { completed: true });
  console.log(`  completed: ${completed.completed}`);

  console.log("\nAll verification steps passed.");
  if (created.permalink_url) {
    console.log(`View in Asana UI: ${created.permalink_url}`);
  }
}

main().catch((error) => {
  console.error("\nVerification failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
