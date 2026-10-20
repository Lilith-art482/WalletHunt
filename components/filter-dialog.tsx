"use client";

import { useEffect, useState } from "react";
import type { DevFilters } from "@/lib/types";
import { Modal } from "./modal";
import { usePreferences } from "./preferences-provider";

export const defaultDevFilters: DevFilters = {
  minLaunches: 0,
  minWinRate: 0,
  maxRugRate: 100,
};

export function countActiveFilters(filters: DevFilters) {
  return [
    filters.minLaunches > 0,
    filters.minWinRate > 0,
    filters.maxRugRate < 100,
  ].filter(Boolean).length;
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: number; label: string }[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="filter-group">
      <span className="filter-group-label">{label}</span>
      <div className="filter-options">
        {options.map((option) => (
          <button
            aria-pressed={value === option.value}
            className={`filter-option ${value === option.value ? "active" : ""}`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FilterDialog({
  open,
  filters,
  onClose,
  onApply,
  getResultCount,
}: {
  open: boolean;
  filters: DevFilters;
  onClose: () => void;
  onApply: (filters: DevFilters) => void;
  getResultCount: (filters: DevFilters) => number;
}) {
  const { dictionary: t, language } = usePreferences();
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [filters, open]);

  return (
    <Modal
      footer={
        <div className="modal-actions">
          <button
            className="button button-ghost"
            onClick={() => setDraft(defaultDevFilters)}
            type="button"
          >
            {t.reset}
          </button>
          <button
            className="button button-primary"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            type="button"
          >
            {t.apply} · {getResultCount(draft)}
          </button>
        </div>
      }
      onClose={onClose}
      open={open}
      size="medium"
      subtitle={t.filterSubtitle}
      title={t.filterTitle}
    >
      <div className="filter-dialog-body">
        <FilterGroup
          label={t.minLaunches}
          onChange={(value) => setDraft((current) => ({ ...current, minLaunches: value }))}
          options={[
            { value: 0, label: t.any },
            { value: 3, label: "3+" },
            { value: 5, label: "5+" },
            { value: 10, label: "10+" },
          ]}
          value={draft.minLaunches}
        />
        <FilterGroup
          label={t.minWinRate}
          onChange={(value) => setDraft((current) => ({ ...current, minWinRate: value }))}
          options={[
            { value: 0, label: t.any },
            { value: 40, label: "40%" },
            { value: 50, label: "50%" },
            { value: 60, label: "60%" },
            { value: 70, label: "70%" },
          ]}
          value={draft.minWinRate}
        />
        <FilterGroup
          label={t.maxRugRate}
          onChange={(value) => setDraft((current) => ({ ...current, maxRugRate: value }))}
          options={[
            { value: 100, label: t.any },
            { value: 30, label: "30%" },
            { value: 20, label: "20%" },
            { value: 10, label: "10%" },
          ]}
          value={draft.maxRugRate}
        />
        <div className="filter-preview">
          <span>{language === "ru" ? "Подходит девов" : "Matching devs"}</span>
          <strong>{getResultCount(draft)}</strong>
        </div>
      </div>
    </Modal>
  );
}
