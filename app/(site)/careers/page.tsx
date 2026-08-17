import type { Metadata } from "next";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
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

type ContentCard = {
  heading: string;
  text: string;
  photo_url?: string | null;
};

type ContentCardsContent = {
  heading?: string | null;
  empty_text?: string | null;
  cards: ContentCard[];
};

const DEFAULT_EMPTY_TEXT =
  "Thank you for your interest in joining our team. We do not have any current job openings and are not accepting applications at this time. We encourage you to visit this page periodically for future opportunities.";

export default async function CareersPage() {
  const result = await getPageSections("careers");
  const sections = result?.sections ?? [];

  const hero = byType(sections, "hero")[0];
  const intro = byType(sections, "text")[0];
  const openings = byType(sections, "content-cards")[0];

  const introContent = intro?.content as TextContent | undefined;
  const openingsContent = openings?.content as ContentCardsContent | undefined;
  const cards = openingsContent?.cards ?? [];

  return (
    <div className="page-careers">
      {/* HERO */}
      {hero ? (
        <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} matchTaglineWidthToHeadline />
      ) : null}

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

      {/* OPEN POSITIONS */}
      <section className="openings section-pad">
        <div className="section-inner">
          <div className="openings-header reveal">
            <h2 className="openings-h">{openingsContent?.heading ?? "Open Positions"}</h2>
            <div className="openings-rule"></div>
          </div>
          {cards.length === 0 ? (
            <p className="openings-body reveal d1">{openingsContent?.empty_text ?? DEFAULT_EMPTY_TEXT}</p>
          ) : (
            <div className="content-card-grid">
              {cards.map((card, i) => (
                <div className="content-card reveal" key={i}>
                  <div className="content-card-body">
                    <h4>{card.heading}</h4>
                    <p>{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
