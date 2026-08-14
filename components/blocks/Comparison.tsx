export type ComparisonRow = {
  heading: string;
  text: string;
};

export type ComparisonContent = {
  heading?: string | null;
  column_a_title: string;
  column_b_title: string;
  rows: ComparisonRow[];
};

/** Reuses the same table.ct styling as the product page's "Traditional
 * Approaches vs. VMI" comparison (shared.css) — each row's heading fills the
 * first column, text fills the second. */
export default function Comparison({ content }: { content: ComparisonContent }) {
  const { heading, column_a_title, column_b_title, rows } = content;

  return (
    <div className="section-pad">
      <div className="section-inner">
        {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
        <div className="ct-wrap reveal">
          <table className="ct ct--split" aria-label={`${column_a_title} vs. ${column_b_title} comparison`}>
            <thead>
              <tr>
                <th scope="col">{column_a_title}</th>
                <th scope="col" className="vmi-head">
                  {column_b_title}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="ct-them">{row.heading}</td>
                  <td className="ct-vmi">{row.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
