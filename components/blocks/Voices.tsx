import VoicesCarousel from "@/components/VoicesCarousel";

export type Quote = {
  quote: string;
  name: string;
  role: string;
};

export type VoicesContent = {
  heading: string;
  quotes: Quote[];
};

export default function Voices({
  content,
  backgroundColor,
}: {
  content: VoicesContent;
  backgroundColor?: string | null;
}) {
  const { heading, quotes } = content;

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
      />
    </section>
  );
}
