"use client";

import { useEffect, useState } from "react";
import type { NowPlaying } from "@/lib/spotify";

// Spotify has no push updates, so poll. The server shares one Spotify call across all visitors.
const POLL_MS = 5_000;
// Re-check just after the current song should end, so natural track changes show at once.
const TRACK_END_GRACE_MS = 1_000;

/** data null = nothing playing (or Spotify unavailable); receivedAt anchors progress between polls. */
export type NowPlayingSnapshot = { data: NowPlaying | null; receivedAt: number };

/** Live "now playing" state; undefined until the first response arrives. */
export function useNowPlaying() {
  const [snapshot, setSnapshot] = useState<NowPlayingSnapshot | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    let endTimer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      clearTimeout(pollTimer);
      clearTimeout(endTimer);
      let next: NowPlaying | null = null;
      try {
        const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
        next = res.ok ? ((await res.json()) as NowPlaying | null) : null;
      } catch {
        // Network blip: show nothing playing and try again on the next poll.
      }
      if (cancelled) return;
      setSnapshot({ data: next, receivedAt: Date.now() });
      if (document.visibilityState !== "visible") return;
      pollTimer = setTimeout(load, POLL_MS);
      if (next?.isPlaying) {
        const remaining = next.durationMs - next.progressMs + TRACK_END_GRACE_MS;
        if (remaining < POLL_MS) endTimer = setTimeout(load, Math.max(remaining, 0));
      }
    }

    // Hidden tabs stop polling; coming back refreshes straight away.
    function onVisibility() {
      if (document.visibilityState === "visible") load();
      else {
        clearTimeout(pollTimer);
        clearTimeout(endTimer);
      }
    }

    load();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearTimeout(pollTimer);
      clearTimeout(endTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return snapshot;
}
