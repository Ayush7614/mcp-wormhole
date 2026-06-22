# @mcp-wormhole/vercel

**Full-stack Vercel MCP server** — 18 tools, 8 prompt workflows, and browsable `vercel://` resources via the official REST API.

## Highlights

| | |
|---|---|
| **Tools** | 18 across projects, deployments, logs, domains, env vars, promote, rollback |
| **Prompts** | 8 MCP workflow templates (`failed_deploy_triage`, `production_rollback_plan`, …) |
| **Resources** | Browse projects → deployments at `vercel://` URIs |
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

## MCP prompt workflows

| Prompt | Purpose |
|--------|---------|
| `deployment_health_check` | Latest production deployment health |
| `failed_deploy_triage` | ERROR deploys + build log extraction |
| `production_rollback_plan` | Rollback candidates (no auto-execute) |
| `project_status_snapshot` | Executive project summary |
| `build_log_analysis` | Parse build events for root cause |
| `rollback_candidate_review` | Compare rollback-eligible deploys |
| `release_readiness_check` | Pre-promote go/no-go checklist |
| `domain_audit` | Domain verification review |

## Browsable resources

| URI | Content |
|-----|---------|
| `vercel://catalog` | Tool/prompt/resource index |
| `vercel://projects` | All projects |
| `vercel://project/{id}` | Project detail |
| `vercel://project/{id}/deployments` | Recent deployments |
| `vercel://deployment/{id}` | Deployment record |

## Tool categories

- **Account & teams** (3)
- **Projects & domains** (3)
- **Deployments & logs** (5)
- **Environment variables** (4)
- **Production ops** (3)

See `src/mcp/catalog.ts` for the full tool name list.

## Development

```bash
cp .env.example .env
pnpm install && pnpm build
pnpm verify
```

## Env vars

| Variable | Required | Description |
|----------|----------|-------------|
| `VERCEL_TOKEN` | Yes | Vercel API token |
| `VERCEL_TEAM_ID` | No | Team scope (auto-detected from default team when omitted) |

## API docs

https://vercel.com/docs/rest-api

## Docs site

- [Vercel server page](https://ayush7614.github.io/mcp-wormhole/#/servers/vercel)
- [Vercel integration guide](https://ayush7614.github.io/mcp-wormhole/#/servers/vercel/guide)
- [Connect Vercel to Cursor](https://ayush7614.github.io/mcp-wormhole/#/blog/connect-vercel-to-cursor)
- [Inside @mcp-wormhole/vercel](https://ayush7614.github.io/mcp-wormhole/#/blog/inside-vercel-mcp-server)

## License

MIT
