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
  /** Shown with a trophy above the bullets. */
  award?: string;
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
    summary:
      "Serverless weather data platform on AWS that collects hourly forecasts for four UK cities, stores them in Amazon S3 and serves them through a REST API and web dashboard.",
    bullets: [
      "⏰ An EventBridge schedule runs a Lambda collector every hour, saving each city's raw Open-Meteo forecast to S3 to build up a history, with one city's failure never stopping the others.",
      "📊 FastAPI app running on Lambda through Mangum and a public Function URL, serving a web page with a 48 hour Chart.js chart, current conditions and rule based advice such as when to take an umbrella or a jacket.",
      "⚡ Forecasts are cached in S3 per city per hour, so repeat requests skip the weather provider and a stored forecast is still served if the provider is down.",
      "🔒 Separate least privilege IAM roles per function, a CloudWatch alarm that emails through SNS when the collector fails, and 50 pytest tests using moto and fakes that run on every push with GitHub Actions.",
    ],
    tags: [
      "Python",
      "FastAPI",
      "AWS Lambda",
      "Amazon S3",
      "EventBridge",
      "pytest",
      "GitHub Actions",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/PaschalKen/ForecastBridge" },
      {
        label: "Visit Live",
        href: "https://4hgo4skmrmq4avm52lrgj23lzu0gatfn.lambda-url.eu-north-1.on.aws/",
      },
    ],
    featured: true,
  },
  {
    slug: "subira",
    type: "project",
    title: "Subira",
    start: "2026-07",
    end: null,
    summary:
      "Offline first gym workout tracker, built as a Vue 3 PWA that stores workouts on the device and syncs them to an ASP.NET Core API on PostgreSQL.",
    bullets: [
      "📱 Workouts are logged straight into IndexedDB through a typed Dexie repository, so the app works fully offline, with cascading deletes handled safely inside transactions.",
      "🔄 A timestamp based sync API sends back only the rows changed since the last sync, including soft deleted records, and resolves conflicts with last write wins on update time.",
      "🔐 ASP.NET Core Identity with JWT bearer tokens secures every endpoint by default, while EF Core global query filters stop users ever seeing deleted rows or another user's data.",
      "⏱️ Logging a set starts a full screen rest timer that saves the rest time on that set, and the history view groups finished workouts by month with duration, set counts and muscle groups.",
    ],
    tags: [
      "Vue.js",
      "TypeScript",
      "PWA",
      "ASP.NET Core",
      "C#",
      "Entity Framework Core",
      "PostgreSQL",
      "Dexie.js",
    ],
    links: [{ label: "GitHub", href: "https://github.com/PaschalKen/Subira" }],
    featured: true,
  },
  {
    slug: "seeman-business-management",
    type: "project",
    title: "Seeman Business Management System",
    org: "Final year project",
    start: "2025-11",
    end: null,
    summary:
      "Multi branch business management system for an automotive parts distributor, with a React and TypeScript PWA frontend and a NestJS API on PostgreSQL covering reporting, sales, supplies, stock/inventory and staff activities.",
    award: "School of Computing Project Excellence Award",
    bullets: [
      "📶 Sales and expenses recorded offline are queued in an IndexedDB outbox and replayed on reconnect; idempotency keys prevent duplicates, server errors stay queued and rejected requests are marked as failed.",
      "🔁 Recording a sale automatically opens a supply order and an activity log entry through domain events on the NestJS CQRS event bus, and fulfilling the supply deducts warehouse stock inside one database transaction.",
      "🔐 Access follows each staff role: a global guard checks every route against role permissions stored in PostgreSQL, the API restricts most roles to their own branch's records, and a new login revokes older sessions.",
      "🧾 Day to day work covers part payments that update a sale's payment status, printable receipts, offloading shipping containers into warehouse stock, and time limited impersonation so admins can see exactly what a user sees.",
    ],
    tags: [
      "TypeScript",
      "React",
      "NestJS",
      "PostgreSQL",
      "TypeORM",
      "PWA",
      "IndexedDB",
      "Redux Toolkit",
      "Tailwind CSS",
      "Jest",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Seeman-Business-Systems/Seeman-Business-management",
      },
      { label: "Visit Live", href: "https://seemanauto.onrender.com/" },
    ],
    featured: true,
  },
  {
    slug: "student-information-assistant-2025",
    type: "role",
    title: "Student Information Assistant",
    org: "University of Portsmouth",
    start: "2025-09",
    end: "2026-05",
    bullets: [
      "Served as first point of contact for a service supporting over 1,100 students, assessing each enquiry quickly and either resolving it or directing it to the appropriate team based on set procedures.",
      "Communicated clearly and patiently with people of varying backgrounds, often supporting students who were anxious or distressed, responding in a calm, caring and professional manner.",
      "Maintained accurate student records and managed the appointment booking system, keeping information confidential to a high standard of accuracy.",
      "Prioritised competing demands during busy periods and events, taking personal ownership of issues and seeing them through to resolution.",
      "Verified and maintained placement and job listings on the University's MyCareer platform, liaising with internal teams and external employers to ensure accuracy before publishing.",
      "Planned and supported careers events, Open Days and Freshers events, directing employers and students and resolving queries on the day.",
    ],
  },
  {
    slug: "radweb",
    type: "role",
    title: "Junior Software Developer",
    org: "Radweb Ltd (Industrial placement)",
    start: "2024-07",
    end: "2025-09",
    summary:
      "Developed and maintained production SaaS applications in PHP, Laravel, React (TypeScript) and MySQL, delivering features, bug fixes and improvements for a property inspection platform used by over 3,500 clients in 50+ countries.",
    bullets: [
      "Built backend functionality in object-oriented PHP with Laravel across controllers, models, business logic and Blade views, in an event-driven codebase organised by business domain.",
      "Investigated and fixed production bugs across frontend and backend code, tracing each one to its root cause rather than its symptom, and working with QA and senior engineers to verify the fix.",
      "Migrated the Google Maps integration to AdvancedMarkerElement, adding zoom-based entity limiting, bounds-based querying and polygon property selection.",
      "Contributed to AWS features using S3 and Lambda, including a production GPT-4 workflow that generated property inspection reports from uploaded images and video.",
      "Built and maintained REST API integrations with external property platforms, using OAuth 2 for secure authentication.",
      "Wrote automated tests with PHP Prophecy for backend code and Cypress for end-to-end workflows, took part in code reviews, and supported CI/CD pipelines using CircleCI and Docker.",
      "Monitored errors and uptime with Sentry and Alertra to identify failures and keep services reliable.",
      "Received several MVP awards, including one for clearing a batch of customer-facing issues.",
    ],
    tags: ["PHP", "Laravel", "React", "TypeScript", "MySQL", "AWS", "Docker", "CircleCI", "Cypress"],
  },
  {
    slug: "computing-ambassador",
    type: "role",
    title: "Computing Undergraduate Ambassador",
    org: "Trafalgar School, Portsmouth",
    start: "2024-02",
    end: "2024-05",
    summary:
      "Weekly placement supporting computing lessons alongside the class teacher, as part of the University of Portsmouth's Computing Undergraduate Ambassador module.",
    bullets: [
      "Supported the class teacher during weekly computing lessons, helping lessons run smoothly and giving students extra attention where they needed it.",
      "Observed lessons and took notes on the teaching methods used, using these for module reporting and to reflect on my own communication and development.",
      "Worked professionally within a structured school environment, following the school's policies, routines and expectations.",
    ],
  },
  {
    slug: "student-information-assistant-2024",
    type: "role",
    title: "Student Information Assistant",
    org: "University of Portsmouth",
    start: "2024-01",
    end: "2024-06",
    bullets: [
      "Responded to a high volume of student queries in person and by email, resolving issues promptly or escalating where appropriate.",
      "Supported one-to-one and group sessions, adapting guidance to each individual's needs and circumstances.",
      "Organised meetings and managed scheduling based on individual student circumstances, ensuring appropriate support allocation.",
      "Collaborated with the careers team to coordinate placement and job fairs, connecting students with potential employers.",
    ],
  },
  {
    slug: "seefit",
    type: "project",
    title: "SeeFit",
    org: "Module coursework",
    start: "2024-01",
    end: "2024-06",
    summary:
      "HIIT interval training app, installable as a PWA, with a JavaScript frontend and a Node.js and Express REST API on SQLite for building and running custom workouts.",
    award: "81%, the highest mark in the cohort",
    bullets: [
      "⏱️ Users build custom workouts from timed exercise and recovery periods, then perform them with a live countdown, a progress ring and audio cues.",
      "📱 Installable as a Progressive Web App, with a full create, edit and delete flow for workouts and both light and dark themes.",
      "📊 A dashboard tracks completed workouts, backed by a REST API over SQLite.",
      "🧭 Interface designed against Nielsen's usability heuristics.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "SQLite", "PWA"],
    links: [{ label: "GitHub", href: "https://github.com/PaschalKen/SeeFit" }],
    featured: true,
  },
  {
    slug: "virtual-pet",
    type: "project",
    title: "Virtual Pet",
    org: "Module coursework",
    start: "2022-09",
    end: "2023-05",
    summary:
      "Browser-based virtual pet simulator built with vanilla JavaScript, HTML and CSS on a small Node.js server, where the pet's needs change in real time.",
    bullets: [
      "🐣 Happiness, hunger, cleanliness and sleep meters decay in real time, and the pet has to be fed, cleaned, played with or woken up to keep it alive.",
      "💾 A small JSON-backed persistence layer saves each pet, so it can be retrieved on a return visit.",
      "🧩 Built with a modular ES module structure in plain JavaScript, with no frontend framework.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Express"],
    links: [
      { label: "GitHub", href: "https://github.com/PaschalKen/Virtual-Pet" },
    ],
  },
  // {
  //   slug: "portsmouth",
  //   type: "education",
  //   title: "BSc (Hons) Software Engineering with Placement Year",
  //   org: "University of Portsmouth",
  //   // TODO: exact start and graduation months.
  //   start: "2022-09",
  //   end: "2026-07",
  //   bullets: [
  //     "First Class Honours",
  //     "School of Computing Project Excellence Award for my final year project",
  //     // TODO: part-time roles (Student Information Assistant, IT Help Adviser)? Add or delete.
  //   ],
  // },
];

// TODO: Hue Smash — no repo or details yet; add an entry when ready.

/** Newest first, ongoing entries at the top. */
export const timeline = [...entries].sort(
  (a, b) => (b.end === null ? 1 : 0) - (a.end === null ? 1 : 0) || b.start.localeCompare(a.start),
);

export const featuredProjects = timeline.filter((e) => e.type === "project" && e.featured);
