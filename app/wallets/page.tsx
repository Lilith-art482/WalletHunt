"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import {
  PeriodSelector,
  ReferenceButton,
  ViewToggle,
} from "@/components/controls";
import { usePreferences } from "@/components/preferences-provider";
import { useUI } from "@/components/ui-provider";
import { WalletCard } from "@/components/wallet-card";
import { wallets } from "@/lib/data";
import { periodKey } from "@/lib/i18n";
import type { Period } from "@/lib/types";

export default function WalletsPage() {
  const { dictionary: t, language } = usePreferences();
  const { query, setQuery } = useUI();
  const [source, setSource] = useState<"base" | "hot">("base");
  const [period, setPeriod] = useState<Period>(30);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredWallets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return wallets.filter((wallet) => {
      if (source === "hot" && !wallet.hot) return false;
      if (!normalizedQuery) return true;

      return (
        wallet.name.toLowerCase().includes(normalizedQuery) ||
        wallet.address.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, source]);

  useEffect(() => {
    setVisibleCount(12);
  }, [period, query, source, view]);

  const visibleWallets = filteredWallets.slice(0, visibleCount);
  const hasMore = filteredWallets.length > visibleWallets.length;

  return (
    <main className="page">
      <section className="page-head">
        <div className="page-title-group">
          <h1>{t.copyTraders}</h1>
          <div className="mode-tabs" role="group">
            <button
              aria-pressed={source === "base"}
              className={`mode-tab ${source === "base" ? "active" : ""}`}
              onClick={() => setSource("base")}
              type="button"
            >
              {t.base}
            </button>
            <button
              aria-pressed={source === "hot"}
              className={`mode-tab ${source === "hot" ? "active" : ""}`}
              onClick={() => setSource("hot")}
              type="button"
            >
              {t.hotToday}
            </button>
          </div>
        </div>

        <div className="toolbar-controls">
          <PeriodSelector onChange={setPeriod} value={period} />
          <span className="period-context">
            {period} {t.closedDaysPlusToday}
          </span>
          <ViewToggle onChange={setView} value={view} />
          <ReferenceButton />
        </div>
      </section>

      <div className="results-meta">
        <span>
          {t.found}: <strong>{filteredWallets.length}</strong>{" "}
          {language === "ru" ? "кошельков" : "wallets"}
        </span>
        <span className="results-period">
          {t.pnl} · {t[periodKey(period)]}
        </span>
      </div>

      {visibleWallets.length > 0 ? (
        <div className={`collection collection-${view}`}>
          {visibleWallets.map((wallet) => (
            <WalletCard
              key={wallet.address}
              period={period}
              view={view}
              wallet={wallet}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <SearchX size={21} strokeWidth={1.6} />
          </div>
          <h2>{t.noWalletsTitle}</h2>
          <p>{t.noWalletsText}</p>
          {query ? (
            <button
              className="button button-secondary"
              onClick={() => setQuery("")}
              type="button"
            >
              {t.resetSearch}
            </button>
          ) : null}
        </div>
      )}

      {hasMore ? (
        <div className="load-more-row">
          <button
            className="button button-secondary load-more"
            onClick={() => setVisibleCount((current) => current + 12)}
            type="button"
          >
            {t.showMore}
            <span>
              {filteredWallets.length - visibleWallets.length}
            </span>
          </button>
        </div>
      ) : null}
    </main>
  );
}
