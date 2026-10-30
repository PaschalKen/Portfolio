import type { Metadata } from "next";
import { Entry } from "@/components/entry";
import { PageHeader } from "@/components/page-header";
import { timeline } from "@/content/timeline";

export const metadata: Metadata = { title: "Experience" };

// Work only, newest first; education isn't experience.
const roles = timeline.filter((e) => e.type === "role");

export default function Page() {
  return (
    <>
      <PageHeader title="Experience" intro="Where I've worked, newest first." />
      <div className="space-y-14">
        {roles.map((r) => (
          <Entry key={r.slug} entry={r} collapsible />
        ))}
      </div>
    </>
  );
}
