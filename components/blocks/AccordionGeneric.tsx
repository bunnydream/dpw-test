"use client";

import { useState } from "react";

export type AccordionPanel = {
  header: string;
  content: string;
};

export type AccordionGenericContent = {
  heading?: string | null;
  panels: AccordionPanel[];
};

/**
 * Reusable accordion block — same visual design as Product's "Questions to
 * Ask Any Income Verification Vendor" (.vq-list/.vq-item/.vq-trigger/.vq-q/
 * .vq-chevron/.vq-panel/.vq-a). Unlike ProductVendorQuestions.tsx (which
 * relies on ProductAccordion.tsx's page-level DOM-manipulation wiring), this
 * component manages its own open/closed state with React so it works
 * standalone on any page, including custom pages with multiple accordion
 * blocks. All panels start closed; only one is open at a time.
 */
export default function AccordionGeneric({ content }: { content: AccordionGenericContent }) {
  const { heading, panels } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
      <div className="vq-list reveal d1">
        {panels.map((panel, i) => {
          const isOpen = openIndex === i;
          return (
            <div className="vq-item" key={i}>
              <button
                className="vq-trigger"
                aria-expanded={isOpen}
                aria-controls={`acc-panel-${i}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span className="vq-q">{panel.header}</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path d="M1 1L6.5 6.5L12 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id={`acc-panel-${i}`} hidden={!isOpen}>
                <p className="vq-a">{panel.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
