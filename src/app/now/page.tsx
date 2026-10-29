import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { Listening, ListeningSkeleton } from "@/components/now/listening";
import { NowPlaying } from "@/components/now/now-playing";
import { StepsTile } from "@/components/now/steps-tile";
import { Tile } from "@/components/now/tile";
import { now, type Gadget } from "@/content/now";
import { timeline } from "@/content/timeline";
import { formatDay } from "@/lib/dates";

export const metadata: Metadata = { title: "Now" };

const building = timeline.filter((e) => e.type === "project" && e.end === null);
const gadgetGroups = (["Carry", "Desk", "Software"] as const)
  .map((group) => ({ group, items: now.gadgets.filter((g: Gadget) => g.group === group) }))
  .filter((g) => g.items.length > 0);

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section aria-labelledby={id} className="mt-16">
      <h2 id={id} className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <>
      <PageHeader title="Now" intro="What I'm focused on, reading, listening to and using." />
      <p className="-mt-8 mb-12 text-sm text-muted">Updated {formatDay(now.updated)}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Tile label="Listening on Spotify">
          <NowPlaying />
        </Tile>
        <Tile label="Reading">
          <p className="font-medium">{now.reading.title}</p>
          <p className="text-sm text-muted">{now.reading.author}</p>
        </Tile>
        {/* Tiles without data stay hidden until a value (or a live source) exists. */}
        <Suspense fallback={null}>
          <StepsTile />
        </Suspense>
        {now.gym.sessionsThisWeek !== null && (
          <Tile label="Gym" footnote={now.gym.asOf ? `As of ${formatDay(now.gym.asOf)}` : undefined}>
            <p className="text-2xl font-semibold tabular-nums">
              {now.gym.sessionsThisWeek}× <span className="text-base font-normal text-muted">this week</span>
            </p>
          </Tile>
        )}
      </div>

      <Section title="Currently">
        <ul className="list-disc space-y-2 pl-5 marker:text-border">
          {now.currently.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Listening Stats">
        <Suspense fallback={<ListeningSkeleton />}>
          <Listening />
        </Suspense>
      </Section>

      {now.creators.length > 0 && (
        <Section title="Watching">
          <ul className="space-y-3">
            {now.creators.map((c) => (
              <li key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                  {c.name}
                </a>
                {c.note && <p className="text-muted">{c.note}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Tech & gadgets">
        <dl className="space-y-6">
          {gadgetGroups.map(({ group, items }) => (
            <div key={group} className="grid gap-2 sm:grid-cols-[8rem_1fr]">
              <dt className="text-muted">{group}</dt>
              <dd>
                <ul className="space-y-2">
                  {items.map((g) => (
                    <li key={g.name}>
                      <span className="font-medium">{g.name}</span>{" "}
                      <span className="text-sm text-muted">· {g.category}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
