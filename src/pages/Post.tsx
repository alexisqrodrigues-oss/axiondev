import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { getPostBySlug } from "@/lib/posts";
import { useI18n } from "@/lib/i18n";
import MarkdownView from "@/components/MarkdownView";

export default function PostPage() {
  const { slug = "" } = useParams();
  const post = useMemo(() => getPostBySlug(slug), [slug]);
  const { t } = useI18n();

  useEffect(() => {
    if (post) document.title = `${post.title} — axison.dev`;
    return () => {
      document.title = "axison.dev — blog dev & ai";
    };
  }, [post]);

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl text-center py-20">
        <p className="font-mono text-muted-foreground">404 — {t.postNotFound}</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          ← {t.backToHome}
        </Link>
      </div>
    );
  }

  const breadcrumbPath = `~/axison.dev/${post.category ? post.category + "/" : ""}${post.slug}/`;

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-3 w-3" />
        {t.backToHome}
      </Link>

      <nav aria-label="breadcrumb" className="mb-8">
        <p className="font-mono text-xs text-muted-foreground break-all">
          {breadcrumbPath}
        </p>
      </nav>

      <header className="mb-10 pb-8 border-b border-border">
        <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span className="opacity-40">·</span>
          <span>{post.readingMinutes} {t.minRead}</span>
          {post.tags.length > 0 && (
            <>
              <span className="opacity-40">·</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-primary">#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <MarkdownView post={post} />
    </article>
  );
}
