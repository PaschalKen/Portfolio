export const site = {
  name: "Paschal Ezenwobi",
  firstName: "Paschal",
  description:
    "Software developer. Building things, writing about them, and tracking the rest.",
  url: "https://paschalezenwobi.vercel.app",
  nav: [
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/timeline", label: "Timeline" },
    { href: "/now", label: "Now" },
    { href: "/blog", label: "Blog" },
  ],
  socials: [
    { href: "https://github.com/PaschalKen", label: "GitHub", icon: "github" },
    {
      href: "https://www.linkedin.com/in/paschal-ezenwobi-828654230/",
      label: "LinkedIn",
      icon: "linkedin",
    },
    { href: "mailto:ezenwobikene@gmail.com", label: "Email", icon: "mail" },
  ],
} as const;
