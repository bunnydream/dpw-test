import type { Metadata } from "next";
import { getPageSections, makeExtrasSlotter, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import SectionRenderer from "@/components/blocks/SectionRenderer";
import "./careers.css";

export const metadata: Metadata = {
  title: "Careers — Digital Public Works",
};

function byType(sections: Section[], type: Section["type"]) {
  return sections.filter((s) => s.type === type);
}

type TextContent = {
  heading?: string | null;
  text: string;
};

const DEFAULT_OPENINGS: TextContent = {
  heading: "Open Positions",
  text:
    "Thank you for your interest in joining our team. We do not have any current job openings and are not accepting applications at this time. We encourage you to visit this page periodically for future opportunities.",
};

export default async function CareersPage() {
  const result = await getPageSections("careers");
  const sections = result?.sections ?? [];

  const hero = byType(sections, "hero")[0];
  const textSections = byType(sections, "text");
  const intro = textSections[0];
  const openings = textSections[1];

  const introContent = intro?.content as TextContent | undefined;
  const openingsContent = (openings?.content as TextContent | undefined) ?? DEFAULT_OPENINGS;

  const consumedIds = new Set([hero, intro, openings].filter((s): s is Section => !!s).map((s) => s.id));
  const extraSections = sections.filter((s) => !consumedIds.has(s.id));
  const slot = makeExtrasSlotter(extraSections);

  return (
    <div className="page-careers">
      <SectionRenderer sections={slot(hero?.position ?? 0)} />
      {/* HERO */}
      {hero ? (
        <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} matchTaglineWidthToHeadline />
      ) : null}

      <SectionRenderer sections={slot(intro?.position ?? Infinity)} />
      {/* INTRO */}
      {introContent ? (
        <section className="intro section-pad">
          <div className="section-inner">
            <p
              className="body-text reveal"
              style={{ fontSize: "var(--t-body)", lineHeight: 1.82, color: "var(--steel)", maxWidth: "72ch" }}
            >
              {introContent.text}
            </p>
          </div>
        </section>
      ) : null}

      <SectionRenderer sections={slot(openings?.position ?? Infinity)} />
      {/* OPEN POSITIONS */}
      <section
        className="openings section-pad"
        style={openings?.background_color ? { background: openings.background_color } : undefined}
      >
        <div className="section-inner">
          <div className="openings-header reveal">
            <h2 className="openings-h">{openingsContent.heading}</h2>
            <div className="openings-rule"></div>
          </div>
          <p className="openings-body reveal d1">{openingsContent.text}</p>
        </div>
      </section>

      {/* Any remaining new blocks added via "Add a block" */}
      <SectionRenderer sections={slot(Infinity)} />
    </div>
  );
}
