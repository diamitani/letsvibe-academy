import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

// Markdown renderer for authored content bodies (lesson bodies, guide lessons,
// newsletter issues, marketplace install guides). react-markdown is safe by
// default — raw HTML in source is never parsed into the DOM — and the
// `.prose-academy` styles in globals.css provide the LVAI typography.
const components: Components = {
  a: ({ href, children }) => {
    const external = href?.startsWith("http") ?? false;
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  },
};

export function Markdown({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={`prose-academy ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
