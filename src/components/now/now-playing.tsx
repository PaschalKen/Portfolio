"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useNowPlaying } from "@/components/now/use-now-playing";

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function NowPlaying() {
  // undefined = still loading; data null = nothing playing (or Spotify unavailable).
  const snapshot = useNowPlaying();
  // Updated by the ticker below (never read from Date.now() during render, which Cache Components forbids).
  const [clock, setClock] = useState(0);

  const isPlaying = snapshot?.data?.isPlaying ?? false;
  const receivedAt = snapshot?.receivedAt;

  // Tick the progress bar locally between polls while a song is playing.
  useEffect(() => {
    if (!isPlaying || receivedAt === undefined) return;
    const tick = () => setClock(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, receivedAt]);

  if (snapshot === undefined) {
    return (
      <div className="flex items-center gap-3" aria-busy="true">
        <div className="size-11 shrink-0 animate-pulse rounded bg-border" />
        <div className="h-4 w-24 animate-pulse rounded bg-border" />
      </div>
    );
  }

  const { data } = snapshot;
  if (!data) return <p className="text-muted">Not playing anything right now</p>;

  const { track, durationMs } = data;
  // clock lags receivedAt by a frame right after a poll; never let that wind the bar backwards.
  const sincePoll = isPlaying ? Math.max(0, clock - snapshot.receivedAt) : 0;
  const elapsed = Math.max(0, Math.min(durationMs, data.progressMs + sincePoll));
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
