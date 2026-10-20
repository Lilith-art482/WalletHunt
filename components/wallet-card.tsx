"use client";

import { ArrowUpRight, Copy } from "lucide-react";
import type { ReactNode } from "react";
import {
  formatAddress,
  formatHold,
  formatInteger,
  formatLastSeen,
  formatMoney,
  formatPercent,
  periodKey,
  walletTagKeys,
} from "@/lib/i18n";
import type { Period, Wallet } from "@/lib/types";
import { Avatar, Sparkline, StarButton } from "./controls";
import { useFavorites } from "./favorites-provider";
import { usePreferences } from "./preferences-provider";
import { useUI } from "./ui-provider";

export function WalletCard({
  wallet,
  period,
  view = "grid",
  folderControl,
}: {
  wallet: Wallet;
  period: Period;
  view?: "grid" | "list";
  folderControl?: ReactNode;
}) {
  const { dictionary: t, language } = usePreferences();
  const { showToast } = useUI();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const saved = isFavorite("wallet", wallet.address);
  const stats = wallet.periods[period];

  const handleFavorite = () => {
    if (saved) {
      removeFavorite("wallet", wallet.address);
      showToast(t.walletRemoved);
      return;
    }

    addFavorite("wallet", wallet.address);
    showToast(t.walletSaved);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      showToast(t.addressCopied);
    } catch {
      showToast(t.copyAddress);
    }
  };

  return (
    <article className={`entity-card wallet-card card-${view}`}>
      <div className="card-identity">
        <div className="card-top">
          <Avatar hue={wallet.hue} name={wallet.name} />
          <div className="identity-copy">
            <div className="entity-name-line">
              <h3>{wallet.name}</h3>
              <span className="score-badge" title={t.tooltipsScore}>
                {wallet.score}
              </span>
            </div>
            <button
              className="address-button"
              onClick={handleCopy}
              title={t.copyAddress}
              type="button"
            >
              <span>{formatAddress(wallet.address)}</span>
              <Copy size={11} strokeWidth={1.8} />
            </button>
          </div>
          <StarButton
            label={saved ? t.removeFromFavorites : t.save}
            onClick={handleFavorite}
            saved={saved}
          />
        </div>

        <div className="tag-row card-tags">
          {wallet.tags.map((tag) => (
            <span className={`tag tag-${tag}`} key={tag}>
              {t[walletTagKeys[tag]]}
            </span>
          ))}
        </div>
      </div>

      <div className="card-data">
        <div className="card-performance">
          <div className="pnl-block">
            <span className="metric-label">
              {t.pnl} · {t[periodKey(period)]}
            </span>
            <strong className={`pnl-value ${stats.pnl >= 0 ? "positive" : "negative"}`}>
              {stats.pnl >= 0 ? "+" : ""}
              {formatMoney(stats.pnl)}
            </strong>
          </div>
          <Sparkline values={wallet.sparkline} />
        </div>

        <div className="metric-strip">
          <div className="mini-metric">
            <span>{t.winRate}</span>
            <strong>{formatPercent(stats.winRate)}</strong>
          </div>
          <div className="mini-metric">
            <span>{t.trades}</span>
            <strong>{formatInteger(stats.trades, language)}</strong>
          </div>
          <div className="mini-metric">
            <span>{t.avgHold}</span>
            <strong>{formatHold(stats.avgHoldMinutes, t)}</strong>
          </div>
        </div>
      </div>

      <footer className="card-footer">
        <span className="last-seen">
          <span className="activity-dot" />
          {formatLastSeen(wallet.lastActiveMinutes, t)}
        </span>
        <a
          className="text-link"
          href={`https://solscan.io/account/${wallet.address}`}
          onClick={(event) => event.stopPropagation()}
          rel="noreferrer"
          target="_blank"
        >
          Solscan
          <ArrowUpRight size={12} strokeWidth={1.8} />
        </a>
      </footer>

      {folderControl ? <div className="card-folder-row">{folderControl}</div> : null}
    </article>
  );
}
