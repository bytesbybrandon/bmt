import { useEffect, useState } from "react";
import { evaluate } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";

const components = {
  h1: (props) => <h1 {...props} className="mb-6 mt-10 font-display text-3xl font-light tracking-tight text-neutral-100" />,
  h2: (props) => <h2 {...props} className="mb-4 mt-8 font-display text-2xl font-light tracking-tight text-neutral-100" />,
  h3: (props) => <h3 {...props} className="mb-3 mt-6 font-display text-xl font-light tracking-tight text-neutral-100" />,
  p: (props) => <p {...props} className="mb-4 leading-relaxed text-neutral-300" />,
  ul: (props) => <ul {...props} className="mb-4 list-inside list-disc space-y-2 leading-relaxed text-neutral-300" />,
  ol: (props) => <ol {...props} className="mb-4 list-inside list-decimal space-y-2 leading-relaxed text-neutral-300" />,
  li: (props) => <li {...props} className="leading-relaxed" />,
  a: (props) => <a {...props} className="text-amber-300 underline hover:text-amber-200" />,
  code: ({ className, ...props }) => (
    <code
      {...props}
      className={`mdx-inline-code rounded bg-white/5 px-1.5 py-0.5 font-mono text-sm text-amber-200 ${className || ""}`}
    />
  ),
  pre: (props) => <pre {...props} className="mdx-code-block mb-6 overflow-x-auto rounded-lg border border-white/10 bg-[#030507] p-4" />,
  blockquote: (props) => <blockquote {...props} className="my-4 border-l-2 border-amber-300/50 pl-4 italic text-neutral-400" />,
  strong: (props) => <strong {...props} className="text-neutral-100" />,
  em: (props) => <em {...props} className="italic" />,
  hr: (props) => <hr {...props} className="my-8 border-white/10" />,
  table: (props) => <div className="my-6 overflow-x-auto"><table {...props} className="min-w-full border border-white/10" /></div>,
  th: (props) => <th {...props} className="border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-neutral-300" />,
  td: (props) => <td {...props} className="border border-white/10 px-3 py-2 text-neutral-300" />,
  tr: (props) => <tr {...props} />,
  thead: (props) => <thead {...props} />,
  tbody: (props) => <tbody {...props} />,
};

export function MDXRenderer({ raw }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!raw) return;
    let mounted = true;
    setComponent(null);
    setError(null);

    evaluate(raw, { ...jsxRuntime, development: false })
      .then(({ default: MDXContent }) => {
        if (!mounted) return;
        setComponent(() => MDXContent);
      })
      .catch((e) => {
        if (mounted) setError(e);
      });

    return () => { mounted = false; };
  }, [raw]);

  if (error) {
    console.error("MDX compile error:", error);
    return <div className="text-neutral-500">Failed to render content</div>;
  }

  if (!Component) {
    return <div className="text-neutral-500 animate-pulse">Rendering...</div>;
  }

  return <Component components={components} />;
}
