"use client";

import { BookOpen, Grid2X2, List, Star } from "lucide-react";
import type { CSSProperties } from "react";
import { formatInteger, periodKey } from "@/lib/i18n";
import type { Period } from "@/lib/types";
import { usePreferences } from "./preferences-provider";
import { useUI } from "./ui-provider";

export function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (period: Period) => void;
}) {
  const { dictionary: t } = usePreferences();

  return (
    <div aria-label="Period" className="period-selector" role="group">
      {([7, 14, 30] as Period[]).map((period) => (
        <button
          aria-pressed={value === period}
          className={`period-button ${value === period ? "active" : ""}`}
          key={period}
          onClick={() => onChange(period)}
          type="button"
        >
          {t[periodKey(period)]}
        </button>
      ))}
    </div>
  );
}

export function ViewToggle({
  value,
  onChange,
}: {
  value: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}) {
  const { dictionary: t } = usePreferences();

  return (
    <div className="view-toggle" role="group">
      <button
        aria-label={t.gridView}
        aria-pressed={value === "grid"}
        className={`view-button ${value === "grid" ? "active" : ""}`}
        onClick={() => onChange("grid")}
        title={t.gridView}
        type="button"
      >
        <Grid2X2 size={15} strokeWidth={1.7} />
      </button>
      <button
        aria-label={t.listView}
        aria-pressed={value === "list"}
        className={`view-button ${value === "list" ? "active" : ""}`}
        onClick={() => onChange("list")}
        title={t.listView}
        type="button"
      >
        <List size={16} strokeWidth={1.7} />
      </button>
    </div>
  );
}

export function ReferenceButton() {
  const { dictionary: t } = usePreferences();
  const { setGlossaryOpen } = useUI();

  return (
    <button
      className="reference-button"
      onClick={() => setGlossaryOpen(true)}
      type="button"
    >
      <BookOpen size={14} strokeWidth={1.7} />
      <span>{t.glossary}</span>
    </button>
  );
}

export function StarButton({
  saved,
  onClick,
  label,
}: {
  saved: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={saved}
      className={`star-button ${saved ? "saved" : ""}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      title={label}
      type="button"
    >
      <Star
        fill={saved ? "currentColor" : "none"}
        size={17}
        strokeWidth={1.55}
      />
    </button>
  );
}

export function Avatar({
  name,
  hue,
  size = 38,
  kind = "wallet",
}: {
  name: string;
  hue: number;
  size?: number;
  kind?: "wallet" | "dev";
}) {
  const initials = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`avatar avatar-${kind}`}
      style={
        {
          "--avatar-hue": hue,
          "--avatar-size": `${size}px`,
        } as CSSProperties
      }
    >
      {initials}
      {kind === "dev" ? <span className="avatar-dev-dot" /> : null}
    </span>
  );
}

export function Sparkline({
  values,
  height = 34,
  width = 104,
}: {
  values: number[];
  height?: number;
  width?: number;
}) {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const spread = Math.max(maximum - minimum, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - minimum) / spread) * (height - 5) - 2.5;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      aria-hidden="true"
      className="sparkline"
      height={height}
      preserveAspectRatio="none"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <polyline
        fill="none"
        points={points}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function ResultCount({
  count,
  label,
}: {
  count: number;
  label: string;
}) {
  const { language } = usePreferences();

  return (
    <div className="result-count">
      <span className="result-count-value">{formatInteger(count, language)}</span>
      <span>{label}</span>
    </div>
  );
}
