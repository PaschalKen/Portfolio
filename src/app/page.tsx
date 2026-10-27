import Link from "next/link";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <section>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{site.name}</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">{site.description}</p>
      <p className="mt-8 text-sm text-muted">
        Home page coming in step 5 — this is the layout shell.{" "}
        <Link href="/timeline" className="text-accent underline">
          Accent link sample
        </Link>
      </p>
    </section>
  );
}
