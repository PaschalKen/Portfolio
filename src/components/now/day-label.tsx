"use client";

import { useEffect, useState } from "react";
import { formatDay } from "@/lib/dates";

/**
 * "today" when `date` is the viewer's local today, otherwise the short date. The server render
 * can't know the viewer's day (and the tile is cached), so it starts with the date and swaps after mount.
 */
export function DayLabel({ date }: { date: string }) {
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const d = new Date();
    const local = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    // Syncing to a browser-only value after mount; there's no external store to subscribe to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsToday(local === date);
  }, [date]);

  return <>{isToday ? "today" : formatDay(date).replace(/ \d{4}$/, "")}</>;
}
