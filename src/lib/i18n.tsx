import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "pt" | "en";
const STORAGE_KEY = "axison.lang";

const dict = {
  pt: {
    about: "sobre",
    search: "buscar...",
    searchPlaceholder: "buscar posts...",
    viewMode: "modo de exibição",
    base: "base",
    creative: "criativos",
    home: "início",
    latestPosts: "últimas postagens",
    noResults: "nenhum post encontrado",
    backToHome: "voltar ao início",
    rights: "todos os direitos reservados",
    aboutTitle: "sobre",
    aboutBody: `Olá, sou **Axison**.

Este blog é meu diário público de aprendizado em **dev** e **IA**: workflows, instalação de softwares, estudos acadêmicos, scripts, automações, dicas, tutoriais, linguagens e benchmarks de IA.

Cada post é escrito em **markdown** puro, sem distrações. O objetivo é ser fácil de ler, pesquisar e encontrar.

> _"escrever é pensar duas vezes."_`,
    postNotFound: "post não encontrado",
    minRead: "min de leitura",
    publishedOn: "publicado em",
    tableOfContents: "índice",
  },
  en: {
    about: "about",
    search: "search...",
    searchPlaceholder: "search posts...",
    viewMode: "view mode",
    base: "base",
    creative: "creative",
    home: "home",
    latestPosts: "latest posts",
    noResults: "no posts found",
    backToHome: "back to home",
    rights: "all rights reserved",
    aboutTitle: "about",
    aboutBody: `Hi, I'm **Axison**.

This blog is my public learning journal on **dev** and **AI**: workflows, software setup, academic studies, scripts, automations, tips, tutorials, languages, and AI benchmarks.

Every post is written in plain **markdown**, no distractions. The goal: easy to read, search, and find.

> _"to write is to think twice."_`,
    postNotFound: "post not found",
    minRead: "min read",
    publishedOn: "published on",
    tableOfContents: "table of contents",
  },
} as const;

type Dict = { [K in keyof typeof dict.pt]: string };

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "pt";
    return (localStorage.getItem(STORAGE_KEY) as Lang) || "pt";
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);
  return (
    <I18nContext.Provider value={{ lang, setLang: setLangState, t: dict[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
