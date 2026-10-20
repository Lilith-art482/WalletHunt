"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleHelp, Moon, Search, Star, Sun } from "lucide-react";
import { useEffect, useRef } from "react";
import { BrandMark } from "./brand-mark";
import { useFavorites } from "./favorites-provider";
import { usePreferences } from "./preferences-provider";
import { useUI } from "./ui-provider";
import { formatInteger } from "@/lib/i18n";
import { devs, wallets } from "@/lib/data";

export function SiteHeader() {
  const pathname = usePathname();
  const { dictionary: t, language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const { favoriteCount } = useFavorites();
  const { query, setQuery, setGuideOpen } = useUI();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        Boolean(target?.isContentEditable);

      if (isTyping || document.querySelector('[aria-modal="true"]')) return;

      event.preventDefault();
      searchRef.current?.focus();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const isWallets = pathname === "/wallets" || pathname === "/";
  const isDevs = pathname === "/devs";
  const isFavorites = pathname === "/favorites";

  const placeholder = isFavorites
    ? t.searchFavorites
    : isDevs
      ? t.searchDevs
      : t.searchWallets;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link aria-label="Wallet Hunt" className="brand" href="/wallets">
          <BrandMark size={27} />
          <span className="brand-name">Wallet Hunt</span>
        </Link>

        <nav aria-label="Primary" className="main-nav">
          <Link
            className={`nav-link ${isWallets ? "active" : ""}`}
            href="/wallets"
          >
            <span>{t.wallets}</span>
            <span className="nav-count">{formatInteger(wallets.length, language)}</span>
          </Link>
          <Link className={`nav-link ${isDevs ? "active" : ""}`} href="/devs">
            <span>{t.devs}</span>
            <span className="nav-count">{formatInteger(devs.length, language)}</span>
          </Link>
          <Link
            aria-label={t.favorites}
            className={`nav-link nav-link-favorites ${isFavorites ? "active" : ""}`}
            href="/favorites"
          >
            <Star
              className="nav-star"
              fill={isFavorites ? "currentColor" : "none"}
              size={14}
              strokeWidth={1.6}
            />
            <span>{t.favorites}</span>
            <span className="nav-count">{formatInteger(favoriteCount, language)}</span>
          </Link>
        </nav>

        <div className="header-actions">
          <label className="search-field">
            <Search aria-hidden="true" className="search-icon" size={15} />
            <input
              aria-label={placeholder}
              autoCapitalize="off"
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  if (query) setQuery("");
                  event.currentTarget.blur();
                }
              }}
              placeholder={placeholder}
              ref={searchRef}
              spellCheck={false}
              type="search"
              value={query}
            />
            <span aria-hidden="true" className="search-shortcut">
              /
            </span>
          </label>

          <div className="header-buttons">
            <button
              aria-label={t.openGuide}
              className="icon-button"
              onClick={() => setGuideOpen(true)}
              title={t.openGuide}
              type="button"
            >
              <CircleHelp size={17} strokeWidth={1.7} />
            </button>

            <button
              aria-label={t.switchLanguage}
              className="language-button"
              onClick={toggleLanguage}
              title={t.switchLanguage}
              type="button"
            >
              {language === "ru" ? "EN" : "RU"}
            </button>

            <button
              aria-label={t.switchTheme}
              className="icon-button"
              onClick={toggleTheme}
              title={t.switchTheme}
              type="button"
            >
              {theme === "dark" ? (
                <Moon size={16} strokeWidth={1.8} />
              ) : (
                <Sun size={17} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
