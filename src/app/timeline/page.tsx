import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Timeline" };

export default function Page() {
  return <PageHeader title="Timeline" intro="Roles, projects and milestones, newest first." />;
}
