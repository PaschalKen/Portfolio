const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-07" → "Jul 2024". Formatted by hand so server and client always agree. */
export function formatMonth(ym: string) {
  const [year, month] = ym.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** end: undefined = single date, null = ongoing. */
export function formatRange(start: string, end?: string | null) {
  if (end === undefined) return formatMonth(start);
  return `${formatMonth(start)} – ${end === null ? "Now" : formatMonth(end)}`;
}
