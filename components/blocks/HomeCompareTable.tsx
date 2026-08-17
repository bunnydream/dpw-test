import Link from "next/link";

export type HomeCompareRow = {
  label: string;
  traditional: string;
  vmi: string;
};

export type HomeCompareTableContent = {
  heading: string;
  traditional_label: string;
  vmi_label: string;
  link_text: string;
  link: string;
  rows: HomeCompareRow[];
};

function CheckIcon() {
  return (
    <span className="ct-check" aria-hidden="true">
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
        <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** Home's "At a glance: how Verify My Income compares" teaser table. Page-
 * specific, non-reusable — never registered in block-types.ts's BLOCK_TYPES,
 * so it can't be added via "Add a block". Exact markup from home/page.tsx's
 * former hardcoded ".compare-teaser" section. */
export default function HomeCompareTable({
  content,
  backgroundColor,
}: {
  content: HomeCompareTableContent;
  backgroundColor?: string | null;
}) {
  const { heading, traditional_label, vmi_label, link_text, link, rows } = content;

  return (
    <section className="compare-teaser" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="compare-teaser-inner">
        <div className="ct-header reveal">
          <h2 style={{ fontSize: "clamp(28px, 3vw, 36px)" }}>{heading}</h2>
          {link.startsWith("/") ? (
            <Link href={link} className="btn btn-outline">
              {link_text}
            </Link>
          ) : (
            <a href={link} className="btn btn-outline">
              {link_text}
            </a>
          )}
        </div>
        <div className="ct-wrap reveal d1">
          <table className="ct" aria-label="VMI vs. traditional approaches comparison">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">{traditional_label}</th>
                <th scope="col" className="vmi-head">
                  {vmi_label}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="ct-dim">{row.label}</td>
                  <td className="ct-them">{row.traditional}</td>
                  <td className="ct-vmi">
                    <CheckIcon />
                    {row.vmi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
