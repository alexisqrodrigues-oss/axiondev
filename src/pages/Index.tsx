import { Link } from "react-router-dom";
import { useMemo } from "react";
import { getAllPosts } from "@/lib/posts";
import { useI18n } from "@/lib/i18n";

const PlaceholderIndex = () => {
  const posts = useMemo(() => getAllPosts(), []);
  const { t, lang } = useI18n();

  const filtered = posts.filter((p) => p.lang === "all" || p.lang === lang);

  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          ~/axison.dev/
        </p>
        <h1 className="font-display text-5xl md:text-6xl mt-3 leading-[1.05]">
          {t.latestPosts}
        </h1>
      </header>

      {filtered.length === 0 && (
        <p className="font-mono text-sm text-muted-foreground">{t.noResults}</p>
      )}

      <ul className="divide-y divide-border border-y border-border">
        {filtered.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/posts/${p.slug}`}
              className="group flex items-baseline gap-4 py-4 hover:bg-secondary/40 transition-colors px-2 -mx-2 rounded-sm"
            >
              <time className="font-mono text-xs text-muted-foreground tabular-nums shrink-0 w-24">
                {p.date}
              </time>
              <span className="text-base md:text-lg group-hover:text-primary transition-colors flex-1 leading-snug">
                {p.title}
              </span>
              {p.category && (
                <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {p.category}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Index = PlaceholderIndex;
export default Index;
