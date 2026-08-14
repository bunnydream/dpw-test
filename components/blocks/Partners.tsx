export type Partner = {
  /** No longer editable in the admin — kept optional for pre-existing data. */
  name?: string;
  logo_url: string;
  link: string;
  visible?: boolean;
  /** renders the "pending" visual variant (adds "funder-pending" to the card's className) */
  pending?: boolean;
};

export type PartnersContent = {
  heading: string;
  partners: Partner[];
};

export default function Partners({
  content,
  backgroundColor,
}: {
  content: PartnersContent;
  backgroundColor?: string | null;
}) {
  const { heading, partners } = content;
  const visiblePartners = partners.filter((p) => p.visible !== false);

  return (
    <section
      className="funders section-pad"
      style={backgroundColor ? { background: backgroundColor } : undefined}
    >
      <div className="section-inner">
        <div className="funders-header reveal">
          <h2 className="funders-h">{heading}</h2>
          <div className="funders-rule"></div>
        </div>
        <div className="funder-grid reveal d1">
          {visiblePartners.map((partner, i) => (
            <a
              href={partner.link}
              className={`funder-card${partner.pending ? " funder-pending" : ""}`}
              target="_blank"
              rel="noopener"
              key={i}
            >
              <div className="funder-logo-area">
                <img src={partner.logo_url} alt={partner.name} className="funder-logo-img" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
