export type Stat = {
  number: string;
  label: string;
};

export type StatsContent = {
  heading?: string | null;
  stats: Stat[];
};

const STAGGER_CLASSES = ["", "d1", "d2", "d3"];

export default function Stats({
  content,
  backgroundColor,
  variant,
}: {
  content: StatsContent;
  backgroundColor?: string | null;
  /** "auto" makes the grid reflow to fit however many stats are present
   * instead of assuming a fixed column count — used only where a stat row
   * can be added with an arbitrary number of stats (SectionRenderer's
   * "extras" fallback on any page). Home's real "Impact numbers" section
   * always has exactly 4 stats by design, so it omits this and keeps the
   * page's own fixed-column CSS. */
  variant?: "auto";
}) {
  const { heading, stats } = content;

  return (
    <div
      className={variant === "auto" ? "stat-row stat-row--auto" : "stat-row"}
      role="list"
      aria-label="Key statistics"
      style={backgroundColor ? { background: backgroundColor } : undefined}
    >
      {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
      {stats.map((stat, i) => (
        <div
          className={`stat-cell reveal${STAGGER_CLASSES[i] ? ` ${STAGGER_CLASSES[i]}` : ""}`}
          role="listitem"
          key={i}
        >
          <span className="stat-num">{stat.number}</span>
          <p className="stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
