import { motion } from "framer-motion";
import { PageShell } from "../PageShell";
import { getBlogPost, formatDate, readingTime } from "@/lib/blog";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function BlogPostView({ params }) {
  const { slug } = params;
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <PageShell
        testid="blog-post-not-found"
        eyebrow="06 — Silk Threads"
        onBack={() => window.history.back()}
        titleLines={[
          { text: "Thread Not Found", className: "font-display text-4xl sm:text-5xl font-light tracking-tight text-neutral-100" },
        ]}
      >
        <motion.div
          {...fadeUp}
          className="text-center py-24"
          data-testid="blog-post-404"
        >
          <p className="font-display text-xl font-light text-neutral-400">
            This thread doesn't exist or has been cut.
          </p>
          <p className="mt-4 font-mono text-xs text-neutral-500">
            <a href="/blog" className="text-amber-300 hover:text-amber-200 underline">
              Return to the web
            </a>
          </p>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell
      testid="blog-post-view"
      eyebrow="06 — Silk Threads"
      onBack={() => window.history.back()}
      titleLines={[
        {
          text: post.title,
          className: "font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-100 leading-snug",
        },
      ]}
    >
      <article className="mt-12 max-w-3xl mx-auto">
        <header className="mb-10 pb-8 border-b border-white/10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-white/5 border border-white/10 text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-neutral-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{readingTime(post.body?.raw || '')} min read</span>
          </div>
        </header>

        <motion.div
          {...fadeUp}
          className="prose prose-neutral dark:prose-invert max-w-none"
          data-testid="blog-post-content"
        >
          {post.body}
        </motion.div>

        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-4 text-neutral-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span>Tags:</span>
            {post.tags?.map((tag) => (
              <span key={tag} className="text-amber-300/70">
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </PageShell>
  );
}