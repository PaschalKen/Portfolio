import "server-only";
import { cacheLife } from "next/cache";

// Contribution counts are only exposed through GitHub's GraphQL API, which needs a token
// even for public data. A read-only token with no extra scopes is enough.
const LOGIN = "PaschalKen";
const API = "https://api.github.com/graphql";

export type Contributions = { total: number; profileUrl: string };

const QUERY = `query($login: String!) {
  user(login: $login) {
    url
    contributionsCollection { contributionCalendar { totalContributions } }
  }
}`;

type Response = {
  data?: {
    user: { url: string; contributionsCollection: { contributionCalendar: { totalContributions: number } } } | null;
  };
  errors?: { message: string }[];
};

/** Contributions over the last year (GitHub's own window). Never throws: failures just hide the tile. */
export async function getContributions(): Promise<Contributions | null> {
  "use cache";
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    // Env vars only change on deploy, so "not configured" can be cached like a real result.
    cacheLife("days");
    return null;
  }
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
    });
    const json = (await res.json()) as Response;
    const user = json.data?.user;
    if (!res.ok || !user) throw new Error(json.errors?.[0]?.message ?? `HTTP ${res.status}`);
    // Contributions only change when I push, and an hour's lag is invisible at this scale.
    cacheLife("hours");
    return { total: user.contributionsCollection.contributionCalendar.totalContributions, profileUrl: user.url };
  } catch (err) {
    console.error("[github]", err instanceof Error ? err.message : err);
    cacheLife("seconds");
    return null;
  }
}
