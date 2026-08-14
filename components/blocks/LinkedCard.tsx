/**
 * Single linked card — shared.css's .case-card system (used live by
 * Product's "In the field" and Impact's "Deployed and delivering results"
 * via the original CaseStudy.tsx, which renders this same markup inline
 * rather than importing this component, so it's untouched by this file).
 * This component is the single shared implementation for the two other
 * places that need an identical card: the admin "Linked card grid" block
 * (CaseStudyGeneric.tsx, custom pages) and the Insights post grid
 * (app/(site)/insights/page.tsx) — both render this instead of keeping
 * their own separate markup, so the two can never drift apart.
 */
export default function LinkedCard({
  label,
  heading,
  text,
  photoUrl,
  photoAlt,
  href,
  dataCat,
  className,
}: {
  /** Small uppercase copper label above the heading — a state name on
   * Product/Impact, a category on Insights. */
  label: string;
  heading: string;
  text?: string | null;
  photoUrl?: string | null;
  photoAlt?: string | null;
  href: string;
  /** Insights' category filter reads this off the card element. */
  dataCat?: string;
  className?: string;
}) {
  return (
    <a href={href} className={`case-card${className ? ` ${className}` : ""}`} data-cat={dataCat}>
      <div className="case-text">
        <span className="case-state">{label}</span>
        <h3>{heading}</h3>
        {text ? <p className="case-detail">{text}</p> : null}
      </div>
      {photoUrl ? (
        <div className="case-photo">
          <img src={photoUrl} alt={photoAlt ?? ""} loading="lazy" />
        </div>
      ) : (
        <div className="case-photo post-photo-placeholder"></div>
      )}
    </a>
  );
}
