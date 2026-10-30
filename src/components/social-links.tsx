import { Icon } from "@/components/icons";
import { site } from "@/lib/site";

/** GitHub, LinkedIn and email icons. Web links open in a new tab; mailto opens the mail app. */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-1 ${className}`}>
      {site.socials.map(({ href, label, icon }) => {
        // A new tab for mailto would be left blank behind the mail app.
        const external = href.startsWith("http");
        return (
          <li key={href}>
            <a
              href={href}
              aria-label={external ? `${label} (opens in a new tab)` : label}
              title={label}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-fg"
            >
              <Icon name={icon} className="size-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
