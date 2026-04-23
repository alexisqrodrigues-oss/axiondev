import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BaseMode = "system" | "light" | "dark";
export type CreativeTheme =
  | "default"
  | "github"
  | "codex"
  | "claude"
  | "antigravity"
  | "vscode"
  | "terminal";

export const BASE_MODES: { id: BaseMode; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export const CREATIVE_THEMES: { id: CreativeTheme; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "github", label: "GitHub" },
  { id: "codex", label: "Codex" },
  { id: "claude", label: "Claude" },
  { id: "antigravity", label: "Antigravity" },
  { id: "vscode", label: "VS Code" },
  { id: "terminal", label: "Terminal" },
];

interface ThemeContextValue {
  base: BaseMode;
  creative: CreativeTheme;
  setBase: (m: BaseMode) => void;
  setCreative: (c: CreativeTheme) => void;
  resolvedBase: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const BASE_KEY = "axison.basemode";
const CREATIVE_KEY = "axison.creative";

function resolveBase(base: BaseMode): "light" | "dark" {
  if (base === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return base;
}

function applyTheme(base: BaseMode, creative: CreativeTheme): "light" | "dark" {
  const root = document.documentElement;
  const resolved = resolveBase(base);

  // base toggles .dark class
  root.classList.toggle("dark", resolved === "dark");

  // creative theme as data-theme attribute
  if (creative === "default") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", creative);
  }
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [base, setBaseState] = useState<BaseMode>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(BASE_KEY) as BaseMode) || "system";
  });
  const [creative, setCreativeState] = useState<CreativeTheme>(() => {
    if (typeof window === "undefined") return "default";
    return (localStorage.getItem(CREATIVE_KEY) as CreativeTheme) || "default";
  });
  const [resolvedBase, setResolvedBase] = useState<"light" | "dark">("light");

  useEffect(() => {
    setResolvedBase(applyTheme(base, creative));
    localStorage.setItem(BASE_KEY, base);
    localStorage.setItem(CREATIVE_KEY, creative);
  }, [base, creative]);

  useEffect(() => {
    if (base !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedBase(applyTheme("system", creative));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [base, creative]);

  return (
    <ThemeContext.Provider
      value={{ base, creative, setBase: setBaseState, setCreative: setCreativeState, resolvedBase }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
