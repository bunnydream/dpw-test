import Link from "next/link";

export type ImpactYearInReviewContent = {
  heading: string;
  text: string;
  button_text: string;
  link: string;
};

/** Impact's "Year in review" section (".annual", id="annual-report").
 * Page-specific, non-reusable. The decorative "report-book" visual and its
 * "Annual Report" label are fixed design chrome, not editable copy. */
export default function ImpactYearInReview({ content }: { content: ImpactYearInReviewContent }) {
  const { heading, text, button_text, link } = content;

  return (
    <section className="annual section-pad" id="annual-report">
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

        <div className="annual-visual reveal d2">
          <div className="report-book">
            <span>Annual Report</span>
          </div>
        </div>
      </div>
    </section>
  );
}
