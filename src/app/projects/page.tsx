import type { Metadata } from "next";
import { Entry } from "@/components/entry";
import { PageHeader } from "@/components/page-header";
import { timeline } from "@/content/timeline";

export const metadata: Metadata = { title: "Projects" };

const projects = timeline.filter((e) => e.type === "project");

export default function Page() {
  return (
    <>
      <PageHeader title="Projects" intro="Things I've built, from university coursework to what I'm working on now." />
      <div className="space-y-14">
        {projects.map((p) => (
          <Entry key={p.slug} entry={p} />
        ))}
      </div>
    </>
  );
}
