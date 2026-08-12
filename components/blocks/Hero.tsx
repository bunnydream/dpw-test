import Link from "next/link";

export type HeroButton = {
  text: string;
  link: string;
};

export type HeroContent = {
  headline: string;
  subtitle?: string | null;
  text?: string | null;
  footnote?: string | null;
  photo_url?: string | null;
  photo_alt?: string | null;
  button_primary?: HeroButton | null;
  button_secondary?: HeroButton | null;
};

function HeroButtonLink({
  button,
  className,
  style,
}: {
  button: HeroButton;
  className: string;
  style?: React.CSSProperties;
}) {
  if (button.link?.startsWith("/")) {
    return (
      <Link href={button.link} className={className} style={style}>
        {button.text}
      </Link>
    );
  }
  return (
    <a href={button.link} className={className} style={style}>
      {button.text}
    </a>
  );
}

type SubtitleLayout = "tagline-only" | "stack" | "stack-staggered";

export default function Hero({
  content,
  backgroundColor,
  subtitleMarginBottom = "28px",
  primaryButtonStyle,
  subtitleLayout = "tagline-only",
  imgWidth,
  imgHeight,
}: {
  content: HeroContent;
  backgroundColor?: string | null;
  /** margin-bottom on .hero-heading-stack when a subtitle is present — only used by
   * the "tagline-only" layout (about/careers pattern). Ignored otherwise. */
  subtitleMarginBottom?: string;
  /** optional inline style passed to the primary button link (e.g. product's live
   * markup has `style={{ marginTop: "8px" }}` on its "Request a Demo" button) */
  primaryButtonStyle?: React.CSSProperties;
  /**
   * The original static pages used three genuinely different DOM structures for
   * heading+subtitle — not just different class names, but different nesting —
   * so this picks which one to reproduce exactly:
   *
   * - "tagline-only" (default, about/careers): h1 lives OUTSIDE
   *   .hero-heading-stack; only the tagline <p> is wrapped, with an inline
   *   margin-bottom (subtitleMarginBottom). reveal sits on .hero-left.
   *
   * - "stack" (product): h1 AND tagline both live INSIDE .hero-heading-stack,
   *   with no reveal/stagger classes on the stack itself. This isn't just
   *   cosmetic — product.css's `.hero-tagline { max-width: 1px; min-width: 100% }`
   *   trick (which pins the tagline's width to h1's `white-space: nowrap` width)
   *   ONLY works when they're siblings inside the same container. Putting h1
   *   outside collapses the tagline to ~0 width. reveal sits on .hero-left;
   *   .hero-sub has no reveal class.
   *
   * - "stack-staggered" (impact): h1 + tagline both inside .hero-heading-stack,
   *   with `reveal` on the stack itself (not .hero-left) and `reveal d1` on
   *   .hero-sub — a different fade-in stagger, no layout difference.
   */
  subtitleLayout?: SubtitleLayout;
  imgWidth?: number;
  imgHeight?: number;
}) {
  const { headline, subtitle, text, footnote, photo_url, photo_alt, button_primary, button_secondary } = content;

  const heroLeftClass = subtitleLayout === "tagline-only" ? "hero-left reveal" : "hero-left";

  let headingBlock: React.ReactNode;
  if (subtitleLayout === "tagline-only") {
    headingBlock = (
      <>
        <h1>{headline}</h1>
        {subtitle ? (
          <div className="hero-heading-stack" style={{ marginBottom: subtitleMarginBottom }}>
            <p className="hero-tagline">{subtitle}</p>
          </div>
        ) : null}
      </>
    );
  } else if (subtitle) {
    headingBlock = (
      <div className={subtitleLayout === "stack-staggered" ? "hero-heading-stack reveal" : "hero-heading-stack"}>
        <h1>{headline}</h1>
        <p className="hero-tagline">{subtitle}</p>
      </div>
    );
  } else {
    headingBlock = <h1>{headline}</h1>;
  }

  return (
    <section className="hero" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className={heroLeftClass}>
        {headingBlock}

        {text ? (
          <p className={subtitleLayout === "stack-staggered" ? "hero-sub reveal d1" : "hero-sub"}>{text}</p>
        ) : null}

        {button_primary || button_secondary ? (
          <div className="hero-actions">
            {button_primary ? (
              <HeroButtonLink button={button_primary} className="btn btn-forge" style={primaryButtonStyle} />
            ) : null}
            {button_secondary ? <HeroButtonLink button={button_secondary} className="btn btn-outline" /> : null}
          </div>
        ) : null}

        {footnote ? (
          <p className="hero-note" style={{ fontSize: "15px" }}>
            {footnote}
          </p>
        ) : null}
      </div>

      {photo_url ? (
        <div className="hero-img reveal d2">
          <img src={photo_url} alt={photo_alt ?? ""} loading="eager" width={imgWidth ?? 900} height={imgHeight ?? 1125} />
        </div>
      ) : null}
    </section>
  );
}
