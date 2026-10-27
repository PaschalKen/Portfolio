// One-time helper: logs you in to Spotify and prints a refresh token for .env.local.
// Usage: npm run spotify:auth   (needs SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local)
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ["user-read-currently-playing", "user-read-recently-played", "user-top-read"];

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ client_id: id, response_type: "code", redirect_uri: REDIRECT_URI, scope: SCOPES.join(" "), state });

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT_URI);
  if (url.pathname !== "/callback") return void res.writeHead(404).end();

  const finish = (status, message) => {
    res.writeHead(status, { "Content-Type": "text/plain" }).end(message);
    server.close();
  };

  if (url.searchParams.get("state") !== state) return finish(400, "State mismatch. Run the script again.");
  const code = url.searchParams.get("code");
  if (!code) return finish(400, `Spotify returned: ${url.searchParams.get("error") ?? "no code"}`);

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
  });
  const data = await tokenRes.json();
  if (!tokenRes.ok || !data.refresh_token) {
    console.error("Token exchange failed:", data);
    return finish(500, "Token exchange failed. Check the terminal.");
  }

  console.log("\nAdd this line to .env.local (and to Vercel's env vars later):\n");
  console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
  finish(200, "Done. You can close this tab and go back to the terminal.");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Open this URL in your browser and approve access:\n");
  console.log(authUrl + "\n");
});
