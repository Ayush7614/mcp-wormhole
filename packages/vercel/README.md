# @mcp-wormhole/vercel

**Vercel MCP server** — 11 tools for deployments, build logs, promote, rollback, and project status via the official REST API.

## Highlights

| | |
|---|---|
| **Tools** | 11 across projects, deployments, logs, domains, promote, rollback |
| **Auth** | Vercel API token (`VERCEL_TOKEN`) + optional `VERCEL_TEAM_ID` |
| **Transport** | stdio (npx) |
| **npm** | [`@mcp-wormhole/vercel`](https://www.npmjs.com/package/@mcp-wormhole/vercel) |

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

For team-scoped projects, add `VERCEL_TEAM_ID` (from your Vercel team settings or `vercel_get_user` → `defaultTeamId`).

## Tool categories

- **Account** (2) — `vercel_get_user`, `vercel_list_teams`
- **Projects** (2) — list, get details, framework, repo link
- **Deployments** (3) — list with filters, get record, build event logs
- **Domains** (1) — list project domains
- **Ops** (3) — promote, rollback, cancel in-flight builds

Run `src/mcp/catalog.ts` for the canonical tool name list.

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
- "Which deployments are rollback candidates for project X?"
- "Roll back project X to deployment dpl_…"

## Development

```bash
cp .env.example .env
pnpm install && pnpm build
pnpm verify
```

## Env vars

| Variable | Required | Description |
|----------|----------|-------------|
| `VERCEL_TOKEN` | Yes | Vercel API token from account settings |
| `VERCEL_TEAM_ID` | No | Scope requests to a team (auto-detected from default team when omitted) |

## API docs

https://vercel.com/docs/rest-api

## Docs site

- [Vercel server page](https://ayush7614.github.io/mcp-wormhole/#/servers/vercel)
- [Vercel integration guide](https://ayush7614.github.io/mcp-wormhole/#/servers/vercel/guide)
- [Connect Vercel to Cursor](https://ayush7614.github.io/mcp-wormhole/#/blog/connect-vercel-to-cursor)

## License

MIT
