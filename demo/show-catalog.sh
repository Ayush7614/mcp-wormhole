#!/usr/bin/env bash
# Terminal catalog demo for mcp-wormhole (orange CLI styling)
set -euo pipefail

ORANGE=$'\033[38;2;251;146;60m'
AMBER=$'\033[38;2;253;186;116m'
GREEN=$'\033[38;2;74;222;128m'
DIM=$'\033[2m'
BOLD=$'\033[1m'
NC=$'\033[0m'

pause() { sleep "$1"; }

pause 0.4
printf '\n'
printf '%s%s    ◆ mcp-wormhole%s\n' "$ORANGE" "$BOLD" "$NC"
pause 0.35
printf '%s    One repo. Many portals to your tools.%s\n' "$DIM" "$NC"
pause 0.5
printf '\n'
printf '%s$ %s./demo/show-catalog.sh%s\n' "$AMBER" "$ORANGE" "$NC"
pause 0.6
printf '\n'
printf '%s  ┌─ MCP server catalog ─────────────────────────────────────┐%s\n' "$ORANGE" "$NC"
pause 0.25
printf '%s  │%s\n' "$ORANGE" "$NC"
pause 0.2
printf '%s  │%s  %sAVAILABLE%s%s\n' "$ORANGE" "$NC" "$GREEN" "$BOLD" "$NC"
pause 0.3
printf '%s  │%s    ● Asana       %s@mcp-wormhole/asana@0.2.0%s\n' "$ORANGE" "$NC" "$GREEN" "$NC"
pause 0.25
printf '%s  │%s      66 tools · 18 prompts · browsable resources\n' "$ORANGE" "$NC"
pause 0.3
printf '%s  │%s    ● Vercel      %s@mcp-wormhole/vercel@0.2.0%s\n' "$ORANGE" "$NC" "$GREEN" "$NC"
pause 0.25
printf '%s  │%s      18 tools · 8 prompts · browsable resources\n' "$ORANGE" "$NC"
pause 0.3
printf '%s  │%s    ● Google Cal  %s@mcp-wormhole/google-calendar@0.1.0%s\n' "$ORANGE" "$NC" "$GREEN" "$NC"
pause 0.25
printf '%s  │%s      12 tools · 6 prompts · browsable resources\n' "$ORANGE" "$NC"
pause 0.35
printf '%s  │%s\n' "$ORANGE" "$NC"
pause 0.2
printf '%s  │%s  %sCOMING SOON%s%s\n' "$ORANGE" "$NC" "$AMBER" "$BOLD" "$NC"
pause 0.3

servers=(
  "Slack|@mcp-wormhole/slack"
  "Sentry|@mcp-wormhole/sentry"
  "Airtable|@mcp-wormhole/airtable"
  "Stripe|@mcp-wormhole/stripe"
  "Cloudflare|@mcp-wormhole/cloudflare"
  "GitHub Actions|@mcp-wormhole/github-actions"
  "PagerDuty|@mcp-wormhole/pagerduty"
  "Linear|@mcp-wormhole/linear"
)

for entry in "${servers[@]}"; do
  IFS='|' read -r name pkg <<< "$entry"
  printf '%s  │%s    ○ %-15s %s%s\n' "$ORANGE" "$NC" "$name" "$DIM$pkg$NC"
  pause 0.18
done

pause 0.35
printf '%s  │%s\n' "$ORANGE" "$NC"
pause 0.2
printf '%s  │%s    %s+ more integrations shipping — PRs welcome%s\n' "$ORANGE" "$NC" "$AMBER" "$NC"
pause 0.3
printf '%s  │%s    %s→ ayush7614.github.io/mcp-wormhole%s\n' "$ORANGE" "$NC" "$DIM" "$NC"
pause 0.25
printf '%s  └──────────────────────────────────────────────────────────┘%s\n' "$ORANGE" "$NC"
pause 0.4
printf '\n'
printf '%s  %snpx -y @mcp-wormhole/asana%s  %s# or @mcp-wormhole/vercel — connect any MCP client%s\n' "$DIM" "$ORANGE" "$NC" "$DIM" "$NC"
pause 0.5
printf '\n'
