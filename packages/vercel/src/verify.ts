import { createClientFromEnv } from "./client.js";

function section(title: string) {
  console.log(`\n==> ${title}`);
}

async function main() {
  const client = createClientFromEnv();

  section("Authenticated user");
  const user = await client.getUser();
  console.log(`  ${user.name ?? user.username ?? user.id}`);
  if (user.email) console.log(`  email: ${user.email}`);
  console.log(`  id: ${user.id}`);

  section("Teams");
  const teams = await client.listTeams(10);
  if (teams.length === 0) {
    console.log("  (none listed — using default team scope if available)");
  } else {
    for (const team of teams) {
      console.log(`  - ${team.name} (${team.slug}) id=${team.id}`);
    }
  }

  section("Projects (up to 5)");
  const projects = await client.listProjects({ limit: 5 });
  if (projects.length === 0) {
    console.log("  (none)");
  } else {
    for (const project of projects) {
      const framework = project.framework ? ` · ${project.framework}` : "";
      console.log(`  - ${project.name} (${project.id})${framework}`);
    }
  }

  if (projects.length > 0) {
    const project = projects[0];
    section(`Deployments for ${project.name} (up to 3)`);
    const deployments = await client.listDeployments({
      projectId: project.id,
      limit: 3,
    });
    if (deployments.length === 0) {
      console.log("  (none)");
    } else {
      for (const dep of deployments) {
        const state = dep.state ?? dep.readyState ?? "unknown";
        console.log(`  - ${dep.name} uid=${dep.uid} state=${state} url=${dep.url ?? "pending"}`);
      }

      section("Build events for latest deployment");
      const latest = deployments[0];
      const events = await client.getDeploymentEvents(latest.uid, 20);
      console.log(`  ${events.length} event(s)`);
      for (const event of events.slice(0, 5)) {
        const text =
          typeof event.payload?.text === "string"
            ? event.payload.text.trim().slice(0, 120)
            : event.type;
        console.log(`  [${event.type}] ${text}`);
      }
      if (events.length > 5) {
        console.log(`  … and ${events.length - 5} more`);
      }
    }
  }

  console.log("\nAll verification steps passed.");
}

main().catch((error) => {
  console.error("\nVerification failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
