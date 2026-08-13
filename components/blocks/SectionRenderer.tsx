import type { Section } from "@/lib/sections";
import Hero, { type HeroContent } from "./Hero";
import Stats, { type StatsContent } from "./Stats";
import PhotoText, { type PhotoTextContent } from "./PhotoText";
import Steps, { type StepsContent } from "./Steps";
import Voices, { type VoicesContent } from "./Voices";
import Partners, { type PartnersContent } from "./Partners";
import Cta, { type CtaContent } from "./Cta";
import TeamMember, { type TeamMemberContent } from "./TeamMember";
import CaseStudy, { type CaseStudyContent } from "./CaseStudy";
import Text, { type TextContent } from "./Text";
import ContentCards, { type ContentCardsContent } from "./ContentCards";
import Comparison, { type ComparisonContent } from "./Comparison";

/**
 * Renders a list of sections by switching on `section.type`, covering all 12
 * section types the schema supports. Used by the custom (admin-created)
 * page route, where every section is block-driven with no hardcoded chrome
 * around it — unlike the 6 original pages, which interleave these same block
 * components directly in JSX alongside fixed, unmodeled markup.
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
    case "team-member":
      return <TeamMember content={section.content as TeamMemberContent} />;
    case "case-study":
      return <CaseStudy content={section.content as CaseStudyContent} />;
    case "text":
      return <Text content={section.content as TextContent} />;
    case "content-cards":
      return <ContentCards content={section.content as ContentCardsContent} />;
    case "comparison":
      return <Comparison content={section.content as ComparisonContent} />;
    default:
      return null;
  }
}
