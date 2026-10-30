"use client";

import Link from "next/link";
import { DayLabel } from "@/components/now/day-label";
import { useNowPlaying } from "@/components/now/use-now-playing";
import type { StepsSummary } from "@/lib/steps";

/** One-line teaser of the live Now page: current song and latest steps. Hidden when neither exists. */
export function LiveStrip({ steps }: { steps: StepsSummary | null }) {
  const snapshot = useNowPlaying();
  const playing = snapshot?.data?.isPlaying ? snapshot.data.track : null;

  if (!playing && !steps) return null;

  return (
    <Link
      href="/now"
      className="group flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-surface sm:flex-nowrap"
    >
      {/* The song is only as wide as it needs, so steps sit right after it; when space runs out it
          shrinks and ends in "…" rather than pushing anything off the line. Phones give it its own row. */}
      {playing && (
        <span className="flex min-w-0 basis-full items-center gap-2 sm:flex-initial sm:basis-auto">
          <span className="relative flex size-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          <span className="sr-only">Listening to</span>
          <span className="min-w-0 truncate" title={`${playing.title} · ${playing.artists}`}>
            <span className="font-medium">{playing.title}</span>
            <span className="text-muted"> · {playing.artists}</span>
          </span>
        </span>
      )}
      {steps && (
        <span className="shrink-0">
          👟 <span className="font-medium tabular-nums">{steps.latest.steps.toLocaleString("en-GB")}</span>{" "}
          <span className="text-muted">
            steps <DayLabel date={steps.latest.date} />
          </span>
        </span>
      )}
      <span className="ml-auto shrink-0 text-muted transition-colors group-hover:text-fg">
        Now <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
