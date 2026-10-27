"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/icons";
import { site } from "@/lib/site";

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks() {
  const pathname = usePathname();
  return <Links pathname={pathname} />;
}

// Also rendered as the Suspense fallback, with no active link.
export function Links({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-2 whitespace-nowrap">
      {site.nav.map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
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

const tabs = [{ href: "/", label: "Home", icon: "home" } as const, ...site.nav];

export function TabLinks() {
  const pathname = usePathname();
  return <Tabs pathname={pathname} />;
}

// Phone tab bar: icon over a small label, like a native app.
export function Tabs({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex">
      {tabs.map(({ href, label, icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href} className="flex-1">
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex h-16 flex-col items-center justify-center gap-1 text-[10px] transition-colors ${
                active ? "text-fg font-medium" : "text-muted active:text-fg"
              }`}
            >
              <NavIcon name={icon} className="size-6" strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
