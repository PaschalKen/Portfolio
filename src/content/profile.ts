export type Profile = {
  positioning: string;
  intro: string[];
  status: string;
  cv: string | null;
};

export const profile: Profile = {
  positioning:
    "Software engineer building reliable web apps that solve real problems.",
  intro: [
    "First Class Software Engineering graduate from the University of Portsmouth. I spent 14 months at Radweb building features for a live property inspection platform in React, TypeScript and Laravel (PHP), and earned MVP awards along the way.",
    "I enjoy building software that solves real problems, whether that’s for a business or one of the small frustrations in my own life. Outside of code, you’ll usually find me at the gym, on a table tennis or badminton court, or buried in a history book.",
  ],
  // TODO: current status, e.g. "Starting a new role as a Junior Software Developer in late 2026".
  status: "TODO: current status",
  // TODO: drop the CV PDF into /public and set this to "/cv.pdf".
  cv: null,
};
