import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { saveSteps, STEPS_TAG, type StepsDay } from "@/lib/steps";

// Called by the steps-uploader app on the phone:
//   POST /api/steps
//   Authorization: Bearer <STEPS_API_KEY>
//   { "days": [{ "date": "2026-10-29", "steps": 6240 }, ...] }
// The app resends the last few days each time, so a missed upload heals itself.

const MAX_DAYS = 31;
const MAX_STEPS = 200_000;

function authorised(header: string | null) {
  const expected = process.env.STEPS_API_KEY;
  if (!expected || !header?.startsWith("Bearer ")) return false;
  // Hash both sides so the comparison is constant-time regardless of length.
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(header.slice(7)), digest(expected));
}

function isValidDate(date: unknown): date is string {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
}

function parseDays(body: unknown): StepsDay[] | null {
  const days = (body as { days?: unknown })?.days;
  if (!Array.isArray(days) || days.length === 0 || days.length > MAX_DAYS) return null;
  const parsed: StepsDay[] = [];
  for (const d of days) {
    const { date, steps } = (d ?? {}) as { date?: unknown; steps?: unknown };
    if (!isValidDate(date) || !Number.isInteger(steps) || (steps as number) < 0 || (steps as number) > MAX_STEPS) {
      return null;
    }
    parsed.push({ date, steps: steps as number });
  }
  return parsed;
}

export async function POST(request: Request) {
  if (!authorised(request.headers.get("authorization"))) {
    return Response.json({ error: "unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const days = parseDays(body);
  if (!days) {
    return Response.json(
      { error: `expected { days: [{ date: "YYYY-MM-DD", steps: 0-${MAX_STEPS} }] }, 1-${MAX_DAYS} days` },
      { status: 400 },
    );
  }

  try {
    await saveSteps(days);
  } catch (err) {
    console.error("[steps] save failed:", err instanceof Error ? err.message : err);
    return Response.json({ error: "storage unavailable" }, { status: 503 });
  }

  // Next visit to /now reads the new numbers instead of the cached ones.
  revalidateTag(STEPS_TAG, { expire: 0 });
  return Response.json({ saved: days.length });
}
