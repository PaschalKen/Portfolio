export type Gadget = { category: string; name: string; note?: string };
export type Creator = { name: string; href: string; note?: string };

export const now = {
  // Bump this whenever you edit the page.
  updated: "2026-10-27",
  currently: [
    "Going to the gym regularly",
    "Reading more and cutting screen time",
    "Learning Python and AWS by building ForecastBridge",
    // TODO: anything else
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
    { category: "Phone", name: "Samsung Galaxy S23 Ultra" }, // TODO: confirm model
    { category: "Laptop", name: "MacBook Pro" }, // TODO: model/year
    { category: "Watch", name: "Samsung Galaxy Watch" }, // TODO: confirm model
    { category: "Headphones", name: "Samsung Galaxy Buds 3 Pro" }, // TODO: confirm model
    { category: "Keyboard", name: "Apple Magic Keyboard" }, // TODO: confirm model
    { category: "Mouse", name: "Uineer Ergonomic Mouse" }, // TODO: confirm model
    // TODO: phone, keyboard, headphones, desk, editor, terminal
  ] satisfies Gadget[],
  // TODO: YouTube creators worth following.
  creators: [] satisfies Creator[],
  // No Samsung Health web API, so steps are hand-updated (see PLAN.md).
  steps: { dailyAverage: null as number | null, asOf: null as string | null }, // TODO
};
