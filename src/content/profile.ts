export type Profile = {
  positioning: string;
  intro: string[];
  status: string;
  cv: string | null;
};

export const profile: Profile = {
  positioning: "Software developer building practical, offline-first web apps for real businesses.",
  intro: [
    "Software Engineering graduate from the University of Portsmouth (First Class Honours), with a 14-month industrial placement at Radweb Ltd working across React, TypeScript, Laravel and AWS.",
    "Interested in building software for small and growing businesses, particularly in Nigeria, and currently learning Python and AWS through a side project.",
  ],
  // TODO: current status, e.g. "Starting a new role as a Junior Software Developer in late 2026".
  status: "TODO: current status",
  // TODO: drop the CV PDF into /public and set this to "/cv.pdf".
  cv: null,
};
