export type TeamMemberEntry = {
  name: string;
  title: string;
  text: string;
  photo_url: string;
  photo_alt?: string | null;
};

export type TeamMemberContent = {
  heading?: string | null;
  /** Background color applied to each card (independent of the section's
   * own background_color). */
  card_background_color?: string | null;
  members: TeamMemberEntry[];
};

/** Renders about page's ".team-grid" / ".team-card" structure. About page
 * pins this to a fixed 3-column grid via its own page-scoped override
 * (.page-about .team-grid); the base (unscoped) rule in shared.css uses
 * auto-fit so any other usage — with fewer or more members — fills the row
 * evenly and wraps responsively without JS. */
export default function TeamMember({ content }: { content: TeamMemberContent }) {
  const { heading, members, card_background_color } = content;

  return (
    <>
      {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
      <div className="team-grid">
        {members.map((member, i) => (
          <div
            className={`team-card reveal${i % 3 !== 0 ? ` d${i % 3}` : ""}`}
            key={i}
            style={card_background_color ? { background: card_background_color } : undefined}
          >
            <div className="team-photo">
              <img src={member.photo_url} alt={member.photo_alt ?? member.name} loading="lazy" />
            </div>
            <div className="team-info">
              <h3 className="team-name">{member.name}</h3>
              <span className="team-title-label">{member.title}</span>
              <p className="team-bio">{member.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
