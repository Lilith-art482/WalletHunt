"use client";

import { Modal } from "./modal";
import { usePreferences } from "./preferences-provider";
import { useUI } from "./ui-provider";

export function GlossaryDialog() {
  const { dictionary: t } = usePreferences();
  const { glossaryOpen, setGlossaryOpen } = useUI();

  const entries = [
    { term: "PnL", description: t.glossaryPnl },
    { term: t.winRate, description: t.glossaryWinRate },
    { term: "Score", description: t.glossaryScore },
    { term: "Strict", description: t.glossaryStrict },
    { term: t.tagUpside, description: t.glossaryUpside },
    { term: t.tagQuick, description: t.glossaryQuick },
    { term: t.tagBundle, description: t.glossaryBundle },
    { term: "Dev sell", description: t.glossaryDevSell },
    { term: t.target, description: t.glossaryTarget },
    { term: "06:06 UTC", description: t.glossaryTime },
  ];

  return (
    <Modal
      className="glossary-modal"
      onClose={() => setGlossaryOpen(false)}
      open={glossaryOpen}
      size="large"
      subtitle={t.glossarySubtitle}
      title={t.glossaryTitle}
    >
      <div className="glossary-grid">
        {entries.map((entry) => (
          <article className="glossary-entry" key={entry.term}>
            <h3>{entry.term}</h3>
            <p>{entry.description}</p>
          </article>
        ))}
      </div>
    </Modal>
  );
}
