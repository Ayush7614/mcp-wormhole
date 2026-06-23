#!/usr/bin/env node
/** Ask calendar questions via local MCP server (uses .env credentials). */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) {
    throw new Error("Missing .env — run scripts/oauth-setup.mjs first");
  }
  const env = { ...process.env };
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function parseToolResult(result) {
  const block = result.content?.find((item) => item.type === "text");
  if (!block || block.type !== "text") throw new Error("Tool returned no text");
  return JSON.parse(block.text);
}

async function main() {
  const env = loadEnv();
  if (!env.GOOGLE_CALENDAR_CREDENTIALS) {
    throw new Error("GOOGLE_CALENDAR_CREDENTIALS missing in .env");
  }

  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
    env,
    cwd: root,
  });

  const client = new Client({ name: "gcal-qa", version: "1.0.0" });
  await client.connect(transport);

  console.log("\n==> gcal_list_calendars");
  const { calendars } = parseToolResult(await client.callTool({ name: "gcal_list_calendars", arguments: {} }));
  console.log(`  ${calendars.length} calendar(s)`);
  for (const cal of calendars.slice(0, 3)) {
    console.log(`  - ${cal.summary} (${cal.id})`);
  }

  console.log("\n==> gcal_list_upcoming_events");
  const { events } = parseToolResult(
    await client.callTool({ name: "gcal_list_upcoming_events", arguments: { max_results: 5 } }),
  );
  if (events.length === 0) {
    console.log("  (no upcoming events)");
  } else {
    for (const event of events) {
      const start = event.start?.dateTime ?? event.start?.date ?? "?";
      console.log(`  - ${event.summary ?? "(no title)"} @ ${start}`);
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  const end = new Date(tomorrow);
  end.setHours(18, 0, 0, 0);

  console.log("\n==> gcal_find_free_slots (tomorrow 9am–6pm)");
  const freebusy = parseToolResult(
    await client.callTool({
      name: "gcal_find_free_slots",
      arguments: {
        calendar_ids: ["primary"],
        time_min: tomorrow.toISOString(),
        time_max: end.toISOString(),
      },
    }),
  );
  const busy = freebusy.busy?.primary ?? [];
  console.log(`  ${busy.length} busy block(s) tomorrow during business hours`);

  console.log("\nCalendar Q&A checks passed.");
  await client.close();
}

main().catch((error) => {
  console.error("\nQ&A failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
