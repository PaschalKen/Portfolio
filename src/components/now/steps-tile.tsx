import { DayLabel } from "@/components/now/day-label";
import { Tile } from "@/components/now/tile";
import { now } from "@/content/now";
import { formatDay } from "@/lib/dates";
import { getSteps } from "@/lib/steps";

const LABEL = "👟 Steps";
const format = (n: number) => n.toLocaleString("en-GB");

/** Live steps from the phone when available, else the hand-entered figure, else nothing. */
export async function StepsTile() {
  const live = await getSteps();

  if (live) {
    return (
      <Tile label={LABEL}>
        <p className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">{format(live.latest.steps)}</span>
          <span className="text-sm text-muted">
            <DayLabel date={live.latest.date} />
          </span>
        </p>
        <p className="mt-1 text-sm text-muted">
          <span className="tabular-nums text-fg">{format(live.weekTotal)}</span> in the last 7 days
        </p>
      </Tile>
    );
  }

  if (now.steps.dailyAverage !== null) {
    return (
      <Tile label={LABEL} footnote={now.steps.asOf ? `Daily average, as of ${formatDay(now.steps.asOf)}` : undefined}>
        <p className="text-2xl font-semibold tabular-nums">{format(now.steps.dailyAverage)}</p>
      </Tile>
    );
  }

  return null;
}
