export type Gadget = { group: "Carry" | "Desk" | "Software"; category: string; name: string; note?: string };
export type Creator = { name: string; href: string; note?: string };

export const now = {
  // Bump this whenever you edit the page.
  updated: "2026-10-27",
  currently: [
    // "Going to the gym regularly",
    "Reading more and cutting screen time",
    "Learning Python and AWS by building ForecastBridge",
  ],
  reading: {
    title: "Atomic Habits",
    author: "James Clear",
    note: "on the Kindle app",
  },
  learning: [
    {
      title: "Python and AWS",
      note: "through ForecastBridge",
      href: "https://github.com/PaschalKen/ForecastBridge",
    },
  ],
  gadgets: [
    { group: "Carry", category: "Phone", name: "Samsung Galaxy S23 Ultra" },
    { group: "Carry", category: "Watch", name: "Samsung Galaxy Watch 7 (44mm)" },
    { group: "Carry", category: "Earbuds", name: "Samsung Galaxy Buds 3 Pro" },
    { group: "Desk", category: "Laptop", name: "MacBook Pro 14-inch (M5, 2025)" }, 
    { group: "Desk", category: "Keyboard", name: "Apple Magic Keyboard" },
    { group: "Desk", category: "Mouse", name: "Uineer Ergonomic Mouse" },
  ] satisfies Gadget[],
  // TODO: YouTube creators worth following. The Watching section stays hidden while this is empty.
  creators: [] as Creator[],
  // Hand-updated until live sources exist: no Samsung Health web API; gym moves to Strava if syncing works.
  steps: { dailyAverage: null as number | null, asOf: null as string | null }, // TODO
  gym: { sessionsThisWeek: null as number | null, asOf: null as string | null }, // TODO
};
