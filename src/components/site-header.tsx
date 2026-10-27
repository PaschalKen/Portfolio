import { Suspense } from "react";
import Link from "next/link";
import { Links, NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      {/* Phones: name + toggle on one row, nav on its own row below. sm+: all on one row. */}
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-1 px-4 sm:h-16 sm:flex-nowrap sm:px-6">
        <Link href="/" className="flex h-14 items-center font-semibold tracking-tight sm:h-auto">
          {site.firstName}
        </Link>
        <nav aria-label="Main" className="order-last -mx-2 w-full overflow-x-auto pb-2 sm:order-none sm:mx-0 sm:ml-auto sm:w-auto sm:pb-0">
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
