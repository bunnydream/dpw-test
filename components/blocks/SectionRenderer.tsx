import type { Section } from "@/lib/sections";
import Hero, { type HeroContent } from "./Hero";
import Stats, { type StatsContent } from "./Stats";
import PhotoText, { type PhotoTextContent } from "./PhotoText";
import StepsGeneric, { type StepsGenericContent } from "./StepsGeneric";
import Voices, { type VoicesContent } from "./Voices";
import Partners, { type PartnersContent } from "./Partners";
import Cta, { type CtaContent } from "./Cta";
import TeamMember, { type TeamMemberContent } from "./TeamMember";
import CaseStudyGeneric, { type CaseStudyGenericContent } from "./CaseStudyGeneric";
import Text, { type TextContent } from "./Text";
import ContentCards, { type ContentCardsContent } from "./ContentCards";
import Comparison, { type ComparisonContent } from "./Comparison";
import IconCards, { type IconCardsContent } from "./IconCards";

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
      // Custom pages only — Home's real "How Verify My Income works" section
      // uses the original Steps.tsx (photo cards + scroll progress bar)
      // directly, not via this renderer. Never point this case at Steps.tsx.
      return <StepsGeneric content={section.content as StepsGenericContent} backgroundColor={section.background_color} />;
    case "voices":
      return <Voices content={section.content as VoicesContent} backgroundColor={section.background_color} />;
    case "partners":
      return <Partners content={section.content as PartnersContent} backgroundColor={section.background_color} />;
    case "cta":
      return <Cta content={section.content as CtaContent} backgroundColor={section.background_color} />;
    case "team-member":
      // TeamMember renders bare (no self-wrapper) so the 6 fixed pages can
      // wrap it in their own section chrome — the generic renderer supplies
      // the same section-pad/section-inner wrapper here.
      return (
        <div className="section-pad">
          <div className="section-inner">
            <TeamMember content={section.content as TeamMemberContent} />
          </div>
        </div>
      );
    case "case-study":
      // Custom pages only — Product's "In the field" and Impact's "Deployed
      // and delivering results" sections use the original CaseStudy.tsx
      // (.case-grid/.case-card) directly, not via this renderer. Never point
      // this case at CaseStudy.tsx.
      return (
        <CaseStudyGeneric content={section.content as CaseStudyGenericContent} backgroundColor={section.background_color} />
      );
    case "text":
      return <Text content={section.content as TextContent} backgroundColor={section.background_color} />;
    case "content-cards":
      return <ContentCards content={section.content as ContentCardsContent} backgroundColor={section.background_color} />;
    case "comparison":
      return <Comparison content={section.content as ComparisonContent} backgroundColor={section.background_color} />;
    case "icon-cards":
      return (
        <div className="section-pad" style={section.background_color ? { background: section.background_color } : undefined}>
          <div className="section-inner">
            <IconCards content={section.content as IconCardsContent} />
          </div>
        </div>
      );
    default:
      return null;
  }
}
