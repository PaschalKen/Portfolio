import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Blog" };

export default function Page() {
  return <PageHeader title="Blog" intro="Notes on things I've built and learned." />;
}
