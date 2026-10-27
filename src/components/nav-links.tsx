"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();
  return <Links pathname={pathname} />;
}

// Rendered as the Suspense fallback too, with no active link.
export function Links({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1 sm:gap-2">
      {site.nav.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-2 py-1.5 text-sm transition-colors sm:px-3 ${
                active ? "text-fg font-medium" : "text-muted hover:text-fg"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
