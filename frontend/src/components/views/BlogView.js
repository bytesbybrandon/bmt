import { motion } from "framer-motion";
import { PageShell } from "../PageShell";
import { getBlogPosts, formatDate, readingTime } from "@/lib/blog";
import { format } from "date-fns";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function BlogView({ onBack, onNavigate }) {
  const posts = getBlogPosts();

  const handlePostClick = (slug) => {
    onNavigate("blog-post", { slug });
  };

  return (
    <PageShell
      testid="blog-view"
      eyebrow="06 — Silk Threads"
      onBack={onBack}
      titleLines={[
        {
          text: "Silk Threads",
          className: "font-display text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-100",
        },
        {
          text: "Notes from the Web",
          className: "font-display text-2xl sm:text-3xl font-light text-amber-300/70 mt-2",
        },
      ]}
    >
      <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <motion.article
            key={post.slug}
            {...fadeUp}
            transition={{ delay: i * 0.08 }}
            className="group relative border border-white/10 bg-[#050709]/50 hover:border-amber-300/30 transition-all duration-500 p-8 cursor-pointer"
            data-testid={`blog-post-${post.slug}`}
            onClick={() => handlePostClick(post.slug)}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 bg-white/5 border border-white/10 text-neutral-400 hover:text-amber-300 hover:border-amber-300/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-display text-xl font-normal text-neutral-100 group-hover:text-amber-200 transition-colors mb-3 leading-snug">
              {post.title}
            </h2>
            <p className="font-light text-sm text-neutral-400 mb-4 line-clamp-3">
              {post.summary}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                {formatDate(post.date)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                {readingTime(post.body?.raw || '')} min read
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      {posts.length === 0 && (
        <motion.div
          {...fadeUp}
          className="text-center py-24"
          data-testid="blog-empty"
        >
          <p className="font-display text-xl font-light text-neutral-400">
            No threads spun yet.
          </p>
          <p className="mt-4 font-mono text-xs text-neutral-500">
            Add .mdx files to content/blog to begin.
          </p>
        </motion.div>
      )}
    </PageShell>
  );
}