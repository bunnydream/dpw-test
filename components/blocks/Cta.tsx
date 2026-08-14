import Link from "next/link";
import type { ReactNode } from "react";

export type CtaContent = {
  heading: string;
  text?: string | null;
  button_text: string;
  link: string;
  background_photo_url: string;
};

/**
 * Fidelity note: the live home CTA heading is
 * `Ready to pilot <i>Verify My Income</i> in your jurisdiction? <br /> Let's talk.`
 * — an italicized product name plus a manual line break. The admin content
 * shape stores `heading` as a single plain string, so italics/<br/> markup
 * can't be represented without dangerouslySetInnerHTML (rejected per task
 * guidance). We accept that minor fidelity loss here: the dynamic heading
 * renders as plain text, no italics, no forced line break (it will still
 * wrap naturally at the container's max-width).
 */
export default function Cta({
  content,
  backgroundColor,
  children,
}: {
  content: CtaContent;
  backgroundColor?: string | null;
  /** fixed sub-line JSX rendered between the heading and the button (e.g.
   * home's "No procurement required..." line — that copy isn't part of the
   * cta content shape, so it's supplied by the caller instead of hardcoded
   * here, keeping this component free of home-only text). */
  children?: ReactNode;
}) {
  const { heading, text, button_text, link, background_photo_url } = content;

  return (
    <div
      className="cta-section"
      style={{
        backgroundImage: `url('${background_photo_url}')`,
        ...(backgroundColor ? { background: backgroundColor } : {}),
      }}
    >
      <div className="cta-inner">
        <h2 className="cta-h reveal">{heading}</h2>
        {text ? <p className="cta-sub reveal d1">{text}</p> : null}
        {children}
        {link.startsWith("/") ? (
          <Link href={link} className="btn btn-white reveal d2">
            {button_text}
          </Link>
        ) : (
          <a href={link} className="btn btn-white reveal d2">
            {button_text}
          </a>
        )}
      </div>
    </div>
  );
}
