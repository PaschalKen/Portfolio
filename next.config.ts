import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Spotify album art and artist photos.
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co", pathname: "/image/**" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Blog posts (src/content/posts/*.mdx). Plugins are named by string so Turbopack can load them.
const withMDX = createMDX({
  options: {
    // Front matter is read by src/lib/blog.ts; this just stops it rendering as text.
    remarkPlugins: ["remark-frontmatter"],
    // Code blocks highlighted at build time, with colours for both themes.
    rehypePlugins: [
      ["rehype-pretty-code", { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false }],
    ],
  },
});

export default withMDX(nextConfig);
