import Link from "next/link";

export type ImpactYearInReviewContent = {
  heading: string;
  text: string;
  button_text: string;
  link: string;
  /** Report cover image shown inside the ".report-book" frame. Falls back to
   * a plain "Annual Report" text placeholder when unset. */
  photo_url?: string | null;
  photo_alt?: string | null;
};

/** Impact's "Year in review" section (".annual", id="annual-report").
 * Page-specific, non-reusable. */
export default function ImpactYearInReview({
  content,
  backgroundColor,
}: {
  content: ImpactYearInReviewContent;
  backgroundColor?: string | null;
}) {
  const { heading, text, button_text, link, photo_url, photo_alt } = content;

  return (
    <section className="annual section-pad" id="annual-report" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="section-inner annual-inner">
        <div>
          <h2 className="section-h reveal">{heading}</h2>
          <p className="body-p reveal d1">{text}</p>
          {link.startsWith("/") ? (
            <Link href={link} className="btn btn-forge reveal d2">
              {button_text} <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <a href={link} className="btn btn-forge reveal d2">
              {button_text} <span aria-hidden="true">→</span>
            </a>
          )}
        </div>

        {photo_url ? (
          <div className="annual-visual reveal d2">
            <div className="report-book">
              <img
                src={photo_url}
                alt={photo_alt ?? "Annual report cover"}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "3px" }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
