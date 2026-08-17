export type IconCardIcon = "document" | "eye-slash" | "refresh" | "gift" | "trend-down" | "lock-open";

export type IconCard = {
  icon: IconCardIcon;
  /** Small uppercase label above the heading, e.g. "Finding 1" — optional,
   * used by home's "Stories" cards but not impact's "Funding model" cards. */
  label?: string | null;
  heading: string;
  text: string;
};

export type IconCardsContent = {
  heading?: string | null;
  text?: string | null;
  /** Trailing note rendered below the card grid, e.g. home's discovery-sprint paragraph. */
  footnote?: string | null;
  cards: IconCard[];
};

/** Exact SVG markup from home's "We do not just deliver data" cards
 * (24x24, strokeWidth 2) and impact's "Funding model" cards (28x28,
 * strokeWidth 1.6) — sizes intentionally differ per icon, matching each
 * icon's original page so switching to this shared component changes
 * nothing visually. */
function CardIcon({ icon }: { icon: IconCardIcon }) {
  switch (icon) {
    case "document":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "eye-slash":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      );
    case "refresh":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <polyline points="23 20 23 14 17 14" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
      );
    case "gift":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="22" height="4" rx="1" />
          <rect x="5" y="15" width="18" height="10" rx="1" />
          <line x1="14" y1="11" x2="14" y2="25" />
          <path d="M14 11C14 11 11 5 8 6C6 7 7 11 14 11Z" />
          <path d="M14 11C14 11 17 5 20 6C22 7 21 11 14 11Z" />
        </svg>
      );
    case "trend-down":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4,8 10,14 16,10 24,20" />
          <polyline points="19,20 24,20 24,15" />
        </svg>
      );
    case "lock-open":
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="13" width="18" height="13" rx="2" />
          <path d="M9 13V8C9 5.2 11.2 3 14 3C16.8 3 19 5.2 19 8V8" />
          <circle cx="14" cy="19" r="2" fill="none" />
          <line x1="14" y1="21" x2="14" y2="24" />
        </svg>
      );
  }
}

/**
 * "Icon cards" block — identical design to home's "We do not just deliver
 * data" findings grid and impact's "Funding model" grid (shared.css's
 * .content-card-grid/.content-card/.content-card-accent/.content-card-body/
 * .content-card-icon/.content-card-label). Renders bare (no section-pad/
 * section-inner wrapper) — home's ".stories"/".stories-inner" and impact's
 * ".funding section-pad"/".section-inner" chrome differ from each other and
 * from the generic wrapper, so each caller supplies its own, same pattern as
 * TeamMember.tsx. SectionRenderer.tsx (custom pages) supplies the generic
 * section-pad/section-inner wrapper itself.
 */
export default function IconCards({ content }: { content: IconCardsContent }) {
  const { heading, text, footnote, cards } = content;

  return (
    <>
      {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
      {text ? <p className="body-p reveal d1">{text}</p> : null}
      <div className="content-card-grid">
        {cards.map((card, i) => (
          <div className={`content-card reveal d${i + 1}`} key={i}>
            <div className="content-card-accent"></div>
            <div className="content-card-body">
              <div className="content-card-icon" aria-hidden="true">
                <CardIcon icon={card.icon} />
              </div>
              {card.label ? <span className="content-card-label">{card.label}</span> : null}
              <h4>{card.heading}</h4>
              <p>{card.text}</p>
            </div>
          </div>
        ))}
      </div>
      {footnote ? <p className="inline-note reveal d4">{footnote}</p> : null}
    </>
  );
}
