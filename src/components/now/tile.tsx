import type { ReactNode } from "react";

export function Tile({ label, children, footnote }: { label: string; children: ReactNode; footnote?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      {children}
      {footnote && <p className="mt-2 text-xs text-muted">{footnote}</p>}
    </div>
  );
}
