import { Icon } from "@/components/icons";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{site.name}</p>
        <ul className="-ml-2 flex gap-1">
          {site.socials.map(({ href, label, icon }) => (
            <li key={href}>
              <a
                href={href}
                aria-label={label}
                title={label}
                rel="noopener noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-surface hover:text-fg"
              >
                <Icon name={icon} className="size-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
