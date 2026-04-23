import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ViewMode =
  | "system"
  | "light"
  | "dark"
  | "github"
  | "github-dark"
  | "codex"
  | "claude"
  | "antigravity"
  | "vscode"
  | "terminal";

export const VIEW_MODES: { id: ViewMode; label: string; group: "base" | "creative" }[] = [
  { id: "system", label: "System", group: "base" },
  { id: "light", label: "Light", group: "base" },
  { id: "dark", label: "Dark", group: "base" },
  { id: "github", label: "GitHub", group: "creative" },
  { id: "github-dark", label: "GitHub Dark", group: "creative" },
  { id: "codex", label: "Codex", group: "creative" },
  { id: "claude", label: "Claude", group: "creative" },
  { id: "antigravity", label: "Antigravity", group: "creative" },
  { id: "vscode", label: "VS Code", group: "creative" },
  { id: "terminal", label: "Terminal", group: "creative" },
];

interface ThemeContextValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  resolved: Exclude<ViewMode, "system">;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = "axison.viewmode";

function applyTheme(mode: ViewMode): Exclude<ViewMode, "system"> {
  const root = document.documentElement;
  // clear
  root.classList.remove("dark");
  root.removeAttribute("data-theme");

  let resolved: Exclude<ViewMode, "system"> = "light";
  if (mode === "system") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } else {
    resolved = mode;
  }

  if (resolved === "dark") {
    root.classList.add("dark");
  } else if (resolved !== "light") {
    root.setAttribute("data-theme", resolved);
    // dark-ish creative themes also get .dark for shadcn dark variants
    if (["antigravity", "vscode", "terminal", "github-dark"].includes(resolved)) {
      root.classList.add("dark");
    }
  }
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(STORAGE_KEY) as ViewMode) || "system";
  });
  const [resolved, setResolved] = useState<Exclude<ViewMode, "system">>("light");

  useEffect(() => {
    setResolved(applyTheme(mode));
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(applyTheme("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode: setModeState, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
