import type { Metadata } from "next";
import { getPageSections, makeExtrasSlotter, type Section } from "@/lib/sections";
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

function byType(sections: Section[], type: Section["type"]) {
  return sections.filter((s) => s.type === type);
}

export default async function AboutPage() {
  const result = await getPageSections("about");
  const sections = result?.sections ?? [];

  const hero = byType(sections, "hero")[0];
  const story = byType(sections, "photo-text")[0];
  const team = byType(sections, "team-member")[0];
  const partners = byType(sections, "partners")[0];
  const orgStatus = byType(sections, "text")[0];

  const storyContent = story?.content as PhotoTextContent | undefined;
  const teamContent = team?.content as TeamMemberContent | undefined;
  const orgStatusContent = orgStatus?.content as TextContent | undefined;

  const consumedIds = new Set([hero, story, team, partners, orgStatus].filter((s): s is Section => !!s).map((s) => s.id));
  const extraSections = sections.filter((s) => !consumedIds.has(s.id));
  const slot = makeExtrasSlotter(extraSections);

  return (
    <div className="page-about">
      <SectionRenderer sections={slot(hero?.position ?? 0)} />
      {/* HERO */}
      {hero ? <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} /> : null}

      <SectionRenderer sections={slot(story?.position ?? Infinity)} />
      {/* FOUNDING STORY */}
      {/* NOTE: rendered inline (not via the shared PhotoText component) — the
          live "story" section uses the section-pad > section-inner > story-grid
          wrapper pattern (shared.css's generic section wrapper), while
          PhotoText.tsx renders home's "pressure"/"model" pattern, which grids
          directly on the <section> with no such wrapper. These are two
          genuinely different DOM structures, not just different class names,
          so reusing PhotoText here would require faking a structure it
          wasn't built for. Content is still fully dynamic from Supabase. */}
      {storyContent ? (
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
      ) : null}

      <SectionRenderer sections={slot(team?.position ?? Infinity)} />
      {/* OUR TEAM */}
      {teamContent ? (
        <section className="team section-pad" style={team?.background_color ? { background: team.background_color } : undefined}>
          <div className="section-inner">
            <TeamMember content={{ ...teamContent, heading: teamContent.heading ?? "Our team" }} />
          </div>
        </section>
      ) : null}

      <SectionRenderer sections={slot(partners?.position ?? Infinity)} />
      {/* FUNDERS */}
      {partners ? (
        <Partners content={partners.content as PartnersContent} backgroundColor={partners.background_color} />
      ) : null}

      <SectionRenderer sections={slot(orgStatus?.position ?? Infinity)} />
      {/* ORGANIZATION STATUS */}
      {orgStatusContent ? (
        <section className="org-status section-pad" style={orgStatus?.background_color ? { background: orgStatus.background_color } : undefined}>
          <div className="section-inner">
            <div className="funders-header reveal">
              <h2 className="funders-h">{orgStatusContent.heading}</h2>
              <div className="funders-rule"></div>
            </div>
            <p className="funders-org reveal d1">{orgStatusContent.text}</p>
          </div>
        </section>
      ) : null}

      {/* Any remaining new blocks added via "Add a block" */}
      <SectionRenderer sections={slot(Infinity)} />
    </div>
  );
}
