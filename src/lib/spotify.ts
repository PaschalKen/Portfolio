import "server-only";
import { cacheLife } from "next/cache";
import { unstable_rethrow } from "next/navigation";

// Credentials come from env vars only; see .env.example and scripts/spotify-auth.mjs.
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

export type Track = {
  title: string;
  artists: string;
  album: string;
  image: string | null;
  url: string;
};

export type NowPlaying = {
  isPlaying: boolean;
  track: Track;
  /** Position in the track at the moment the response is sent. */
  progressMs: number;
  durationMs: number;
};

export type Artist = { name: string; image: string | null; url: string };

export type RecentTrack = Track & { playedAt: string };

export function spotifyConfigured() {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET && process.env.SPOTIFY_REFRESH_TOKEN,
  );
}

// Errors thrown inside "use cache" fail the whole build during prerendering, even if a caller
// catches them. So cached functions here never throw: on failure they log, return a fallback,
// and cache it only for seconds so the next request retries.

class SpotifyError extends Error {}

async function getAccessToken(): Promise<string | null> {
  "use cache";

  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refreshToken) {
    cacheLife("seconds");
    return null;
  }

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    });
    if (!res.ok) {
      // Spotify's body is e.g. {"error":"invalid_grant","error_description":"Invalid refresh token"}; no secrets.
      console.error(`[spotify] token refresh failed: ${res.status} ${await res.text()}`);
      cacheLife("seconds");
      return null;
    }
    // Spotify access tokens last an hour; refresh a little early.
    cacheLife({ stale: 60, revalidate: 50 * 60, expire: 55 * 60 });
    return ((await res.json()) as { access_token: string }).access_token;
  } catch (err) {
    console.error("[spotify] token refresh error:", err instanceof Error ? err.message : err);
    cacheLife("seconds");
    return null;
  }
}

/** Returns null for "nothing to show" (204). Throws SpotifyError on failure; callers decide what to cache. */
async function spotifyGet<T>(path: string): Promise<T | null> {
  const token = await getAccessToken();
  if (!token) throw new SpotifyError("no access token");
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 204) return null;
  if (!res.ok) throw new SpotifyError(`${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

type ApiImage = { url: string; width: number | null };
type ApiTrack = {
  name: string;
  duration_ms: number;
  external_urls: { spotify: string };
  artists: { name: string }[];
  album: { name: string; images: ApiImage[] };
};
type ApiArtist = { name: string; external_urls: { spotify: string }; images: ApiImage[] };

/** Smallest image that is still at least `min` px wide. */
function pickImage(images: ApiImage[], min = 128) {
  const sorted = [...images].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  return (sorted.find((i) => (i.width ?? 0) >= min) ?? sorted.at(-1))?.url ?? null;
}

function toTrack(t: ApiTrack): Track {
  return {
    title: t.name,
    artists: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    image: pickImage(t.album.images),
    url: t.external_urls.spotify,
  };
}

// Now playing needs to be near real-time, so it skips "use cache" (whose stale-while-revalidate
// would serve an old song for a cycle) and uses a short in-memory cache instead. One Spotify call
// is shared by every request in the window, however many visitors are polling.
const NOW_PLAYING_TTL_MS = 3_000;
let nowPlayingCache: { at: number; value: Promise<NowPlaying | null> } | null = null;

async function requestNowPlaying(): Promise<NowPlaying | null> {
  const data = await spotifyGet<{ is_playing: boolean; progress_ms: number | null; item: ApiTrack | null }>(
    "/me/player/currently-playing",
  );
  // item is null for podcasts, ads and private sessions.
  if (!data?.item) return null;
  return {
    isPlaying: data.is_playing,
    track: toTrack(data.item),
    progressMs: data.progress_ms ?? 0,
    durationMs: data.item.duration_ms,
  };
}

async function fetchNowPlaying(): Promise<NowPlaying | null> {
  const now = Date.now();
  if (!nowPlayingCache || now - nowPlayingCache.at > NOW_PLAYING_TTL_MS) {
    const value = requestNowPlaying();
    nowPlayingCache = { at: now, value };
    // Don't keep a failure around; the next request retries.
    value.catch(() => {
      if (nowPlayingCache?.value === value) nowPlayingCache = null;
    });
  }
  const { at, value } = nowPlayingCache;
  const result = await value;
  if (!result?.isPlaying) return result;
  // Account for time spent in the cache so the client's end-of-track timer is accurate.
  return { ...result, progressMs: Math.min(result.progressMs + (Date.now() - at), result.durationMs) };
}

async function fetchTopArtists(): Promise<Artist[]> {
  "use cache";
  try {
    const data = await spotifyGet<{ items: ApiArtist[] }>("/me/top/artists?time_range=short_term&limit=6");
    cacheLife("hours");
    return (data?.items ?? []).map((a) => ({ name: a.name, image: pickImage(a.images), url: a.external_urls.spotify }));
  } catch (err) {
    console.error("[spotify] top artists:", err instanceof Error ? err.message : err);
    cacheLife("seconds");
    return [];
  }
}

async function fetchRecentlyPlayed(): Promise<RecentTrack[]> {
  "use cache";
  try {
    const data = await spotifyGet<{ items: { track: ApiTrack; played_at: string }[] }>(
      "/me/player/recently-played?limit=5",
    );
    cacheLife("minutes");
    return (data?.items ?? []).map((i) => ({ ...toTrack(i.track), playedAt: i.played_at }));
  } catch (err) {
    console.error("[spotify] recently played:", err instanceof Error ? err.message : err);
    cacheLife("seconds");
    return [];
  }
}

// Public API: never throws, so a Spotify outage or expired token can't break the page.
async function safely<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!spotifyConfigured()) return fallback;
  try {
    return await fn();
  } catch (err) {
    // Let Next's own control-flow signals (e.g. prerender postponement) through.
    unstable_rethrow(err);
    console.error("[spotify]", err instanceof Error ? err.message : err);
    return fallback;
  }
}

export const getNowPlaying = () => safely(fetchNowPlaying, null);
export const getTopArtists = () => safely(fetchTopArtists, []);
export const getRecentlyPlayed = () => safely(fetchRecentlyPlayed, []);
