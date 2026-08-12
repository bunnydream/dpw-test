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
}: {
  content: StatsContent;
  backgroundColor?: string | null;
}) {
  const { heading, stats } = content;

  return (
    <div
      className="stat-row"
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
