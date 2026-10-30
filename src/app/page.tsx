import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LiveStrip } from "@/components/home/live-strip";
import { Tags } from "@/components/entry";
import { SocialLinks } from "@/components/social-links";
import { profile } from "@/content/profile";
import { featuredProjects, timeline } from "@/content/timeline";
import { formatRange } from "@/lib/dates";
import { site } from "@/lib/site";
import { getSteps } from "@/lib/steps";
import avatar from "../../public/avatar.png";

const MAX_CARD_TAGS = 4;
const experience = timeline.filter((e) => e.type === "role");
const hasStatus = profile.status && !profile.status.startsWith("TODO");

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">
      {children}
    </h2>
  );
}

async function Live() {
  return <LiveStrip steps={await getSteps()} />;
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <Image
          src={avatar}
          alt={`Illustrated portrait of ${site.name}`}
          priority
          sizes="(min-width: 640px) 128px, 96px"
          className="size-24 shrink-0 rounded-full sm:size-32"
        />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {site.name}
          </h1>
          <p className="mt-2 max-w-prose text-base text-muted sm:text-lg">
            {profile.positioning}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SocialLinks className="-ml-2" />
            {profile.cv && (
              <a
                href={profile.cv}
                download
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-surface"
              >
                Download CV
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Intro + status */}
      <section className="mt-12 max-w-prose space-y-4">
        {profile.intro.map((p) => (
          <p className="text-justify hyphens-auto" key={p}>
            {p}
          </p>
        ))}
        {hasStatus && (
          <p className="flex items-center gap-2 text-sm">
            <span
              className="size-2 shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
            {profile.status}
          </p>
        )}
      </section>

      {/* Live teaser of the Now page */}
      <div className="mt-10">
        <Suspense fallback={null}>
          <Live />
        </Suspense>
      </div>

      {/* Featured projects */}
      <section aria-labelledby="featured" className="mt-10">
        <SectionHeading id="featured">Featured projects</SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2">
          {featuredProjects.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects#${p.slug}`}
                className="flex h-full flex-col rounded-lg border border-border p-5 transition-colors hover:bg-surface"
              >
                <h3 className="font-semibold tracking-tight">{p.title}</h3>
                {(p.award || p.org) && (
                  <p className="mt-0.5 text-sm text-muted">
                    {p.award ? `🏆 ${p.award}` : p.org}
                  </p>
                )}
                {p.summary && (
                  <p className="mt-3 line-clamp-3 text-sm text-muted text-justify hyphens-auto">
                    {p.summary}
                  </p>
                )}
                {p.tags && (
                  <div className="mt-auto pt-4">
                    <Tags tags={p.tags.slice(0, MAX_CARD_TAGS)} />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/projects"
          className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
        >
          All projects <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* Experience teaser */}
      <section aria-labelledby="experience" className="mt-10">
        <SectionHeading id="experience">Experience</SectionHeading>
        <ul className="divide-y divide-border border-y border-border">
          {experience.map((e) => (
            <li
              key={e.slug}
              className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <span>
                <span className="font-medium">{e.title}</span>
                {e.org && <span className="text-muted"> · {e.org}</span>}
              </span>
              <span className="shrink-0 text-sm text-muted">
                {formatRange(e.start, e.end)}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/experience"
          className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
        >
          Experience in detail <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
