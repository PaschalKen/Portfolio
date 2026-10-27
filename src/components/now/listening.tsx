import Image from "next/image";
import { getRecentlyPlayed, getTopArtists } from "@/lib/spotify";

export async function Listening() {
  const [artists, recent] = await Promise.all([getTopArtists(), getRecentlyPlayed()]);

  if (artists.length === 0 && recent.length === 0) {
    return <p className="text-muted">Spotify stats will show here once it&apos;s connected.</p>;
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      {artists.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm text-muted">Top artists this month</h3>
          <ol className="space-y-3">
            {artists.map((a, i) => (
              <li key={a.url}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                  <span className="w-4 text-right font-mono text-xs text-muted">{i + 1}</span>
                  {a.image && (
                    <Image src={a.image} alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
                  )}
                  <span className="truncate group-hover:underline">{a.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
      {recent.length > 0 && (
        <div>
          <h3 className="mb-4 text-sm text-muted">Recently played</h3>
          <ul className="space-y-3">
            {recent.map((t) => (
              <li key={t.playedAt}>
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                  {t.image && <Image src={t.image} alt="" width={36} height={36} className="size-9 rounded" />}
                  <span className="min-w-0">
                    <span className="block truncate group-hover:underline">{t.title}</span>
                    <span className="block truncate text-sm text-muted">{t.artists}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ListeningSkeleton() {
  return (
    <div className="grid gap-10 sm:grid-cols-2" aria-busy="true">
      {[0, 1].map((col) => (
        <div key={col} className="space-y-3">
          <div className="mb-4 h-4 w-32 animate-pulse rounded bg-border" />
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="flex items-center gap-3">
              <div className="size-9 animate-pulse rounded bg-border" />
              <div className="h-4 w-40 animate-pulse rounded bg-border" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
