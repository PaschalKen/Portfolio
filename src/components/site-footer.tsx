import { SocialLinks } from "@/components/social-links";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{site.name}</p>
        <SocialLinks className="-ml-2" />
      </div>
    </footer>
  );
}
