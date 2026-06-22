#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKDIR="$(mktemp -d /tmp/mcp-asana-npm-test.XXXXXX)"
trap 'rm -rf "$WORKDIR"' EXIT

cd "$WORKDIR"

npm init -y >/dev/null 2>&1

echo "==> npm install @mcp-wormhole/asana"
npm i @mcp-wormhole/asana @modelcontextprotocol/sdk

cp "$ROOT/demo/npm-smoke-test.mjs" .

echo ""
node npm-smoke-test.mjs
