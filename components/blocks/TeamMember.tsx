export type TeamMemberEntry = {
  name: string;
  title: string;
  text: string;
  photo_url: string;
  photo_alt?: string | null;
};

export type TeamMemberContent = {
  members: TeamMemberEntry[];
};

/** Renders about page's ".team-grid" / ".team-card" structure. */
export default function TeamMember({ content }: { content: TeamMemberContent }) {
  const { members } = content;

  return (
    <div className="team-grid">
      {members.map((member, i) => (
        <div className={`team-card reveal${i % 3 !== 0 ? ` d${i % 3}` : ""}`} key={i}>
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
  );
}
