import { useI18n } from "@/lib/i18n";
import { Github, Twitter, Rss } from "lucide-react";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          © {year} axison.dev — {t.rights}
        </p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <a href="https://github.com/axison" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-foreground transition-colors">
            <Github className="h-4 w-4" />
          </a>
          <a href="https://twitter.com/axison" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-foreground transition-colors">
            <Twitter className="h-4 w-4" />
          </a>
          <a href="/rss.xml" aria-label="RSS" className="hover:text-foreground transition-colors">
            <Rss className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
