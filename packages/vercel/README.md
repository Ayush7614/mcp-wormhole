# @mcp-wormhole/vercel

**Vercel MCP server** — deployments, build logs, promote, rollback, and project status via the official REST API.

## Highlights

| | |
|---|---|
| **Tools** | 11 across projects, deployments, logs, domains, promote, rollback |
| **Auth** | Vercel API token (`VERCEL_TOKEN`) |
| **Transport** | stdio (npx) |

## Quick start

```bash
npx -y @mcp-wormhole/vercel
# set VERCEL_TOKEN in env
```

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/vercel"],
      "env": {
        "VERCEL_TOKEN": "your_token_here"
      }
    }
  }
}
```

Create a token: [vercel.com/account/tokens](https://vercel.com/account/tokens)

For team-scoped projects, also set `VERCEL_TEAM_ID` (from `vercel_list_teams`).

## Tools

| Tool | Description |
|------|-------------|
| `vercel_get_user` | Authenticated user profile |
| `vercel_list_teams` | Teams for the token |
| `vercel_list_projects` | List/search projects |
| `vercel_get_project` | Project details |
| `vercel_list_deployments` | Filter by project, target, state, branch |
| `vercel_get_deployment` | Single deployment record |
| `vercel_get_deployment_events` | Build/deploy log events |
| `vercel_list_project_domains` | Project domains |
| `vercel_promote` | Promote deployment to production |
| `vercel_rollback` | Instant rollback to a prior deployment |
| `vercel_cancel_deployment` | Cancel in-flight build |

## Example prompts (Cursor / Claude)

- "List my Vercel projects"
- "Show the last 5 production deployments for project X"
- "Get build logs for deployment dpl_…"
- "Roll back project X to deployment dpl_…"

## Development

```bash
cd packages/vercel
cp .env.example .env   # add VERCEL_TOKEN
pnpm install
pnpm build
pnpm verify
```

## License

MIT
