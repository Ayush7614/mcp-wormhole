import { createClientFromEnv } from "./client.js";

function section(title: string) {
  console.log(`\n==> ${title}`);
}

async function main() {
  const client = createClientFromEnv();

  section("Token verification");
  const token = await client.verifyToken();
  console.log(`  status: ${token.status}`);
  console.log(`  id: ${token.id}`);

  section("Authenticated user");
  const user = await client.getUser();
  console.log(`  ${user.email ?? user.username ?? user.id}`);
  console.log(`  id: ${user.id}`);

  section("Accounts");
  const accounts = await client.listAccounts(1, 5);
  if (accounts.length === 0) {
    console.log("  (none — token may lack Account read permission)");
  } else {
    for (const account of accounts) {
      console.log(`  - ${account.name} id=${account.id}`);
    }
  }

  section("Zones");
  const zones = await client.listZones({ perPage: 5 });
  if (zones.length === 0) {
    console.log("  (none — token may lack Zone read permission)");
  } else {
    for (const zone of zones) {
      const plan = zone.plan?.name ?? "unknown";
      console.log(`  - ${zone.name} (${zone.status ?? "?"}) plan=${plan} id=${zone.id}`);
    }
  }

  if (zones.length > 0) {
    const zoneId = await client.resolveZoneId();
    const zone = zones.find((entry) => entry.id === zoneId) ?? zones[0]!;

    section(`DNS records for ${zone.name} (up to 8)`);
    const records = await client.listDnsRecords(zoneId, { perPage: 8 });
    if (records.length === 0) {
      console.log("  (none)");
    } else {
      for (const record of records) {
        const proxied = record.proxied ? "proxied" : "dns-only";
        console.log(`  - ${record.type} ${record.name} → ${record.content} (${proxied})`);
      }
    }

    section(`Firewall rules for ${zone.name}`);
    try {
      const rules = await client.listFirewallRules(zoneId, 1, 5);
      console.log(`  ${rules.length} rule(s)`);
      for (const rule of rules.slice(0, 3)) {
        const state = rule.paused ? "paused" : "active";
        console.log(`  - ${rule.action} · ${state} · ${rule.description ?? rule.id}`);
      }
    } catch {
      console.log("  (skipped — token may lack Firewall Services read permission)");
    }
  }

  if (accounts.length > 0) {
    section("Workers scripts");
    try {
      const scripts = await client.listWorkers();
      console.log(`  ${scripts.length} script(s)`);
      for (const script of scripts.slice(0, 5)) {
        console.log(`  - ${script.id}`);
      }
    } catch {
      console.log("  (skipped — token may lack Workers Scripts read permission)");
    }
  }

  console.log("\nAll verification steps passed.");
}

main().catch((error) => {
  console.error("\nVerification failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
