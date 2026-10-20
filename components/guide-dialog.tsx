"use client";

import { Download, Search, SlidersHorizontal, Star, Wallet } from "lucide-react";
import { Modal } from "./modal";
import { usePreferences } from "./preferences-provider";
import { useUI } from "./ui-provider";

export function GuideDialog() {
  const { dictionary: t } = usePreferences();
  const { guideOpen, setGuideOpen } = useUI();

  const steps = [
    {
      icon: Wallet,
      title: t.guideStep1Title,
      text: t.guideStep1Text,
    },
    {
      icon: SlidersHorizontal,
      title: t.guideStep2Title,
      text: t.guideStep2Text,
    },
    {
      icon: Star,
      title: t.guideStep3Title,
      text: t.guideStep3Text,
    },
    {
      icon: Download,
      title: t.guideStep4Title,
      text: t.guideStep4Text,
    },
  ];

  return (
    <Modal
      className="guide-modal"
      footer={
        <button
          className="button button-primary"
          onClick={() => setGuideOpen(false)}
          type="button"
        >
          {t.gotIt}
        </button>
      }
      onClose={() => setGuideOpen(false)}
      open={guideOpen}
      size="large"
      subtitle={t.guideIntro}
      title={t.guideTitle}
    >
      <div className="guide-steps">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article className="guide-step" key={step.title}>
              <div className="guide-step-icon">
                <Icon size={18} strokeWidth={1.7} />
              </div>
              <div>
                <span className="guide-step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="guide-shortcut">
        <Search size={15} />
        <span>{t.guideFooter}</span>
        <kbd>/</kbd>
      </div>
    </Modal>
  );
}
