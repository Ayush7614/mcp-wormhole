import { createClientFromEnv } from "./client.js";

function section(title: string) {
  console.log(`\n==> ${title}`);
}

async function main() {
  const client = createClientFromEnv();

  section("Authenticated viewer");
  const viewer = await client.getViewer();
  console.log(`  ${viewer.displayName ?? viewer.name}`);
  if (viewer.email) console.log(`  email: ${viewer.email}`);
  console.log(`  id: ${viewer.id}`);

  section("Teams");
  const teams = await client.listTeams(10);
  if (teams.length === 0) {
    console.log("  (none)");
  } else {
    for (const team of teams) {
      console.log(`  - ${team.name} (${team.key}) id=${team.id}`);
    }
  }

  const teamId = await client.resolveTeamId();
  const team = teams.find((entry) => entry.id === teamId) ?? teams[0];
  section(`Workflow states for ${team?.key ?? teamId}`);
  const states = await client.listWorkflowStates(teamId);
  for (const state of states.slice(0, 8)) {
    console.log(`  - ${state.name} (${state.type}) id=${state.id}`);
  }
  if (states.length > 8) {
    console.log(`  … and ${states.length - 8} more`);
  }

  section(`Issues on ${team?.key ?? teamId} (up to 5)`);
  const issues = await client.listIssues({ teamId, first: 5 });
  if (issues.length === 0) {
    console.log("  (none)");
  } else {
    for (const issue of issues) {
      const state = issue.state?.name ?? "unknown";
      console.log(`  - ${issue.identifier} ${issue.title} · ${state}`);
    }

    section(`Comments on ${issues[0]!.identifier}`);
    const comments = await client.listComments(issues[0]!.id, 5);
    console.log(`  ${comments.length} comment(s)`);
    for (const comment of comments.slice(0, 3)) {
      const preview = comment.body.replace(/\s+/g, " ").slice(0, 80);
      console.log(`  - ${comment.user?.name ?? "user"}: ${preview}`);
    }
  }

  section("Issue search probe");
  const search = await client.searchIssues("bug", teamId, 3);
  console.log(`  ${search.length} result(s) for "bug"`);

  console.log("\nAll verification steps passed.");
}

main().catch((error) => {
  console.error("\nVerification failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
