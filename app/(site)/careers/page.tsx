import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import SectionRenderer from "@/components/blocks/SectionRenderer";
import { getSeoSettings } from "@/lib/site-settings";
import { resolveMetadata } from "@/lib/seo";
import "./careers.css";

export async function generateMetadata(): Promise<Metadata> {
  const [result, siteSeo] = await Promise.all([getPageSections("careers"), getSeoSettings()]);
  return resolveMetadata({ item: result?.page ?? null, fallbackTitle: "Careers", path: "/careers", siteSeo });
}

function byType(sections: Section[], type: Section["type"], opts?: { includeHidden?: boolean }) {
  return sections.filter((s) => s.type === type && (opts?.includeHidden || !s.hidden));
}

// Matches sections of `type` to `names` by exact `name`, in order — pins
// each fixed-role slot to the specific row it was created for, so a later
// same-type block (added via "Add a new block", which always gets a
// generic "New <type>" name — see starterName() in block-types.ts) can't
// silently take over the slot. Any name with no match falls back to the
// next remaining same-type row by position, matching today's behavior.
function pickByName(sections: Section[], type: Section["type"], names: string[]) {
  const candidates = byType(sections, type, { includeHidden: true }); // must see hidden rows to name-match them
  const claimed = new Set<string>();
  const picks = names.map((name) => {
    const match = candidates.find((s) => s.name === name && !claimed.has(s.id));
    if (match) claimed.add(match.id);
    return match;
  });
  const remaining = candidates.filter((s) => !claimed.has(s.id) && !s.hidden);
  let i = 0;
  // A hidden section still claims its slot when matched by exact name (so a
  // same-type admin block can't steal it via the fallback above), but must
  // render as absent — same as the admin's hide/show toggle everywhere else.
  return picks.map((p) => p ?? remaining[i++]).map((s) => (s?.hidden ? undefined : s));
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

  const hero = pickByName(sections, "hero", ["Join Digital Public Works"])[0];
  const intro = byType(sections, "careers-intro")[0];
  const openings = byType(sections, "careers-openings")[0];

  const introContent = intro?.content as TextContent | undefined;
  const openingsContent = (openings?.content as TextContent | undefined) ?? DEFAULT_OPENINGS;

  const consumedIds = new Set([hero, intro, openings].filter((s): s is Section => !!s).map((s) => s.id));
  const extraSections = sections.filter((s) => !consumedIds.has(s.id) && !s.hidden);

  // Rank used as a section's sort position only when its DB row doesn't
  // exist yet — reproduces today's fixed order for freshly-seeded pages.
  const RANK = { hero: 0, intro: 1, openings: 2 };

  type Block = { key: string; position: number; node: ReactNode };

  const blocks: Block[] = [
    {
      key: hero?.id ?? "hero",
      position: hero?.position ?? RANK.hero,
      node: hero ? (
        <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} matchTaglineWidthToHeadline isPageHero />
      ) : null,
    },
    {
      key: intro?.id ?? "intro",
      position: intro?.position ?? RANK.intro,
      node: introContent ? (
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
      ) : null,
    },
    {
      key: openings?.id ?? "openings",
      position: openings?.position ?? RANK.openings,
      node: openings ? (
        <section
          className="openings section-pad"
          style={openings.background_color ? { background: openings.background_color } : undefined}
        >
          <div className="section-inner">
            <div className="openings-header reveal">
              <h2 className="openings-h">{openingsContent.heading}</h2>
              <div className="openings-rule"></div>
            </div>
            <p className="openings-body reveal d1">{openingsContent.text}</p>
          </div>
        </section>
      ) : null,
    },
    ...extraSections.map((section) => ({
      key: section.id,
      position: section.position,
      node: <SectionRenderer sections={[section]} />,
    })),
  ];

  blocks.sort((a, b) => a.position - b.position);

  return (
    <div className="page-careers">
      {blocks.map((block) => (
        <Fragment key={block.key}>{block.node}</Fragment>
      ))}
    </div>
  );
}
