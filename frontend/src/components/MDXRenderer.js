import { useMemo } from "react";
import { MDXProvider } from "@mdx-js/react";

const components = {
  h1: (props) => <h1 className="text-3xl font-display font-light tracking-tight text-neutral-100 mb-6 mt-10" {...props} />,
  h2: (props) => <h2 className="text-2xl font-display font-light tracking-tight text-neutral-100 mb-4 mt-8" {...props} />,
  h3: (props) => <h3 className="text-xl font-display font-light tracking-tight text-neutral-100 mb-3 mt-6" {...props} />,
  p: (props) => <p className="text-neutral-300 leading-relaxed mb-4" {...props} />,
  ul: (props) => <ul className="list-disc list-inside text-neutral-300 leading-relaxed mb-4 space-y-2" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside text-neutral-300 leading-relaxed mb-4 space-y-2" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: (props) => <a className="text-amber-300 hover:text-amber-200 underline" {...props} />,
  code: (props) => <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded text-amber-200" {...props} />,
  pre: (props) => <pre className="bg-[#030507] border border-white/10 rounded-lg p-4 overflow-x-auto mb-6" {...props} />,
  blockquote: (props) => <blockquote className="border-l-2 border-amber-300/50 pl-4 italic text-neutral-400 my-4" {...props} />,
  strong: (props) => <strong className="text-neutral-100" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  hr: (props) => <hr className="border-white/10 my-8" {...props} />,
  table: (props) => <div className="overflow-x-auto my-6"><table className="min-w-full border border-white/10" {...props} /></div>,
  th: (props) => <th className="border border-white/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] bg-white/5 text-neutral-300" {...props} />,
  td: (props) => <td className="border border-white/10 px-3 py-2 text-neutral-300" {...props} />,
  tr: (props) => <tr {...props} />,
  thead: (props) => <thead {...props} />,
  tbody: (props) => <tbody {...props} />,
};

export function MDXRenderer({ code }) {
  const Component = useMemo(() => {
    if (!code) return null;
    try {
      const fn = new Function("React", "return " + code)();
      return fn.default || fn;
    } catch (e) {
      console.error("MDX render error:", e);
      return null;
    }
  }, [code]);

  if (!Component) {
    return <div className="text-neutral-500">Failed to render content</div>;
  }

  return (
    <MDXProvider components={components}>
      <Component />
    </MDXProvider>
  );
}