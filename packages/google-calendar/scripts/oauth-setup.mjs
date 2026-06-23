#!/usr/bin/env node
/**
 * One-time OAuth setup — prints GOOGLE_CALENDAR_CREDENTIALS JSON for .env
 * Usage:
 *   GOOGLE_OAUTH_CLIENT_ID=... GOOGLE_OAUTH_CLIENT_SECRET=... node scripts/oauth-setup.mjs
 */
import { createServer } from "node:http";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
const PORT = Number(process.env.OAUTH_SETUP_PORT ?? 8765);
const REDIRECT_URI = `http://127.0.0.1:${PORT}/oauth2callback`;
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET first.");
  console.error("Example:");
  console.error(
    '  GOOGLE_OAUTH_CLIENT_ID="xxx.apps.googleusercontent.com" GOOGLE_OAUTH_CLIENT_SECRET="xxx" node scripts/oauth-setup.mjs',
  );
  process.exit(1);
}

const oauth2 = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

function finish(code) {
  oauth2
    .getToken(code)
    .then(({ tokens }) => {
      if (!tokens.refresh_token) {
        console.error("\nNo refresh_token returned. Revoke app access at");
        console.error("https://myaccount.google.com/permissions and run again with prompt=consent.");
        process.exit(1);
      }

      const credentials = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
      };

      console.log("\n✓ OAuth complete. Add to packages/google-calendar/.env:\n");
      console.log(`GOOGLE_CALENDAR_CREDENTIALS='${JSON.stringify(credentials)}'`);
      console.log("\nNever commit .env or paste client_secret in chat.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\nToken exchange failed:", error.message);
      process.exit(1);
    });
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/oauth2callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error) {
    res.writeHead(400);
    res.end(`OAuth error: ${error}`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400);
    res.end("Missing code");
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>Authorized — return to terminal</h1>");
  server.close();
  finish(code);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Open this URL in your browser and sign in:\n");
  console.log(authUrl);
  console.log(`\nWaiting for callback on ${REDIRECT_URI} ...`);
  console.log("\nAdd this redirect URI in Google Cloud → Credentials → your OAuth client:");
  console.log(`  ${REDIRECT_URI}`);
});
