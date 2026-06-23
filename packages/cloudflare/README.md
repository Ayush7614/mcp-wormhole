# @mcp-wormhole/cloudflare

**Full-stack Cloudflare MCP server** — 14 tools, 6 prompt workflows, and browsable `cf://` resources via the official API v4.

## Highlights

| | |
|---|---|
| **Tools** | 14 across zones, DNS, cache purge, Workers, firewall rules |
| **Prompts** | 6 MCP workflow templates (`dns_audit`, `cache_purge_plan`, …) |
| **Resources** | Browse zones → DNS at `cf://` URIs |
| **Auth** | Cloudflare API token (`CLOUDFLARE_API_TOKEN`) + optional account/zone defaults |
| **Transport** | stdio (npx) |

## Quick start

```bash
npx -y @mcp-wormhole/cloudflare
# set CLOUDFLARE_API_TOKEN in env
```

```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

Optional env vars:

- `CLOUDFLARE_ACCOUNT_ID` — default account for Workers tools
- `CLOUDFLARE_ZONE_ID` — default zone for DNS/cache/firewall tools

Create a token: [Cloudflare API tokens](https://dash.cloudflare.com/profile/api-tokens)

Suggested permissions: **Zone → DNS → Read/Edit**, **Zone → Cache Purge → Purge**, **Account → Workers Scripts → Read**, **Zone → Firewall Services → Read**.

## MCP prompt workflows

| Prompt | Purpose |
|--------|---------|
| `dns_audit` | Review DNS records — duplicates, apex coverage, proxied status |
| `cache_purge_plan` | Recommend safe cache purge strategy |
| `workers_inventory` | List Workers scripts in an account |
| `zone_health_snapshot` | Zone status, DNS count, firewall rules |
| `firewall_rules_review` | Review legacy firewall rules |
| `incident_dns_check` | DNS verification during an outage |

## Browsable resources

| URI | Content |
|-----|---------|
| `cf://catalog` | Tool/prompt/resource index |
| `cf://zones` | All zones |
| `cf://zone/{zone_id}` | Zone details |
| `cf://zone/{zone_id}/dns` | DNS records for a zone |

## Tool list

- **Account** — `cf_verify_token`, `cf_get_user`, `cf_list_accounts`
- **Zones** — `cf_list_zones`, `cf_get_zone`
- **DNS** — list, get, create, update, delete records
- **Cache** — `cf_purge_cache`
- **Workers** — `cf_list_workers`, `cf_get_worker`
- **Firewall** — `cf_list_firewall_rules`

## Development

```bash
cp .env.example .env   # add CLOUDFLARE_API_TOKEN
pnpm install && pnpm build
pnpm verify
```

## License

MIT
