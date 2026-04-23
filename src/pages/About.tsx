import { useI18n } from "@/lib/i18n";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function About() {
  const { t } = useI18n();
  return (
    <article className="mx-auto max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground mb-4">~/axison.dev/about/</p>
      <h1 className="font-display text-5xl mb-8">{t.aboutTitle}</h1>
      <div className="prose-md max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.aboutBody}</ReactMarkdown>
      </div>
    </article>
  );
}
