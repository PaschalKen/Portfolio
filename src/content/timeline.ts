export type EntryType = "role" | "project" | "education" | "milestone";

export type TimelineEntry = {
  slug: string;
  type: EntryType;
  title: string;
  org?: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or null while ongoing (shown as "Now"). Omit for single-date entries. */
  end?: string | null;
  /** One line for the home page card; featured projects need this. */
  summary?: string;
  bullets: string[];
  tags?: string[];
  links?: { label: string; href: string }[];
  featured?: boolean;
};

const entries: TimelineEntry[] = [
  {
    slug: "forecastbridge",
    type: "project",
    title: "ForecastBridge",
    start: "2026-10",
    end: null,
    summary: "Serverless weather data platform on AWS, built to learn cloud development.",
    bullets: [
      "Scheduled Lambda job collects hourly forecasts for UK cities and builds up a history in Amazon S3",
      "REST API and web dashboard with a 48-hour chart, serving cached forecasts so it keeps working when the weather provider is down",
      "Least-privilege IAM roles per function, CloudWatch alerting, and a pytest suite with mocked AWS services run on every push via GitHub Actions",
    ],
    tags: ["Python", "FastAPI", "AWS Lambda", "Amazon S3", "EventBridge", "CloudWatch", "pytest", "GitHub Actions"],
    links: [
      { label: "GitHub", href: "https://github.com/PaschalKen/ForecastBridge" },
      { label: "Live demo", href: "https://4hgo4skmrmq4avm52lrgj23lzu0gatfn.lambda-url.eu-north-1.on.aws/" },
    ],
  },
  {
    slug: "subira",
    type: "project",
    title: "Subira",
    // TODO: June or July?
    start: "2026-06",
    end: null,
    summary: "Mobile-first workout tracker exploring offline-first sync.",
    bullets: [
      "Mobile-first PWA for tracking gym sessions, exercises and sets",
      "Ongoing exploration of offline-first architecture and local ↔ server synchronisation",
      "Vue 3 client with IndexedDB via Dexie, backed by an ASP.NET Core API on PostgreSQL",
    ],
    tags: ["Vue 3", "TypeScript", "ASP.NET Core", "C#", "EF Core", "PostgreSQL", "Dexie"],
    links: [{ label: "GitHub", href: "https://github.com/PaschalKen/Subira" }],
    featured: true,
  },
  {
    slug: "project-excellence-award",
    type: "milestone",
    title: "School of Computing Project Excellence Award",
    org: "University of Portsmouth",
    // TODO: month the award was given.
    start: "2026-06",
    bullets: ["Awarded for Seeman, my final year project"],
  },
  {
    slug: "seeman",
    type: "project",
    title: "Seeman",
    org: "Final year project",
    start: "2025-09",
    end: "2026-05",
    summary: "Offline-first ERP-style system for a multi-branch parts distributor in Nigeria.",
    bullets: [
      "Business management system built and deployed for an automotive and agro parts distributor: inventory, sales, fulfilment, reporting and staff administration across multiple branches",
      "Clean Architecture and CQRS, event-driven activity logging, role-based auth, Redis caching and IndexedDB offline support",
      "Requirements gathered directly from the client and validated through user acceptance testing",
      "Scored 88%, the highest mark in the cohort, and won the School of Computing Project Excellence Award",
    ],
    tags: ["React", "TypeScript", "Redux", "NestJS", "PostgreSQL", "Redis", "Tailwind CSS", "Jest"],
    links: [{ label: "GitHub", href: "https://github.com/PaschalKen/Seeman-Business-management" }],
    featured: true,
  },
  {
    slug: "radweb",
    type: "role",
    title: "Junior Software Developer",
    org: "Radweb Ltd (industrial placement)",
    start: "2024-07",
    end: "2025-09",
    bullets: [
      "Shipped features across a React/TypeScript frontend and a Laravel/MySQL backend for a property inspection platform used by 3,500+ customers in 50+ countries",
      "Migrated the Google Maps integration to AdvancedMarkerElement, adding zoom-based entity limiting, bounds-based querying and polygon property selection",
      "Automated GPT-4 report generation with AWS Lambda and S3, and maintained third-party integrations over REST and OAuth 2",
      "Received several MVP awards, including one for clearing a batch of customer-facing issues",
    ],
    tags: ["React", "TypeScript", "Redux", "Laravel", "MySQL", "AWS", "Jest", "Cypress"],
  },
  {
    slug: "seefit",
    type: "project",
    title: "SeeFit",
    start: "2024-01",
    end: "2024-06",
    summary: "Installable HIIT training app with live countdowns and audio cues.",
    bullets: [
      "Build custom interval workouts from timed exercise and recovery periods, then run them with a live countdown, progress ring and audio cues",
      "Installable PWA with a full create/edit/delete flow, light and dark themes, and a dashboard of completed workouts",
      "Designed against Nielsen's usability heuristics; scored 81%, the highest in the cohort",
    ],
    tags: ["JavaScript", "Node.js", "Express", "SQLite", "PWA"],
    links: [{ label: "GitHub", href: "https://github.com/PaschalKen/SeeFit" }],
    featured: true,
  },
  {
    slug: "virtual-pet",
    type: "project",
    title: "Virtual Pet",
    start: "2022-09",
    end: "2023-05",
    summary: "Browser pet simulator with meters that decay in real time.",
    bullets: [
      "Happiness, hunger, cleanliness and sleep meters decay in real time; feed, clean, play with or wake the pet to keep it alive",
      "Saved pets are retrieved on return visits through a small JSON-backed persistence layer",
      "Modular ES module structure",
    ],
    tags: ["JavaScript", "Node.js", "HTML", "CSS"],
    links: [{ label: "GitHub", href: "https://github.com/PaschalKen/Virtual-Pet" }],
    featured: true,
  },
  {
    slug: "portsmouth",
    type: "education",
    title: "BSc (Hons) Software Engineering with Placement Year",
    org: "University of Portsmouth",
    // TODO: exact start and graduation months.
    start: "2022-09",
    end: "2026-07",
    bullets: [
      "First Class Honours",
      "School of Computing Project Excellence Award for my final year project",
      // TODO: part-time roles (Student Information Assistant, IT Help Adviser)? Add or delete.
    ],
  },
];

// TODO: Hue Smash — no repo or details yet; add an entry when ready.

/** Newest first, ongoing entries at the top. */
export const timeline = [...entries].sort(
  (a, b) => (b.end === null ? 1 : 0) - (a.end === null ? 1 : 0) || b.start.localeCompare(a.start),
);

export const featuredProjects = timeline.filter((e) => e.type === "project" && e.featured);
