export type ProductCompareRow = {
  label: string;
  traditional: string;
  vmi: string;
};

export type ProductCompareTableContent = {
  heading: string;
  traditional_label: string;
  vmi_label: string;
  rows: ProductCompareRow[];
};

/** Product's "Traditional Approaches vs. VMI" full comparison table
 * (".compare-full", id="comparison"). Page-specific, non-reusable — a
 * different design from the generic reusable "Comparison table" block
 * (table.ct vs table.ct--split; this one has a 3rd label column and badge
 * icons in the header). */
export default function ProductCompareTable({
  content,
  backgroundColor,
}: {
  content: ProductCompareTableContent;
  backgroundColor?: string | null;
}) {
  const { heading, traditional_label, vmi_label, rows } = content;

  return (
    <section className="compare-full section-pad" id="comparison" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="section-inner">
        <h2 className="section-h reveal">{heading}</h2>
        <div className="ct-wrap reveal d1">
          <table className="ct" aria-label="Traditional approaches vs. VMI comparison">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">
                  <span className="ct-x-badge" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  {traditional_label}
                </th>
                <th scope="col" className="vmi-head">
                  <span className="ct-check-badge" aria-hidden="true">
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {vmi_label}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="ct-dim">{row.label}</td>
                  <td className="ct-them">{row.traditional}</td>
                  <td className="ct-vmi">{row.vmi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
