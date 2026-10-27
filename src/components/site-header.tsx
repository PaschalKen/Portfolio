import { Suspense } from "react";
import Link from "next/link";
import { Links, NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="sm:hidden">PE</span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
        <div className="flex items-center gap-1">
          <nav aria-label="Main">
            <Suspense fallback={<Links pathname={null} />}>
              <NavLinks />
            </Suspense>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
