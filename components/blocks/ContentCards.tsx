export type ContentCard = {
  heading: string;
  text: string;
  photo_url?: string | null;
};

export type ContentCardsContent = {
  heading?: string | null;
  text?: string | null;
  cards: ContentCard[];
};

export default function ContentCards({ content }: { content: ContentCardsContent }) {
  const { heading, text, cards } = content;

  return (
    <div className="section-pad">
      <div className="section-inner">
        {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
        {text ? <p className="block-content-cards-intro reveal">{text}</p> : null}
        <div className="block-content-card-grid">
          {cards.map((card, i) => (
            <div className={`block-content-card reveal${i % 3 !== 0 ? ` d${i % 3}` : ""}`} key={i}>
              {card.photo_url ? (
                <div className="block-content-card-photo">
                  <img src={card.photo_url} alt="" loading="lazy" />
                </div>
              ) : null}
              <h3>{card.heading}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
