export type ContentCard = {
  /** Small uppercase copper label above the heading, e.g. "Option 1" —
   * matches Product's "Built to fit your systems" cards. */
  title?: string | null;
  heading: string;
  text: string;
  photo_url?: string | null;
  photo_alt?: string | null;
};

export type ContentCardsContent = {
  heading?: string | null;
  text?: string | null;
  /** Background color applied to each card (independent of the section's
   * own background_color). */
  card_background_color?: string | null;
  cards: ContentCard[];
};

/**
 * "Card grid" block — identical design to Product's "Built to fit your
 * systems" (shared.css's .io-grid/.io-card/.io-top/.io-body/.io-pill,
 * reused directly). Wrapped in .io-grid.io-grid--auto for the up-to-3-per-
 * row, fill-if-fewer sizing shared with the Linked card grid block. Used
 * ONLY by SectionRenderer.tsx for custom (admin-created) pages — Product's
 * real "Built to fit your systems" section keeps its own hardcoded JSX with
 * the fixed 3-column .io-grid, untouched by this file.
 */
export default function ContentCards({
  content,
  backgroundColor,
}: {
  content: ContentCardsContent;
  backgroundColor?: string | null;
}) {
  const { heading, text, cards, card_background_color } = content;

  return (
    <div className="section-pad" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="section-inner">
        {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
        {text ? <p className="body-p reveal d1">{text}</p> : null}
        <div className="io-grid io-grid--auto">
          {cards.map((card, i) => (
            <div
              className="io-card reveal"
              key={i}
              style={card_background_color ? { background: card_background_color } : undefined}
            >
              {card.photo_url ? (
                <div className="io-top">
                  <img src={card.photo_url} alt={card.photo_alt ?? ""} loading="lazy" />
                </div>
              ) : null}
              <div className="io-body">
                {card.title ? <span className="io-pill">{card.title}</span> : null}
                <h3>{card.heading}</h3>
                <p className="io-desc">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
