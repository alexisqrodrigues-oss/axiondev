import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import mermaid from "mermaid";
import { useTheme } from "@/lib/theme";
import { Post, resolveAssetUrl } from "@/lib/posts";

interface Props {
  post: Post;
}

export default function MarkdownView({ post }: Props) {
  const { resolved } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isDark = ["dark", "antigravity", "vscode", "terminal", "github-dark"].includes(resolved);
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-mono)",
    });
    if (containerRef.current) {
      const blocks = containerRef.current.querySelectorAll<HTMLElement>(".mermaid-block");
      blocks.forEach(async (el, i) => {
        const code = el.dataset.code || "";
        try {
          const { svg } = await mermaid.render(`mmd-${post.slug}-${i}-${Date.now()}`, code);
          el.innerHTML = svg;
        } catch (err) {
          el.innerHTML = `<pre class="text-destructive text-xs">${(err as Error).message}</pre>`;
        }
      });
    }
  }, [post.slug, post.content, resolved]);

  return (
    <div ref={containerRef} className="prose-md max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "append", properties: { className: "heading-anchor", ariaHidden: "true", tabIndex: -1 }, content: { type: "text", value: "#" } }],
        ]}
        components={{
          img: ({ src, alt, ...rest }) => (
            <img src={resolveAssetUrl(post, String(src || ""))} alt={alt || ""} loading="lazy" {...rest} />
          ),
          a: ({ href, children, ...rest }) => {
            const isExternal = href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                {...rest}
              >
                {children}
              </a>
            );
          },
          pre: ({ children, ...props }) => {
            // detect mermaid
            const child = Array.isArray(children) ? children[0] : children;
            const codeProps = (child as { props?: { className?: string; children?: string } })?.props;
            const className = codeProps?.className || "";
            const lang = className.replace(/^language-/, "").trim();
            const codeText = String(codeProps?.children || "");

            if (lang === "mermaid") {
              return <div className="mermaid-block" data-code={codeText} />;
            }
            return (
              <div className="code-block-wrapper">
                {lang && <span className="code-block-lang">{lang}</span>}
                <pre {...props}>{children}</pre>
              </div>
            );
          },
        }}
      >
        {post.content}
      </ReactMarkdown>
    </div>
  );
}
