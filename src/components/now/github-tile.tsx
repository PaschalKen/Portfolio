import { Tile } from "@/components/now/tile";
import { getContributions } from "@/lib/github";

export async function GitHubTile() {
  const data = await getContributions();
  if (!data) return null;

  return (
    <Tile label="</> GitHub">
      <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="group block">
        <p className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">{data.total.toLocaleString("en-GB")}</span>
          <span className="text-sm text-muted group-hover:text-fg">contributions in the last year</span>
        </p>
        <span className="sr-only">(opens GitHub in a new tab)</span>
      </a>
    </Tile>
  );
}
