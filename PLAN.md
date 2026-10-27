# Personal Site — Build Plan (v2)

**Status:** replanned 2026-08-22 — personal site, not a straight portfolio
**Owner:** Paschal Ezenwobi · ezenwobikene@gmail.com

Inspiration: [iwader.co.uk](https://www.iwader.co.uk/) (Home / Now / Blog, live stat
widgets, illustrations) and a tech timeline page (reverse-chronological, year headers,
typed entries: role / project / education).

---

## Decisions

| Decision | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Hosting | Vercel Hobby (free) |
| URL | `paschalken.vercel.app`; custom domain later (~£10/yr) |
| Design | Clean & minimal — whitespace, one accent, typography-led |
| Theme | Light default, dark toggle |
| Blog | MDX files in-repo, rendered at build time |
| Repo | New public repo `PaschalKen/portfolio` |
| CV | PDF download in hero — **Paschal to supply** |

---

## The four pages

### 1. `/` — Home
Who I am, what I do now, what I've built.
- Hero: name, one-line positioning, socials, CV download
- Short intro (2 paragraphs)
- Current role / status
- Featured projects — 4 cards (ERP, Subira, SeeFit, Virtual Pet)
- Latest 3 blog posts
- Selected stats strip (steps, top artist, GitHub contributions) linking to /now

### 2. `/now` — Now
The personal page. Live where possible, hand-maintained where not.
- **Music** — Spotify: now playing / recently played / top artists (live)
- **Movement** — steps, workouts, distance (see data-sources note)
- **Gadgets / uses** — phone, watch, laptop, keyboard, desk, editor, terminal
- **Watching** — YouTube creators worth following, with channel links
- **Reading / learning** — current book or course
- **Currently** — 3–4 bullets on what's occupying me right now

### 3. `/timeline` — Timeline
Reverse-chronological, grouped under year headings, newest first.
- Entry types: `role` · `project` · `education` · `milestone`
- Each: date range, type tag, title, org, 2–4 bullets, optional link
- Current entries tagged "Now"
- Covers: Portsmouth (2022–2026), Radweb placement (2024–2025), FYP + award,
  SeeFit, Subira, Virtual Pet, Hue Smash

### 4. `/blog` — Blog
- Index: title, date, reading time, tags
- Posts at `/blog/[slug]` from MDX in the repo
- Syntax highlighting, RSS feed

Nav is exactly these four. Project detail lives in timeline entries and blog posts
rather than separate pages, keeping the count at four.

---

## Data sources — what's actually live

| Widget | Source | Live? | Notes |
|---|---|---|---|
| Now playing / top artists | Spotify Web API | ✅ yes | OAuth refresh token in env vars; route handler + caching |
| GitHub contributions | GitHub GraphQL API | ✅ yes | token in env vars |
| Workouts / distance | Strava API | ✅ yes | **if** Samsung Health syncs to Strava; proper OAuth web API |
| Step count | ⚠️ see below | ✗ not directly | Samsung has no web API |
| Gadgets / YouTube / reading | Local TypeScript file | ✗ manual | edit + push to update; fine, changes rarely |

### The step-count problem
Samsung Health exposes data only through an **on-device Android SDK** (partner
approval required) — there is no REST endpoint a website can call. Options:

1. **Strava relay (recommended)** — sync Samsung Health → Strava, read Strava's web
   API. Gets runs, rides and distance automatically. Does *not* carry step counts.
2. **Manual number** — a hand-updated figure in the content file. Honest if labelled
   "as of <date>", zero infrastructure.
3. **Android companion app** — small app reading Health Connect, POSTing to an API
   route on a schedule. Fully automatic, genuinely a separate project.

**Plan:** ship with option 1 for workouts and option 2 for steps. Revisit option 3
later if it still matters.

---

## Build order

1. `create-next-app` — TypeScript, Tailwind, App Router
2. Design tokens: palette, type scale, spacing; dark mode via `class`
3. Layout shell: nav (4 links), footer, container widths, theme toggle
4. `content/` — typed data files: profile, projects, timeline, gadgets, creators
5. Home page
6. Timeline page (year grouping, entry-type tags)
7. Blog: MDX pipeline, index, post template, RSS
8. Now page — static sections first
9. Spotify integration: OAuth token dance, route handler, caching, graceful fallback
10. GitHub + Strava widgets, same pattern
11. Responsive pass — 375 / 768 / 1280
12. SEO: metadata, OG images, sitemap, favicon
13. Accessibility: landmarks, focus states, contrast, alt text
14. Deploy to Vercel, set env vars, verify live
15. Link the site from the profile README

Every live widget renders a sensible fallback when its API fails or a token expires.
No widget may break the page.

---

## Deferred

- Custom domain
- Android companion app for step syncing
- Comments on blog posts
- Analytics (Vercel Analytics free tier if wanted)
- Project detail pages

---

## Open items for Paschal

- [ ] CV PDF into the project folder
- [ ] Does Samsung Health already sync to Strava? (decides the workouts widget)
- [ ] List of YouTube creators to feature
- [ ] Gadget list: phone, watch, laptop, keyboard, headphones, desk setup
- [ ] First blog post topic (site can launch with one)
- [ ] Name integration partners (Reapit, Xero, PayProp) on the timeline?
