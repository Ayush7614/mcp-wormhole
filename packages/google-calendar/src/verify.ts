import { createClientFromEnv } from "./client.js";

function section(title: string) {
  console.log(`\n==> ${title}`);
}

async function main() {
  const client = await createClientFromEnv();

  section("Calendars");
  const calendars = await client.listCalendars(10);
  if (calendars.length === 0) {
    console.log("  (none)");
  } else {
    for (const cal of calendars) {
      const primary = cal.primary ? " · primary" : "";
      console.log(`  - ${cal.summary} (${cal.id})${primary}`);
    }
  }

  const primary = calendars.find((c) => c.primary)?.id ?? client.defaultCalendarId;

  section(`Upcoming events on ${primary} (up to 5)`);
  const events = await client.listUpcomingEvents(primary, 5);
  if (events.length === 0) {
    console.log("  (none)");
  } else {
    for (const event of events) {
      const start = event.start?.dateTime ?? event.start?.date ?? "unknown";
      console.log(`  - ${event.summary ?? "(no title)"} @ ${start} id=${event.id}`);
    }
  }

  section("Free/busy probe (next 24h)");
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const freebusy = await client.findFreeSlots({
    calendarIds: [primary],
    timeMin,
    timeMax,
  });
  const busyCount = freebusy.busy[primary]?.length ?? 0;
  console.log(`  ${busyCount} busy block(s) in the next 24 hours`);

  console.log("\nAll verification steps passed.");
}

main().catch((error) => {
  console.error("\nVerification failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
