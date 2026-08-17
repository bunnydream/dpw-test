import Link from "next/link";

export type ProductTalkCtaContent = {
  heading: string;
  subtext: string;
  link: string;
};

/** Product's small "Bring VMI to your state" CTA banner (".talk-cta").
 * Page-specific, non-reusable. Fidelity note: the live heading is
 * `Bring <i>VMI</i> to your state →` — italics can't be represented in a
 * plain content.heading field (same accepted tradeoff as Cta.tsx), so the
 * dynamic heading renders as plain text. */
export default function ProductTalkCta({
  content,
  backgroundColor,
}: {
  content: ProductTalkCtaContent;
  backgroundColor?: string | null;
}) {
  const { heading, subtext, link } = content;

  return (
    <div className="talk-cta" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <svg
        className="talk-cta-lines"
        aria-hidden="true"
        preserveAspectRatio="none"
        viewBox="0 0 1440 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="0" x2="120" y2="160" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" />
        <line x1="40" y1="0" x2="160" y2="160" stroke="rgba(255,255,255,0.10)" strokeWidth="3.5" />
        <line x1="1320" y1="0" x2="1440" y2="160" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" />
        <line x1="1280" y1="0" x2="1400" y2="160" stroke="rgba(255,255,255,0.10)" strokeWidth="3.5" />
      </svg>
      <div className="talk-cta-inner">
        {link.startsWith("/") ? (
          <Link href={link} className="talk-cta-heading">
            {heading}
          </Link>
        ) : (
          <a href={link} className="talk-cta-heading">
            {heading}
          </a>
        )}
        <p className="talk-cta-sub">{subtext}</p>
      </div>
    </div>
  );
}
