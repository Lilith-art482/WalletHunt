"use client";

import { ArrowUpRight, Check, Clock3 } from "lucide-react";
import type { ReactNode } from "react";
import {
  formatAddress,
  formatCompactNumber,
  formatDevLaunch,
  formatMultiple,
  formatPercent,
  periodKey,
  devTagKeys,
} from "@/lib/i18n";
import type { Dev, Period } from "@/lib/types";
import { Avatar, StarButton } from "./controls";
import { useFavorites } from "./favorites-provider";
import { usePreferences } from "./preferences-provider";
import { useUI } from "./ui-provider";

export function DevCard({
  dev,
  period,
  view = "grid",
  selectable = false,
  selected = false,
  onSelect,
  folderControl,
}: {
  dev: Dev;
  period: Period;
  view?: "grid" | "list";
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  folderControl?: ReactNode;
}) {
  const { dictionary: t, language } = usePreferences();
  const { showToast } = useUI();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const saved = isFavorite("dev", dev.address);
  const stats = dev.periods[period];

  const handleFavorite = () => {
    if (saved) {
      removeFavorite("dev", dev.address);
      showToast(t.devRemoved);
      return;
    }

    addFavorite("dev", dev.address);
    showToast(t.devSaved);
  };

  return (
    <article
      aria-selected={selectable ? selected : undefined}
      className={`entity-card dev-card card-${view} ${selected ? "is-selected" : ""} ${
        selectable ? "is-selectable" : ""
      }`}
      onClick={selectable ? onSelect : undefined}
    >
      <div className="card-identity">
        <div className="card-top">
          <Avatar hue={dev.hue} kind="dev" name={dev.name} />
          <div className="identity-copy">
            <div className="entity-name-line">
              <h3>@{dev.name}</h3>
            </div>
            <button
              className="address-button"
              onClick={async (event) => {
                event.stopPropagation();
                try {
                  await navigator.clipboard.writeText(dev.address);
                  showToast(t.addressCopied);
                } catch {
                  showToast(t.copyAddress);
                }
              }}
              title={t.copyAddress}
              type="button"
            >
              <span>{formatAddress(dev.address)}</span>
            </button>
          </div>
          {selectable ? (
            <button
              aria-label={selected ? t.removeFromFavorites : t.choose}
              aria-pressed={selected}
              className={`select-check ${selected ? "checked" : ""}`}
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.();
              }}
              type="button"
            >
              {selected ? <Check size={14} strokeWidth={2.6} /> : null}
            </button>
          ) : (
            <StarButton
              label={saved ? t.removeFromFavorites : t.save}
              onClick={handleFavorite}
              saved={saved}
            />
          )}
        </div>

        <div className="tag-row card-tags">
          {dev.tags.slice(0, 4).map((tag) => (
            <span className={`tag tag-${tag}`} key={tag}>
              {t[devTagKeys[tag]]}
            </span>
          ))}
          {dev.afterCutoff ? (
            <span className="tag tag-time">
              <Clock3 size={10} strokeWidth={2} />
              {t.todayAfterCutoff}
            </span>
          ) : null}
        </div>
      </div>

      <div className="card-data">
        <div className="metric-strip dev-metrics">
          <div className="mini-metric">
            <span>{t.launches}</span>
            <strong>{stats.launches}</strong>
          </div>
          <div className="mini-metric">
            <span>{t.successRate}</span>
            <strong>{formatPercent(stats.winRate)}</strong>
          </div>
          <div className="mini-metric">
            <span>{t.bestMultiple}</span>
            <strong className="gold">{formatMultiple(stats.bestMultiple)}</strong>
          </div>
          <div className="mini-metric">
            <span>{t.peakMc}</span>
            <strong>${formatCompactNumber(stats.peakMc)}</strong>
          </div>
        </div>
      </div>

      <footer className="card-footer">
        <span className="last-seen">
          {t.lastLaunch}: {formatDevLaunch(dev.lastLaunchDaysAgo, t)}
        </span>
        <div className="footer-actions">
          <span className="period-caption">{t[periodKey(period)]}</span>
          <a
            className="text-link"
            href={`https://solscan.io/account/${dev.address}`}
            onClick={(event) => event.stopPropagation()}
            rel="noreferrer"
            target="_blank"
          >
            Solscan
            <ArrowUpRight size={12} strokeWidth={1.8} />
          </a>
        </div>
      </footer>

      {folderControl ? <div className="card-folder-row">{folderControl}</div> : null}
    </article>
  );
}
