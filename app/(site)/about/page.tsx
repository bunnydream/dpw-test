import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import { type PhotoTextContent } from "@/components/blocks/PhotoText";
import TeamMember, { type TeamMemberContent } from "@/components/blocks/TeamMember";
import Partners, { type PartnersContent } from "@/components/blocks/Partners";
import SectionRenderer from "@/components/blocks/SectionRenderer";
import { getSeoSettings } from "@/lib/site-settings";
import { resolveMetadata } from "@/lib/seo";
import "./about.css";

export async function generateMetadata(): Promise<Metadata> {
  const [result, siteSeo] = await Promise.all([getPageSections("about"), getSeoSettings()]);
  return resolveMetadata({ item: result?.page ?? null, fallbackTitle: "About", path: "/about", siteSeo });
}

type TextContent = {
  heading?: string | null;
  text: string;
};

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

export default async function AboutPage() {
  const result = await getPageSections("about");
  const sections = result?.sections ?? [];

  const hero = pickByName(sections, "hero", ["About Us"])[0];
  const story = pickByName(sections, "photo-text", ["How Digital Public Works started"])[0];
  const team = pickByName(sections, "team-member", ["Our team"])[0];
  const partners = pickByName(sections, "partners", ["Backed by"])[0];
  const orgStatus = pickByName(sections, "text", ["Organization status"])[0];

  const storyContent = story?.content as PhotoTextContent | undefined;
  const teamContent = team?.content as TeamMemberContent | undefined;
  const orgStatusContent = orgStatus?.content as TextContent | undefined;

  const consumedIds = new Set([hero, story, team, partners, orgStatus].filter((s): s is Section => !!s).map((s) => s.id));
  const extraSections = sections.filter((s) => !consumedIds.has(s.id) && !s.hidden);

  // Rank used as a section's sort position only when its DB row doesn't
  // exist yet — reproduces today's fixed order for freshly-seeded pages.
  const RANK = { hero: 0, story: 1, team: 2, partners: 3, orgStatus: 4 };

  type Block = { key: string; position: number; node: ReactNode };

  const blocks: Block[] = [
    {
      key: hero?.id ?? "hero",
      position: hero?.position ?? RANK.hero,
      node: hero ? <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} isPageHero /> : null,
    },
    {
      key: story?.id ?? "story",
      position: story?.position ?? RANK.story,
      // NOTE: rendered inline (not via the shared PhotoText component) — the
      // live "story" section uses the section-pad > section-inner > story-grid
      // wrapper pattern (shared.css's generic section wrapper), while
      // PhotoText.tsx renders home's "pressure"/"model" pattern, which grids
      // directly on the <section> with no such wrapper. These are two
      // genuinely different DOM structures, not just different class names,
      // so reusing PhotoText here would require faking a structure it
      // wasn't built for. Content is still fully dynamic from Supabase.
      node: storyContent ? (
        <section className="story section-pad" style={story?.background_color ? { background: story.background_color } : undefined}>
          <div className="section-inner">
            <div className="story-grid">
              {storyContent.side === "right" ? (
                <>
                  <div>
                    <h2 className="section-h reveal" style={{ marginBottom: "clamp(24px, 3vw, 36px)" }}>
                      {storyContent.heading}
                    </h2>
                    <div className="body-text reveal d1">
                      {storyContent.text.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  <div className="story-photo reveal">
                    <img src={storyContent.photo_url} alt={storyContent.photo_alt ?? ""} loading="lazy" />
                  </div>
                </>
              ) : (
                <>
                  <div className="story-photo reveal">
                    <img src={storyContent.photo_url} alt={storyContent.photo_alt ?? ""} loading="lazy" />
                  </div>
                  <div>
                    <h2 className="section-h reveal" style={{ marginBottom: "clamp(24px, 3vw, 36px)" }}>
                      {storyContent.heading}
                    </h2>
                    <div className="body-text reveal d1">
                      {storyContent.text.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ) : null,
    },
    {
      key: team?.id ?? "team",
      position: team?.position ?? RANK.team,
      node: teamContent ? (
        <section className="team section-pad" style={team?.background_color ? { background: team.background_color } : undefined}>
          <div className="section-inner">
            <TeamMember content={{ ...teamContent, heading: teamContent.heading ?? "Our team" }} />
          </div>
        </section>
      ) : null,
    },
    {
      key: partners?.id ?? "partners",
      position: partners?.position ?? RANK.partners,
      node: partners ? (
        <Partners content={partners.content as PartnersContent} backgroundColor={partners.background_color} />
      ) : null,
    },
    {
      key: orgStatus?.id ?? "orgStatus",
      position: orgStatus?.position ?? RANK.orgStatus,
      node: orgStatusContent ? (
        <section className="org-status section-pad" style={orgStatus?.background_color ? { background: orgStatus.background_color } : undefined}>
          <div className="section-inner">
            <div className="funders-header reveal">
              <h2 className="funders-h">{orgStatusContent.heading}</h2>
              <div className="funders-rule"></div>
            </div>
            <p className="funders-org reveal d1">{orgStatusContent.text}</p>
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
    <div className="page-about">
      {blocks.map((block) => (
        <Fragment key={block.key}>{block.node}</Fragment>
      ))}
    </div>
  );
}
