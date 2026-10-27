"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { NowPlaying as NowPlayingData } from "@/lib/spotify";

// Spotify has no push updates, so poll. The server shares one Spotify call across all visitors.
const POLL_MS = 5_000;
// Re-check just after the current song should end, so natural track changes show at once.
const TRACK_END_GRACE_MS = 1_000;

type Snapshot = { data: NowPlayingData | null; receivedAt: number };

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function NowPlaying() {
  // undefined = still loading; data null = nothing playing (or Spotify unavailable).
  const [snapshot, setSnapshot] = useState<Snapshot | undefined>(undefined);
  // Set alongside each snapshot (never during render, which Cache Components forbids).
  const [clock, setClock] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    let endTimer: ReturnType<typeof setTimeout> | undefined;

    async function load() {
      clearTimeout(pollTimer);
      clearTimeout(endTimer);
      let next: NowPlayingData | null = null;
      try {
        const res = await fetch("/api/spotify/now-playing", { cache: "no-store" });
        next = res.ok ? ((await res.json()) as NowPlayingData | null) : null;
      } catch {
        // Network blip: show nothing playing and try again on the next poll.
      }
      if (cancelled) return;
      const receivedAt = Date.now();
      setSnapshot({ data: next, receivedAt });
      setClock(receivedAt);
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

  const isPlaying = snapshot?.data?.isPlaying ?? false;

  // Tick the progress bar locally between polls while a song is playing.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (snapshot === undefined) {
    return (
      <div className="flex items-center gap-3" aria-busy="true">
        <div className="size-11 shrink-0 animate-pulse rounded bg-border" />
        <div className="h-4 w-24 animate-pulse rounded bg-border" />
      </div>
    );
  }

  const { data, receivedAt } = snapshot;
  if (!data) return <p className="text-muted">Not playing anything right now</p>;

  const { track, durationMs } = data;
  const elapsed = Math.max(0, Math.min(durationMs, data.progressMs + (isPlaying ? clock - receivedAt : 0)));
  const percent = durationMs > 0 ? (elapsed / durationMs) * 100 : 0;

  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-xs font-medium">
      </p>
      <a href={track.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
        {track.image && (
          <Image src={track.image} alt="" width={44} height={44} className="size-11 shrink-0 rounded" />
        )}
        <span className="min-w-0">
          <span className="block truncate font-medium group-hover:underline">{track.title}</span>
          <span className="block truncate text-sm text-muted">{track.artists}</span>
          <span className="sr-only">(opens Spotify in a new tab)</span>
        </span>
      </a>
      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] tabular-nums text-muted" aria-hidden="true">
        <span>{formatTime(elapsed)}</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span>{formatTime(durationMs)}</span>
      </div>
    </div>
  );
}
