import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getPosts } from "@/lib/blog";
import { formatDay } from "@/lib/dates";

export const metadata: Metadata = { title: "Blog" };

export default async function Page() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader title="Blog" intro="Notes on things I've built and learned." />
      {posts.length === 0 ? (
        <p className="text-muted">First post coming soon.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block py-6">
                <h2 className="text-lg font-semibold tracking-tight group-hover:underline">{post.title}</h2>
                {post.summary && <p className="mt-1 text-muted">{post.summary}</p>}
                <p className="mt-2 text-sm text-muted">
                  {formatDay(post.date)} · {post.readingMinutes} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-8 text-sm">
        <a href="/blog/rss.xml" className="text-muted hover:text-fg">
          RSS feed
        </a>
      </p>
    </>
  );
}
