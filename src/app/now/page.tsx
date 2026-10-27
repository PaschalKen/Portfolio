import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Now" };

export default function Page() {
  return <PageHeader title="Now" intro="What I'm listening to, wearing, watching and working on." />;
}
