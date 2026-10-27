import { Collapsible } from "@/components/collapsible";
import type { TimelineEntry } from "@/content/timeline";
import { formatRange } from "@/lib/dates";

export function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag} className="rounded-md bg-surface px-2 py-0.5 font-mono text-xs text-muted">
          {tag}
        </li>
      ))}
    </ul>
  );
}

// Edge-to-edge body text; hyphenation (needs <html lang>) keeps word gaps even on narrow screens.
const JUSTIFY = "text-justify hyphens-auto";

/** Full entry: heading, dates, summary, bullets, tags, links. Used by Projects and Experience. */
export function Entry({
  entry,
  headingLevel: H = "h2",
  collapsible = false,
}: {
  entry: TimelineEntry;
  headingLevel?: "h2" | "h3";
  /** Cap long bullet lists behind "Read more". */
  collapsible?: boolean;
}) {
  const ongoing = entry.end === null;
  const bullets = (
    <ul className={`list-disc space-y-1.5 pl-5 marker:text-border ${JUSTIFY}`}>
      {entry.bullets.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
  return (
    <article id={entry.slug} className="scroll-mt-24">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <H className="text-lg font-semibold tracking-tight">{entry.title}</H>
        <p className="shrink-0 text-sm text-muted">
          {ongoing && <span className="mr-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">Now</span>}
          {formatRange(entry.start, entry.end)}
        </p>
      </div>
      {entry.org && <p className="mt-0.5 text-muted">{entry.org}</p>}
      {entry.summary && <p className={`mt-3 ${JUSTIFY}`}>{entry.summary}</p>}
      {entry.award && (
        <p className="mt-3 font-semibold">
          <span role="img" aria-label="Award">🏆</span> {entry.award}
        </p>
      )}
      {entry.bullets.length > 0 &&
        (collapsible ? (
          <Collapsible className="mt-3">{bullets}</Collapsible>
        ) : (
          <div className="mt-3">{bullets}</div>
        ))}
      {entry.tags && (
        <div className="mt-4">
          <Tags tags={entry.tags} />
        </div>
      )}
      {entry.links && (
        <ul className="mt-4 flex gap-4 text-sm">
          {entry.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent underline decoration-accent/30 hover:decoration-accent"
              >
                {l.label} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
