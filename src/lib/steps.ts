import "server-only";
import { cacheLife, cacheTag } from "next/cache";

// Daily step counts pushed from the phone (Galaxy Watch → Samsung Health → Health Connect →
// steps-uploader app → POST /api/steps), stored in Upstash Redis as one hash: date → steps.
const DAILY_KEY = "steps:daily";
export const STEPS_TAG = "steps";

export type StepsDay = { date: string; steps: number };
/** latest = most recent day uploaded; weekTotal = that day plus the six calendar days before it. */
export type StepsSummary = { latest: StepsDay; weekTotal: number };

const DAY_MS = 86_400_000;
const dayNumber = (date: string) => Date.parse(`${date}T00:00:00Z`) / DAY_MS;

// Upstash's REST API: POST a command (or a list of them to /pipeline) as JSON.
async function redis<T>(path: "" | "/pipeline", body: unknown): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Upstash env vars are not set");
  const res = await fetch(`${url}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export async function saveSteps(days: StepsDay[]) {
  const fields = days.flatMap((d) => [d.date, String(d.steps)]);
  await redis("", ["HSET", DAILY_KEY, ...fields]);
}

/** Latest day plus the 7-day total. Never throws: a storage outage just hides the tile. */
export async function getSteps(): Promise<StepsSummary | null> {
  "use cache";
  cacheTag(STEPS_TAG);
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Env vars only change on deploy, so "not configured" can be cached like a real result.
    cacheLife("days");
    return null;
  }
  try {
    const { result } = await redis<{ result: string[] }>("", ["HGETALL", DAILY_KEY]);
    const days: StepsDay[] = [];
    for (let i = 0; i < result.length; i += 2) days.push({ date: result[i], steps: Number(result[i + 1]) });
    days.sort((a, b) => b.date.localeCompare(a.date));
    // Fresh data arrives through revalidateTag in the API route, so a long lifetime is fine here.
    cacheLife("days");
    if (days.length === 0) return null;
    // By calendar date, not entry count, so days the phone never uploaded don't stretch the window.
    const latest = days[0];
    const weekStart = dayNumber(latest.date) - 6;
    const weekTotal = days.filter((d) => dayNumber(d.date) >= weekStart).reduce((sum, d) => sum + d.steps, 0);
    return { latest, weekTotal };
  } catch (err) {
    console.error("[steps]", err instanceof Error ? err.message : err);
    cacheLife("seconds");
    return null;
  }
}
