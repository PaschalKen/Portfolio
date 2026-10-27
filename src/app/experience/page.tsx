import type { Metadata } from "next";
import { Entry } from "@/components/entry";
import { PageHeader } from "@/components/page-header";
import { timeline } from "@/content/timeline";

export const metadata: Metadata = { title: "Experience" };

const roles = timeline.filter((e) => e.type === "role");
const education = timeline.filter((e) => e.type === "education");

export default function Page() {
  return (
    <>
      <PageHeader title="Experience" intro="Where I've worked and studied." />
      <section aria-labelledby="work">
        <h2 id="work" className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">Work</h2>
        <div className="space-y-12">
          {roles.map((r) => (
            <Entry key={r.slug} entry={r} headingLevel="h3" />
          ))}
        </div>
      </section>
      <section aria-labelledby="education" className="mt-16">
        <h2 id="education" className="mb-6 text-sm font-medium uppercase tracking-wider text-muted">Education</h2>
        <div className="space-y-12">
          {education.map((e) => (
            <Entry key={e.slug} entry={e} headingLevel="h3" />
          ))}
        </div>
      </section>
    </>
  );
}
