import Link from "next/link";
import { Tile } from "@/components/now/tile";
import { getLatestPost } from "@/lib/blog";
import { formatDay } from "@/lib/dates";

const LABEL = "✍️ Blog";

/** The newest post, picked up automatically from src/content/posts; a placeholder until there is one. */
export async function BlogTile() {
  const post = await getLatestPost();

  if (!post) {
    return (
      <Tile label={LABEL}>
        <p className="font-medium">First post coming soon</p>
        <p className="text-sm text-muted">Notes on things I&apos;ve built and learned.</p>
      </Tile>
    );
  }

  return (
    <Tile label={LABEL} footnote={formatDay(post.date)}>
      <Link href={`/blog/${post.slug}`} className="font-medium hover:underline">
        {post.title}
      </Link>
      {post.summary && <p className="mt-1 line-clamp-2 text-sm text-muted">{post.summary}</p>}
    </Tile>
  );
}
