"use client";

import { Check, Clock3, Filter, SearchX, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  PeriodSelector,
  ReferenceButton,
  ViewToggle,
} from "@/components/controls";
import { DevCard } from "@/components/dev-card";
import {
  countActiveFilters,
  defaultDevFilters,
  FilterDialog,
} from "@/components/filter-dialog";
import { useFavorites } from "@/components/favorites-provider";
import { usePreferences } from "@/components/preferences-provider";
import { useUI } from "@/components/ui-provider";
import { devs, presetTags } from "@/lib/data";
import {
  formatInteger,
  formatMoney,
  interpolate,
  periodKey,
  presetKeys,
} from "@/lib/i18n";
import type { Dev, DevFilters, DevPreset, Period } from "@/lib/types";

const targetValues = [10000, 20000, 30000, 50000, 100000];

function matchesPreset(dev: Dev, preset: DevPreset | null) {
  return preset ? dev.presets.includes(preset) : true;
}

export default function DevsPage() {
  const { dictionary: t, language } = usePreferences();
  const { query, showToast } = useUI();
  const { addFavorite, isFavorite } = useFavorites();
  const [preset, setPreset] = useState<DevPreset | null>("strict");
  const [period, setPeriod] = useState<Period>(30);
  const [afterCutoff, setAfterCutoff] = useState(true);
  const [target, setTarget] = useState(20000);
  const [filters, setFilters] = useState<DevFilters>(defaultDevFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const normalizedQuery = query.trim().toLowerCase();

  const baseMatches = useMemo(() => {
    return devs.filter((dev) => {
      const stats = dev.periods[period];
      if (normalizedQuery) {
        const matchesQuery =
          dev.name.toLowerCase().includes(normalizedQuery) ||
          dev.address.toLowerCase().includes(normalizedQuery);
        if (!matchesQuery) return false;
      }
      if (afterCutoff && !dev.afterCutoff) return false;
      if (stats.peakMc < target) return false;
      if (stats.launches < filters.minLaunches) return false;
      if (stats.winRate < filters.minWinRate) return false;
      if (stats.launches > 0) {
        const rugRate = (stats.rugged / stats.launches) * 100;
        if (rugRate > filters.maxRugRate) return false;
      }
      return true;
    });
  }, [afterCutoff, filters, normalizedQuery, period, target]);

  const presetCounts = useMemo(() => {
    return presetTags.reduce<Record<DevPreset, number>>(
      (counts, currentPreset) => {
        counts[currentPreset] = baseMatches.filter((dev) =>
          dev.presets.includes(currentPreset),
        ).length;
        return counts;
      },
      { strict: 0, upside: 0, quick: 0, bundle: 0, devsell: 0 },
    );
  }, [baseMatches]);

  const filteredDevs = useMemo(
    () => baseMatches.filter((dev) => matchesPreset(dev, preset)),
    [baseMatches, preset],
  );

  useEffect(() => {
    setVisibleCount(12);
  }, [afterCutoff, filters, period, preset, query, target, view]);

  const getFilterResultCount = (draftFilters: DevFilters) => {
    return devs.filter((dev) => {
      const stats = dev.periods[period];
      if (normalizedQuery) {
        const matchesQuery =
          dev.name.toLowerCase().includes(normalizedQuery) ||
          dev.address.toLowerCase().includes(normalizedQuery);
        if (!matchesQuery) return false;
      }
      if (afterCutoff && !dev.afterCutoff) return false;
      if (stats.peakMc < target) return false;
      if (stats.launches < draftFilters.minLaunches) return false;
      if (stats.winRate < draftFilters.minWinRate) return false;
      if (stats.launches > 0) {
        const rugRate = (stats.rugged / stats.launches) * 100;
        if (rugRate > draftFilters.maxRugRate) return false;
      }
      return matchesPreset(dev, preset);
    }).length;
  };

  const visibleDevs = filteredDevs.slice(0, visibleCount);
  const activeFilterCount = countActiveFilters(filters);
  const hasMore = filteredDevs.length > visibleDevs.length;

  const toggleSelected = (address: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(address)) next.delete(address);
      else next.add(address);
      return next;
    });
  };

  const resetAll = () => {
    setPreset(null);
    setAfterCutoff(false);
    setTarget(10000);
    setFilters(defaultDevFilters);
  };

  const addSelectedToFavorites = () => {
    const newAddresses = Array.from(selected).filter(
      (address) => !isFavorite("dev", address),
    );
    newAddresses.forEach((address) => addFavorite("dev", address));

    if (newAddresses.length > 0) {
      showToast(
        interpolate(t.favoritesAdded, {
          n: newAddresses.length,
        }),
      );
    }

    setSelected(new Set());
    setSelecting(false);
  };

  return (
    <main className={`page ${selecting ? "page-selecting" : ""}`}>
      <section className="page-head page-head-devs">
        <h1>{t.whoseLaunches}</h1>

        <div className="toolbar-controls dev-controls">
          <PeriodSelector onChange={setPeriod} value={period} />
          <button
            aria-pressed={afterCutoff}
            className={`time-filter ${afterCutoff ? "active" : ""}`}
            onClick={() => setAfterCutoff((current) => !current)}
            type="button"
          >
            <Clock3 size={13} strokeWidth={1.9} />
            {t.afterUtc}
          </button>
          <div className="target-filter">
            <span>{t.target}</span>
            <div className="target-options" role="group">
              {targetValues.map((value) => (
                <button
                  aria-pressed={target === value}
                  className={`target-button ${target === value ? "active" : ""}`}
                  key={value}
                  onClick={() => setTarget(value)}
                  type="button"
                >
                  {formatMoney(value)}
                </button>
              ))}
            </div>
          </div>
          <ViewToggle onChange={setView} value={view} />
          <ReferenceButton />
        </div>
      </section>

      <section className="preset-toolbar">
        <div className="preset-list">
          {presetTags.map((item) => (
            <button
              aria-pressed={preset === item}
              className={`preset-button ${preset === item ? "active" : ""}`}
              key={item}
              onClick={() => setPreset((current) => (current === item ? null : item))}
              type="button"
            >
              {t[presetKeys[item]]}
              <span>{formatInteger(presetCounts[item], language)}</span>
            </button>
          ))}
        </div>

        <div className="preset-actions">
          <button
            className={`filter-button ${activeFilterCount > 0 ? "active" : ""}`}
            onClick={() => setFilterOpen(true)}
            type="button"
          >
            <Filter size={14} strokeWidth={1.8} />
            {t.filters}
            {activeFilterCount > 0 ? (
              <span className="filter-count">{activeFilterCount}</span>
            ) : null}
          </button>
          <button
            className={`choose-button ${selecting ? "active" : ""}`}
            onClick={() => {
              setSelecting((current) => !current);
              setSelected(new Set());
            }}
            type="button"
          >
            {selecting ? (
              <>
                <Check size={14} strokeWidth={2.2} />
                {t.done}
              </>
            ) : (
              t.choose
            )}
          </button>
        </div>
      </section>

      <div className="results-meta dev-results-meta">
        <span>
          {t.found}: <strong>{filteredDevs.length}</strong>{" "}
          {language === "ru" ? "девов" : "devs"}
        </span>
        <span className="results-period">
          {t.launches} · {t[periodKey(period)]}
        </span>
      </div>

      {visibleDevs.length > 0 ? (
        <div className={`collection collection-${view}`}>
          {visibleDevs.map((dev) => (
            <DevCard
              key={dev.address}
              dev={dev}
              onSelect={() => toggleSelected(dev.address)}
              period={period}
              selectable={selecting}
              selected={selected.has(dev.address)}
              view={view}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <SearchX size={21} strokeWidth={1.6} />
          </div>
          <h2>{t.noDevsTitle}</h2>
          <p>{t.noDevsText}</p>
          <button className="button button-secondary" onClick={resetAll} type="button">
            {t.clearFilters}
          </button>
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
            <span>{filteredDevs.length - visibleDevs.length}</span>
          </button>
        </div>
      ) : null}

      {selecting ? (
        <div className="selection-bar">
          <div className="selection-count">
            <span className="selection-mark">
              <Check size={13} strokeWidth={2.8} />
            </span>
            <strong>{selected.size}</strong>
            <span>{t.selected}</span>
          </div>
          <span className="selection-hint">{t.selectionHint}</span>
          <div className="selection-actions">
            <button
              className="button button-ghost compact"
              disabled={selected.size === 0}
              onClick={() => setSelected(new Set())}
              type="button"
            >
              {t.clear}
            </button>
            <button
              className="button button-primary compact"
              disabled={selected.size === 0}
              onClick={addSelectedToFavorites}
              type="button"
            >
              {t.addToFavorites}
            </button>
            <button
              aria-label={t.close}
              className="selection-close"
              onClick={() => {
                setSelecting(false);
                setSelected(new Set());
              }}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <FilterDialog
        filters={filters}
        getResultCount={getFilterResultCount}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
        open={filterOpen}
      />
    </main>
  );
}
