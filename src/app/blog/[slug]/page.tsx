import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPost, getPosts } from "@/lib/blog";
import { formatDay } from "@/lib/dates";

// Cache Components needs at least one param to validate the route; with no posts yet,
// a placeholder slug is generated and resolves to notFound().
const NO_POSTS = "__no-posts__";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length > 0 ? posts.map((p) => ({ slug: p.slug })) : [{ slug: NO_POSTS }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

// The shell shared by every post renders instantly on navigation; the post itself, which
// depends on the URL, streams in behind Suspense.
export default function Page({ params }: PageProps<"/blog/[slug]">) {
  return (
    <article>
      <Link href="/blog" className="text-sm text-muted hover:text-fg">
        <span aria-hidden="true">←</span> All posts
      </Link>
      <Suspense fallback={<PostSkeleton />}>
        <Post params={params} />
      </Suspense>
    </article>
  );
}

async function Post({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const { default: Content } = await import(`@/content/posts/${post.slug}.mdx`);

  return (
    <>
      <header className="mt-6 mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted">
          <time dateTime={post.date}>{formatDay(post.date)}</time> · {post.readingMinutes} min read
        </p>
      </header>
      <div className="prose prose-site max-w-none">
        <Content />
      </div>
    </>
  );
}

function PostSkeleton() {
  return (
    <div aria-busy="true">
      <div className="mt-6 mb-10 space-y-3">
        <div className="h-9 w-3/4 animate-pulse rounded bg-surface" />
        <div className="h-4 w-40 animate-pulse rounded bg-surface" />
      </div>
      <div className="space-y-3">
        {[100, 95, 98, 70].map((w) => (
          <div key={w} className="h-4 animate-pulse rounded bg-surface" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
