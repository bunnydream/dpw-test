import VoicesCarousel from "@/components/VoicesCarousel";

export type Quote = {
  quote: string;
  name: string;
  role: string;
};

export type VoicesContent = {
  heading: string;
  /** Background color applied to each quote card (independent of the
   * section's own background_color). */
  card_background_color?: string | null;
  quotes: Quote[];
};

export default function Voices({
  content,
  backgroundColor,
}: {
  content: VoicesContent;
  backgroundColor?: string | null;
}) {
  const { heading, quotes, card_background_color } = content;

  return (
    <section className="voices" id="voices" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="voices-inner">
        <h2 className="section-h reveal">{heading}</h2>
      </div>

      <VoicesCarousel
        voices={quotes.map((q) => ({
          text: q.quote,
          attr: q.role ? `${q.name}, ${q.role}` : q.name,
        }))}
        cardBackgroundColor={card_background_color}
      />
    </section>
  );
}
