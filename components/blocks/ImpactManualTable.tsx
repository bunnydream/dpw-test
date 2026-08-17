export type ImpactManualTableRow = {
  manual: string;
  vmi: string;
};

export type ImpactManualTableContent = {
  manual_label: string;
  vmi_label: string;
  rows: ImpactManualTableRow[];
};

/** Impact's "Manual process vs. With Verify My Income" comparison widget
 * (".comp-card") — nested inside the "Families" section's right column,
 * after the heading/body text. Page-specific, non-reusable. Renders bare
 * (no section wrapper) since it's a sub-element of impact/page.tsx's
 * ".families-right" column, not its own section. */
export default function ImpactManualTable({ content }: { content: ImpactManualTableContent }) {
  const { manual_label, vmi_label, rows } = content;

  return (
    <div className="comp-card reveal d2">
      <div className="comp-header">
        <div className="comp-col-head comp-col-head--manual">
          <div className="comp-col-dot comp-col-dot--al"></div>
          {manual_label}
        </div>
        <div className="comp-col-head comp-col-head--vmi">
          <div className="comp-col-dot comp-col-dot--vg"></div>
          {vmi_label}
        </div>
      </div>

      {rows.map((row, i) => (
        <div className="comp-row" key={i}>
          <div className="comp-cell comp-cell--manual">
            <div className="comp-dot comp-dot--al"></div>
            <p>{row.manual}</p>
          </div>
          <div className="comp-cell comp-cell--vmi">
            <div className="comp-dot comp-dot--vg"></div>
            <p>{row.vmi}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
