import type { Metadata } from "next";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import { type PhotoTextContent } from "@/components/blocks/PhotoText";
import TeamMember, { type TeamMemberContent } from "@/components/blocks/TeamMember";
import Partners, { type PartnersContent } from "@/components/blocks/Partners";
import "./about.css";

export const metadata: Metadata = {
  title: "About — Digital Public Works",
};

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

  return (
    <div className="page-about">
      {/* HERO */}
      {hero ? <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} /> : null}

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

      {/* OUR TEAM */}
      {teamContent ? (
        <section className="team section-pad">
          <div className="section-inner">
            <TeamMember content={{ ...teamContent, heading: teamContent.heading ?? "Our team" }} />
          </div>
        </section>
      ) : null}

      {/* FUNDERS */}
      {partners ? (
        <Partners content={partners.content as PartnersContent} backgroundColor={partners.background_color} />
      ) : null}

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
    </div>
  );
}
