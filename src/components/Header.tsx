import { Link, useLocation, useNavigate } from "react-router-dom";
import { Github, Search, Monitor, Sun, Moon, Palette, Languages } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme, VIEW_MODES, ViewMode } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";
import Fuse from "fuse.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { mode, setMode, resolved } = useTheme();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const posts = useMemo(() => getAllPosts(), []);
  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "tags", "category", "excerpt", "slug"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [posts]
  );
  const results = useMemo(() => {
    if (!q.trim()) return [];
    return fuse.search(q).slice(0, 6).map((r) => r.item);
  }, [q, fuse]);

  // close on route change
  useEffect(() => {
    setOpen(false);
    setQ("");
  }, [location.pathname]);

  // keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ThemeIcon =
    resolved === "light" || resolved === "github" || resolved === "codex" || resolved === "claude"
      ? Sun
      : resolved === "dark" || resolved === "github-dark" || resolved === "vscode" || resolved === "antigravity"
      ? Moon
      : Palette;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-14 items-center gap-3 md:gap-5">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-base font-semibold tracking-tight"
          aria-label="axison.dev home"
        >
          <span className="text-primary">~</span>
          <span>axison</span>
          <span className="text-muted-foreground">.dev</span>
        </Link>

        <div className="flex-1" />

        <Link
          to="/about"
          className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors md:inline"
        >
          {t.about}
        </Link>

        <a
          href="https://github.com/axison"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
        </a>

        {/* Search */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder={t.searchPlaceholder}
              className="h-8 w-40 md:w-56 rounded-md border border-input bg-secondary/40 pl-8 pr-10 text-sm font-mono outline-none focus:border-primary focus:bg-background transition-colors"
              aria-label={t.search}
            />
            <kbd className="absolute right-2 hidden md:inline text-[10px] font-mono text-muted-foreground border border-border rounded px-1 py-0.5">
              ⌘K
            </kbd>
          </div>
          {open && results.length > 0 && (
            <div className="absolute right-0 top-10 w-80 rounded-md border border-border bg-popover shadow-lg overflow-hidden animate-fade-in">
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.map((p) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        navigate(`/posts/${p.slug}`);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-accent/10 transition-colors"
                    >
                      <div className="text-xs font-mono text-muted-foreground">{p.date}</div>
                      <div className="text-sm font-medium truncate">{p.title}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {open && q && results.length === 0 && (
            <div className="absolute right-0 top-10 w-80 rounded-md border border-border bg-popover px-3 py-3 text-sm text-muted-foreground shadow-lg animate-fade-in">
              {t.noResults}
            </div>
          )}
        </div>

        {/* Lang */}
        <button
          type="button"
          onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          aria-label="toggle language"
        >
          <Languages className="h-3.5 w-3.5" />
          <span className={lang === "pt" ? "text-foreground font-semibold" : ""}>pt</span>
          <span className="opacity-30">|</span>
          <span className={lang === "en" ? "text-foreground font-semibold" : ""}>en</span>
        </button>

        {/* Theme */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t.viewMode}
          >
            <ThemeIcon className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              {t.base}
            </DropdownMenuLabel>
            {VIEW_MODES.filter((v) => v.group === "base").map((v) => (
              <ThemeItem key={v.id} id={v.id} label={v.label} active={mode === v.id} onSelect={setMode} />
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              {t.creative}
            </DropdownMenuLabel>
            {VIEW_MODES.filter((v) => v.group === "creative").map((v) => (
              <ThemeItem key={v.id} id={v.id} label={v.label} active={mode === v.id} onSelect={setMode} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function ThemeItem({
  id,
  label,
  active,
  onSelect,
}: {
  id: ViewMode;
  label: string;
  active: boolean;
  onSelect: (m: ViewMode) => void;
}) {
  const Icon = id === "system" ? Monitor : id === "light" ? Sun : id === "dark" ? Moon : Palette;
  return (
    <DropdownMenuItem
      onSelect={() => onSelect(id)}
      className={`flex items-center gap-2 text-sm cursor-pointer ${active ? "text-primary font-medium" : ""}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="font-mono">{label}</span>
      {active && <span className="ml-auto text-xs">●</span>}
    </DropdownMenuItem>
  );
}
