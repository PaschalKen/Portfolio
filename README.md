# paschalezenwobi.vercel.app

My personal site: projects, experience, a timeline, a blog, and a **Now** page with live data — what I'm playing on Spotify and how many steps my watch has counted today.

**Live:** [paschalezenwobi.vercel.app](https://paschalezenwobi.vercel.app)

Built with Next.js 16 (App Router, Cache Components), TypeScript and Tailwind CSS v4, hosted on Vercel.

---

## Pages

| Route | What it shows | Data comes from |
|---|---|---|
| `/projects` | Every project, newest first, with tags, links and "Read more" for long write-ups | `src/content/timeline.ts` |
| `/experience` | Work and education | `src/content/timeline.ts` |
| `/timeline` | Everything on one reverse-chronological line (in progress) | `src/content/timeline.ts` |
| `/now` | Live Spotify, live step count, reading, currently, uses | Spotify API, Upstash, `src/content/now.ts` |
| `/blog` | Writing (in progress) | — |

Content is plain TypeScript in `src/content/`, typed so a missing field fails the build rather than the page. To add a project, add an entry to `timeline.ts`; it appears on the Projects page automatically.

---

## How the live data works

Both live integrations follow the same rules: **secrets stay on the server**, **results are cached and shared by every visitor** (so traffic never multiplies API calls), and **a failure hides one tile instead of breaking the page or the build**.

### 1. Spotify — "Listening on Spotify"

```
Browser ──every 5s──▶ /api/spotify/now-playing ──▶ Spotify Web API
   ▲                         │
   └──── song, progress ─────┘   (one Spotify call shared by all visitors per 3s)
```

- **Now playing** (`src/components/now/now-playing.tsx`) polls `/api/spotify/now-playing` every 5 seconds while the tab is visible, and again the moment the current song should end, so track changes show within a second or two. A progress bar ticks locally between polls.
- **Top artists and recently played** (`src/components/now/listening.tsx`) are rendered on the server and cached (minutes for recent tracks, hours for top artists).
- **Auth** (`src/lib/spotify.ts`): a long-lived refresh token, created once with `npm run spotify:auth`, is exchanged for a short-lived access token, cached for ~50 minutes.

### 2. Steps — "👟 Steps"

Samsung Health has no web API, so the data has to leave the phone. A small Android app I wrote, **[steps-uploader](#the-phone-app)**, does that:

```
Galaxy Watch
    │  syncs
    ▼
Samsung Health ──▶ Health Connect          (Android's on-device health store)
                        │  read by
                        ▼
                  steps-uploader app       (hourly, in the background)
                        │  POST /api/steps  + secret key
                        ▼
                  this site ──▶ Upstash Redis   (one number per day)
                        │
                        ▼
                  /now  👟 6,240 today · 48,210 in the last 7 days
```

- **`POST /api/steps`** (`src/app/api/steps/route.ts`) accepts `{ "days": [{ "date": "2026-10-29", "steps": 6240 }] }`. It checks a shared secret (`Authorization: Bearer …`, compared in constant time), validates every date and count, saves to Upstash, then calls `revalidateTag("steps")` so the next visit shows the new number immediately.
- **Self-healing:** the phone resends the last 7 days on every upload, so a missed hour or a day offline fixes itself on the next successful send.
- **Storage** (`src/lib/steps.ts`): one Redis hash, `steps:daily`, mapping date → steps. The tile shows the latest day (labelled "today" when it is today in the visitor's time zone) and the total for the last 7 calendar days.
- **Health Connect de-duplicates** watch and phone steps, so the numbers match Samsung Health.

### The phone app

Lives in a separate project: `steps-uploader` (Kotlin, Jetpack Compose, Health Connect, WorkManager). It only requests **read** access to **steps**; nothing else leaves the phone. See its own README for setup.

---

## Running it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

Everything except the live tiles works with an empty `.env.local`; those tiles simply stay hidden.

### Environment variables

| Variable | Used for | Where to get it |
|---|---|---|
| `SPOTIFY_CLIENT_ID` | Spotify | [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) → your app → Settings |
| `SPOTIFY_CLIENT_SECRET` | Spotify | same place |
| `SPOTIFY_REFRESH_TOKEN` | Spotify | run `npm run spotify:auth` and approve in the browser |
| `UPSTASH_REDIS_REST_URL` | Steps storage | [upstash.com](https://upstash.com) → Redis database → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Steps storage | same place |
| `STEPS_API_KEY` | Shared secret with the phone app | any long random string, e.g. `openssl rand -hex 32` |

`.env.local` is git-ignored. In Vercel these go under **Settings → Environments → Production**, pasted **without quotes**, and only apply to deploys made after they're saved.

### Spotify app setup (once)

1. Create an app at developer.spotify.com/dashboard, tick **Web API**, and add the redirect URI `http://127.0.0.1:8888/callback` (Spotify no longer accepts `localhost`).
2. Put the client ID and secret in `.env.local`.
3. `npm run spotify:auth` → open the printed link → approve → paste the printed `SPOTIFY_REFRESH_TOKEN` into `.env.local` (and Vercel).

---

## Deploying

Pushing to `main` deploys to Vercel automatically. Other branches get preview URLs and only go live once merged into `main`.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Spotify tile says "Spotify stats will show here…" on the live site | Vercel env vars wrong or not redeployed. Vercel **Logs** → search `spotify`: `invalid_client` = ID/secret, `invalid_grant` = refresh token |
| Phone app: **Upload failed (HTTP 404)** | The site with `/api/steps` isn't deployed yet |
| Phone app: **HTTP 401** | `STEPS_API_KEY` differs between Vercel and the app's `local.properties` |
| Phone app: **HTTP 503** | Upstash variables wrong on Vercel |
| Steps tile hidden | No data in Upstash yet, or Upstash unreachable (check Logs for `[steps]`) |

## Project layout

```
src/
  app/
    api/spotify/now-playing/  live "now playing" JSON
    api/steps/                receives steps from the phone
    now/ projects/ experience/ timeline/ blog/
  components/
    now/                      Now-page tiles (Spotify, steps, shared Tile)
    entry.tsx collapsible.tsx project/experience entries, "Read more"
  content/                    the site's words: timeline, now, profile
  lib/                        spotify.ts, steps.ts, site config, dates, theme
scripts/spotify-auth.mjs      one-time Spotify login helper
```
