import { createClientFromEnv } from "./client.js";

function section(title: string) {
  console.log(`\n==> ${title}`);
}

async function main() {
  const client = createClientFromEnv();

  section("Token verification");
  const token = await client.verifyToken();
  console.log(`  status: ${token.status}`);
  console.log(`  type: ${token.token_type ?? "user"}`);
  if (token.id !== "account-owned") console.log(`  id: ${token.id}`);

  section("Authenticated user");
  if (token.token_type === "account") {
    console.log("  (skipped — account-owned token)");
  } else {
    try {
      const user = await client.getUser();
      console.log(`  ${user.email ?? user.username ?? user.id}`);
      console.log(`  id: ${user.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  (unavailable — ${message})`);
    }
  }

  section("Accounts");
  let accounts: Awaited<ReturnType<typeof client.listAccounts>> = [];
  try {
    accounts = await client.listAccounts(1, 5);
  } catch {
    console.log("  (skipped — token lacks Account read permission)");
  }
  if (accounts.length > 0) {
    for (const account of accounts) {
      console.log(`  - ${account.name} id=${account.id}`);
    }
  } else if (process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.log(`  (using CLOUDFLARE_ACCOUNT_ID=${process.env.CLOUDFLARE_ACCOUNT_ID})`);
  }

  section("Zones");
  const zones = await client.listZones({ perPage: 5 });
  if (zones.length === 0) {
    console.log("  (none — no domains on this Cloudflare account yet)");
    console.log("  Add a site at dash.cloudflare.com, then re-run pnpm verify");
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
