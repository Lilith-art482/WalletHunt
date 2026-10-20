"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import type { Language, Theme } from "@/lib/types";

const LANGUAGE_KEY = "wallet-hunt:language";
const THEME_KEY = "wallet-hunt:theme";

interface PreferencesContextValue {
  language: Language;
  theme: Theme;
  dictionary: Dictionary;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
      const savedTheme = window.localStorage.getItem(THEME_KEY);

      if (savedLanguage === "ru" || savedLanguage === "en") {
        setLanguageState(savedLanguage);
      }
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
      }
    } catch {
      setReady(true);
      return;
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem(LANGUAGE_KEY, language);
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      return;
    }
  }, [language, theme, ready]);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => (current === "ru" ? "en" : "ru"));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const dictionary = useMemo(() => getDictionary(language), [language]);

  const value = useMemo(
    () => ({
      language,
      theme,
      dictionary,
      toggleLanguage,
      toggleTheme,
      setLanguage: setLanguageState,
      setTheme: setThemeState,
    }),
    [dictionary, language, theme, toggleLanguage, toggleTheme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }

  return context;
}
