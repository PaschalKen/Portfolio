import { Suspense } from "react";
import { TabLinks, Tabs } from "@/components/nav-links";

// Phones only: the main nav as a bottom tab bar, within thumb reach. sm+ uses the header nav.
export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
    >
      <Suspense fallback={<Tabs pathname={null} />}>
        <TabLinks />
      </Suspense>
    </nav>
  );
}
