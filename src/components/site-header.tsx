import { Suspense } from "react";
import Link from "next/link";
import { Links, NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      {/* Phones: name + toggle only; the nav lives in the bottom tab bar (MobileNav). */}
      <div className="mx-auto flex h-14 max-w-page items-center gap-x-1 px-4 sm:h-16 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          {site.firstName}
        </Link>
        <nav aria-label="Main" className="ml-auto hidden sm:block">
          <Suspense fallback={<Links pathname={null} />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
