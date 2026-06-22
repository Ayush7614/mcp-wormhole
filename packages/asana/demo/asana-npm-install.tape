# npm install + MCP smoke test for published @mcp-wormhole/asana
Output packages/asana/demo/asana-npm-install.gif

Set Shell "zsh"
Set FontSize 16
Set Width 1280
Set Height 720
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms

Hide
Type "cd /Users/ayushkumar/Projects/mcp-wormhole/packages/asana"
Enter
Type "set -a && source .env && set +a"
Enter
Sleep 500ms
Show

Type "echo '# Install @mcp-wormhole/asana from npm'"
Enter
Sleep 800ms

Type "bash demo/run-npm-smoke.sh"
Enter
Sleep 28s

Type "echo '# Published package works — MCP tools respond over stdio'"
Enter
Sleep 2s
