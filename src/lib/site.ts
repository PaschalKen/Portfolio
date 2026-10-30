export const site = {
  name: "Paschal Ezenwobi",
  firstName: "Paschal",
  description:
    "Software developer. Building things, writing about them, and tracking the rest.",
  url: "https://paschalezenwobi.vercel.app",
  nav: [
    { href: "/projects", label: "Projects", icon: "projects" },
    { href: "/experience", label: "Experience", icon: "experience" },
    { href: "/now", label: "Now", icon: "now" },
    { href: "/blog", label: "Blog", icon: "blog" },
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
