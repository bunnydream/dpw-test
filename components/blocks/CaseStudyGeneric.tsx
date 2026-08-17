import LinkedCard from "./LinkedCard";

export type CaseStudyGenericCard = {
  /** Small uppercase copper label above the heading, e.g. a state name —
   * matches Product's "In the field" cards. */
  title?: string | null;
  heading: string;
  text: string;
  photo_url?: string | null;
  photo_alt?: string | null;
  link?: string | null;
};

export type CaseStudyGenericContent = {
  heading?: string | null;
  text?: string | null;
  pullquote?: string | null;
  footnote?: string | null;
  callout_number?: string | null;
  callout_text?: string | null;
  /** Background color applied to each card (independent of the section's
   * own background_color). */
  card_background_color?: string | null;
  cards: CaseStudyGenericCard[];
};

/**
 * "Linked card grid" block — identical design to Product's "In the field" /
 * Impact's "Deployed and delivering results" (shared.css's .case-card,
 * via LinkedCard.tsx) and to the Insights post grid, which renders the same
 * component. Wrapped in .io-grid.io-grid--auto for the up-to-3-per-row,
 * fill-if-fewer sizing shared with the Card grid block. Used ONLY by
 * SectionRenderer.tsx for custom (admin-created) pages — NEVER import this
 * on a fixed page. Product/Impact's real sections use the original
 * CaseStudy.tsx directly and must keep doing so.
 */
export default function CaseStudyGeneric({
  content,
  backgroundColor,
}: {
  content: CaseStudyGenericContent;
  backgroundColor?: string | null;
}) {
  const { heading, text, pullquote, footnote, callout_number, callout_text, cards, card_background_color } = content;

  return (
    <div className="section-pad" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="section-inner">
        {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
        {text ? <p className="body-p reveal d1">{text}</p> : null}
        <div className="io-grid io-grid--auto">
          {cards.map((card, i) => (
            <LinkedCard
              key={i}
              href={card.link || "#"}
              label={card.title ?? ""}
              heading={card.heading}
              text={card.text}
              photoUrl={card.photo_url}
              photoAlt={card.photo_alt}
              className="reveal"
              backgroundColor={card_background_color}
            />
          ))}
        </div>
        {pullquote ? (
          <div className="pullquote reveal">
            <p className="pq-text">{pullquote}</p>
          </div>
        ) : null}
        {callout_number || callout_text ? (
          <div className="callout-stat reveal">
            <span className="callout-stat-num">{callout_number}</span>
            <p className="callout-stat-text">{callout_text}</p>
          </div>
        ) : null}
        {footnote ? <p className="inline-note reveal">{footnote}</p> : null}
      </div>
    </div>
  );
}
