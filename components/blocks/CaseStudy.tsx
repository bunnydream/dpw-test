export type CaseStudyCard = {
  /** Small state/partner label above the heading, e.g. "Pennsylvania". Falls
   * back to a heading-derived guess (see below) when unset. */
  title?: string | null;
  heading: string;
  text: string;
  photo_url: string;
  photo_alt?: string | null;
  link?: string | null;
};

export type CaseStudyContent = {
  /** Not rendered by this component (it renders bare, no wrapper) — read by
   * the page's own heading above it (product's "In the field", impact's
   * "Deployed and delivering results"). */
  heading?: string | null;
  cards: CaseStudyCard[];
};

/**
 * Renders the ".case-grid" / ".case-card" structure used identically by
 * product's "In the field" section and impact's "Deployed and delivering
 * results" section. `case-state` (e.g. "Pennsylvania") comes from `card.title`
 * when set; otherwise it's derived from the first word of `heading` up to
 * " Department" (both current live cards follow that pattern), or the whole
 * heading if it doesn't contain " Department".
 */
export default function CaseStudy({ content }: { content: CaseStudyContent }) {
  const { cards } = content;

  return (
    <div className="case-grid">
      {cards.map((card, i) => {
        const state = card.title || (card.heading.includes(" Department") ? card.heading.split(" Department")[0] : card.heading);
        return (
          <a href={card.link || "#"} className={`case-card reveal d${(i % 3) + 1}`} key={i}>
            <div className="case-text">
              <span className="case-state">{state}</span>
              <h3>{card.heading}</h3>
              <p className="case-detail">{card.text}</p>
            </div>
            <div className="case-photo">
              <img src={card.photo_url} alt={card.photo_alt ?? ""} loading="lazy" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
