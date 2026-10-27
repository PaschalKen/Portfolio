import { connection } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export async function GET() {
  // Always answer at request time; the Spotify call itself is cached for a few seconds.
  await connection();
  const nowPlaying = await getNowPlaying();
  return Response.json(nowPlaying, { headers: { "Cache-Control": "no-store" } });
}
