import type { Section } from "@/lib/sections";
import Hero, { type HeroContent } from "./Hero";
import Stats, { type StatsContent } from "./Stats";
import PhotoText, { type PhotoTextContent } from "./PhotoText";
import Steps, { type StepsContent } from "./Steps";
import Voices, { type VoicesContent } from "./Voices";
import Partners, { type PartnersContent } from "./Partners";
import Cta, { type CtaContent } from "./Cta";

/**
 * Renders a list of sections by switching on `section.type`. Only the 7
 * block types proven out on home are handled; any other type (or a type not
 * yet supported anywhere) renders nothing rather than crashing — sections
 * needing extra fixed chrome (buttons, diagrams, progress bars) around them
 * should NOT be rendered through this generic switch; pull them out by
 * type/position in the page component instead and render them directly with
 * the block components below.
 */
export default function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </>
  );
}

export function SectionBlock({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return <Hero content={section.content as HeroContent} backgroundColor={section.background_color} />;
    case "stats":
      return <Stats content={section.content as StatsContent} backgroundColor={section.background_color} />;
    case "photo-text":
      return (
        <PhotoText
          content={section.content as PhotoTextContent}
          backgroundColor={section.background_color}
        />
      );
    case "steps":
      return <Steps content={section.content as StepsContent} />;
    case "voices":
      return <Voices content={section.content as VoicesContent} backgroundColor={section.background_color} />;
    case "partners":
      return <Partners content={section.content as PartnersContent} backgroundColor={section.background_color} />;
    case "cta":
      return <Cta content={section.content as CtaContent} backgroundColor={section.background_color} />;
    default:
      return null;
  }
}
