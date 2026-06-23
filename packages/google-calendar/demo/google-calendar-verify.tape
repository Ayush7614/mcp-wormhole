# Google Calendar MCP verification demo
Output packages/google-calendar/demo/google-calendar-verify.gif

Set Shell "zsh"
Set FontSize 16
Set Width 1280
Set Height 720
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms

Hide
Type "cd /Users/ayushkumar/Projects/mcp-wormhole/packages/google-calendar"
Enter
Sleep 500ms
Show

Type "echo '# mcp-wormhole — Google Calendar MCP server'"
Enter
Sleep 800ms

Type "pnpm build"
Enter
Sleep 3s

Type "pnpm verify"
Enter
Sleep 12s

Type "echo '# Connected to Google Calendar API — list calendars & upcoming events'"
Enter
Sleep 2s
