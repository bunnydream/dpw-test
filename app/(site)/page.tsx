import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import HowStepsProgress from "@/components/HowStepsProgress";
import { getPageSections, type Section } from "@/lib/sections";
import { getSeoSettings } from "@/lib/site-settings";
import { resolveMetadata } from "@/lib/seo";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import Stats, { type StatsContent } from "@/components/blocks/Stats";
import PhotoText, { type PhotoTextContent } from "@/components/blocks/PhotoText";
import Steps, { type StepsContent } from "@/components/blocks/Steps";
import Voices, { type VoicesContent } from "@/components/blocks/Voices";
import Partners, { type PartnersContent } from "@/components/blocks/Partners";
import Cta, { type CtaContent } from "@/components/blocks/Cta";
import HomeCompareTable, { type HomeCompareTableContent } from "@/components/blocks/HomeCompareTable";
import IconCards, { type IconCardsContent } from "@/components/blocks/IconCards";
import { type ImageContent } from "@/components/blocks/Image";
import SectionRenderer from "@/components/blocks/SectionRenderer";
import "./home.css";

type TextContent = {
  heading?: string | null;
  text?: string | null;
};

// Fallback content for sections that haven't been seeded into Supabase yet —
// matches today's hardcoded copy exactly, so the page looks identical
// whether or not the DB row exists yet.
const DEFAULT_COMPARE_TABLE: HomeCompareTableContent = {
  heading: "At a glance: how Verify My Income compares",
  traditional_label: "Traditional Approaches",
  vmi_label: "VMI — Digital Public Works",
  link_text: "See the full comparison",
  link: "/product#comparison",
  rows: [
    { label: "Pricing", traditional: "Per-query, rising over time", vmi: "Nonprofit, at-cost. Price falls as more states join." },
    { label: "Data quality", traditional: "Raw data, no validation", vmi: "Every report programmatically validated" },
    { label: "Source code", traditional: "Proprietary", vmi: "Open source under AGPL-3.0" },
    { label: "Vendor lock-in", traditional: "High — no exit path", vmi: "None. Full code and architecture access." },
    { label: "Service model", traditional: "Data hand-off", vmi: "Embedded partnership and service design" },
  ],
};

const DEFAULT_HOW_HEADING: TextContent = {
  heading: "How Verify My Income works",
  text:
    "VMI handles the entire data journey from the applicant's payroll provider, through a consent-driven workflow, to a caseworker-ready report. States get a complete service, not just a data feed.",
};

const DEFAULT_STORIES: IconCardsContent = {
  heading: "We do not just deliver data. We fix the process.",
  text:
    "Most verification vendors hand off data and walk away. DPW embeds with your team to find and fix the problems no data feed can solve.",
  footnote:
    "Every state engagement includes a discovery sprint with interviews of policy experts, caseworkers, quality control workers, community organizations, and applicants. These are not one-time exercises. DPW conducts ongoing case reviews, feedback analysis, and service design improvements throughout the partnership.",
  cards: [
    {
      icon: "document",
      label: "Finding 1",
      heading: "A form question that created unnecessary work",
      text:
        "In one state, the application asked for a specific number of hours worked rather than a range. When paystubs showed normal week-to-week variation, caseworkers were forced to issue unnecessary Requests for Information. DPW recommended changing the question to ask for a range — eliminating RFIs caused by a form-wording problem that had nothing to do with data access.",
    },
    {
      icon: "eye-slash",
      label: "Finding 2",
      heading: "40% of applicants did not know they had a next step",
      text:
        "In another state, approximately 40% of SNAP renewal applicants were not submitting required income documents because they did not realize they needed to. DPW worked with the state to add a clear alert on the post-submission page. The result: a 35% increase in income document submissions across all verification methods, not just VMI.",
    },
    {
      icon: "refresh",
      label: "Finding 3",
      heading: "Caseworkers were over-verifying without realizing it",
      text:
        "DPW's case review analysis found caseworkers frequently requesting household composition verification at unnecessary steps in the benefit lifecycle. After DPW flagged this pattern, a policy bulletin was published clarifying when such requests were appropriate — reducing burden on both applicants and staff.",
    },
  ],
};

const DEFAULT_HOW_IMAGE: ImageContent = {
  photo_url: "/images/home/home-howVMIworks.png",
  photo_alt: "How VMI works diagram",
};

function byType(sections: Section[], type: Section["type"]) {
  return sections.filter((s) => s.type === type);
}

// Matches sections of `type` to `names` by exact `name`, in order — pins
// each fixed-role slot to the specific row it was created for, so a later
// same-type block (added via "Add a new block", which always gets a
// generic "New <type>" name — see starterName() in block-types.ts) can't
// silently take over the slot. Any name with no match falls back to the
// next remaining same-type row by position, matching today's behavior.
function pickByName(sections: Section[], type: Section["type"], names: string[]) {
  const candidates = byType(sections, type);
  const claimed = new Set<string>();
  const picks = names.map((name) => {
    const match = candidates.find((s) => s.name === name && !claimed.has(s.id));
    if (match) claimed.add(match.id);
    return match;
  });
  const remaining = candidates.filter((s) => !claimed.has(s.id));
  let i = 0;
  return picks.map((p) => p ?? remaining[i++]);
}

export async function generateMetadata(): Promise<Metadata> {
  const [result, siteSeo] = await Promise.all([getPageSections("home"), getSeoSettings()]);
  return resolveMetadata({
    item: result?.page ?? null,
    fallbackTitle: "Digital Public Works: Building digital infrastructure that strengthens communities.",
    rawFallbackTitle: true,
    path: "/",
    siteSeo,
  });
}

export default async function HomePage() {
  const result = await getPageSections("home");
  const sections = result?.sections ?? [];

  const hero = pickByName(sections, "hero", [
    "What if income verification worked for families and states instead of vendors?",
  ])[0];
  const stats = pickByName(sections, "stats", ["Impact numbers"])[0];
  const [pressure, model] = pickByName(sections, "photo-text", ["The pressure is real", "A better model"]);
  const compareTable = byType(sections, "home-compare-table")[0];
  const howHeading = pickByName(sections, "text", ["How it works heading"])[0];
  const steps = pickByName(sections, "steps", ["How Verify My Income works"])[0];
  const stories = pickByName(sections, "icon-cards", ["Stories"])[0];
  const howImage = pickByName(sections, "image", ["How it works diagram"])[0];
  const voices = pickByName(sections, "voices", ["Trusted by real people"])[0];
  const partners = pickByName(sections, "partners", ["Backed by"])[0];
  const cta = pickByName(sections, "cta", ["Ready to pilot Verify My Income?"])[0];

  const compareTableContent = (compareTable?.content as HomeCompareTableContent | undefined) ?? DEFAULT_COMPARE_TABLE;
  const howHeadingContent = (howHeading?.content as TextContent | undefined) ?? DEFAULT_HOW_HEADING;
  const storiesContent = (stories?.content as IconCardsContent | undefined) ?? DEFAULT_STORIES;
  const howImageContent = (howImage?.content as ImageContent | undefined) ?? DEFAULT_HOW_IMAGE;

  // Sections not claimed by any of the slots above (e.g. new blocks added
  // via "Add a block" in admin) — rendered generically at the end of the
  // page so they actually show up on the live site instead of being
  // silently dropped.
  const consumedIds = new Set(
    [hero, stats, pressure, model, compareTable, howHeading, steps, stories, howImage, voices, partners, cta]
      .filter((s): s is Section => !!s)
      .map((s) => s.id)
  );
  const extraSections = sections.filter((s) => !consumedIds.has(s.id));

  // Rank used as a section's sort position only when its DB row doesn't
  // exist yet — reproduces today's fixed order for freshly-seeded pages.
  const RANK = {
    hero: 0,
    stats: 1,
    compareTable: 2,
    pressure: 3,
    how: 4,
    stories: 5,
    model: 6,
    voices: 7,
    partners: 8,
    cta: 9,
  };

  type Block = { key: string; position: number; node: ReactNode };

  const blocks: Block[] = [
    {
      key: hero?.id ?? "hero",
      position: hero?.position ?? RANK.hero,
      node: hero ? <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} /> : null,
    },
    {
      key: stats?.id ?? "stats",
      position: stats?.position ?? RANK.stats,
      node: stats ? <Stats content={stats.content as StatsContent} backgroundColor={stats.background_color} /> : null,
    },
    {
      key: compareTable?.id ?? "compareTable",
      position: compareTable?.position ?? RANK.compareTable,
      node: <HomeCompareTable content={compareTableContent} backgroundColor={compareTable?.background_color} />,
    },
    {
      key: pressure?.id ?? "pressure",
      position: pressure?.position ?? RANK.pressure,
      node: pressure ? (
        <PhotoText
          content={{
            ...(pressure.content as PhotoTextContent),
            button_text: (pressure.content as PhotoTextContent).button_text ?? "Request a demo",
            button_link: (pressure.content as PhotoTextContent).button_link ?? "/contact",
          }}
          backgroundColor={pressure.background_color}
          pullquoteTag="div"
          id="pressure"
          imgWidth={1400}
          imgHeight={1050}
        />
      ) : null,
    },
    {
      key: howHeading?.id ?? steps?.id ?? howImage?.id ?? "how",
      position: howHeading?.position ?? steps?.position ?? howImage?.position ?? RANK.how,
      node: (
        <>
          <section className="how" id="how-vmi-works">
            <div className="how-inner">
              <h2 className="section-h reveal">{howHeadingContent.heading}</h2>
              <p className="body-p reveal d1">{howHeadingContent.text}</p>

              <div className="how-cols">
                <div className="how-left">
                  {steps ? <Steps content={steps.content as StepsContent} /> : null}
                </div>

                <div className="how-right reveal d2">
                  <img src={howImageContent.photo_url} alt={howImageContent.photo_alt ?? ""} loading="lazy" />
                </div>
              </div>
            </div>
          </section>
          <HowStepsProgress />
        </>
      ),
    },
    {
      key: stories?.id ?? "stories",
      position: stories?.position ?? RANK.stories,
      node: (
        <section className="stories" style={stories?.background_color ? { background: stories.background_color } : undefined}>
          <div className="stories-inner">
            <IconCards content={storiesContent} />
          </div>
        </section>
      ),
    },
    {
      key: model?.id ?? "model",
      position: model?.position ?? RANK.model,
      node: model ? (
        <PhotoText
          content={model.content as PhotoTextContent}
          backgroundColor={model.background_color}
          pullquoteTag="blockquote"
          imgWidth={800}
          imgHeight={1000}
        />
      ) : null,
    },
    {
      key: voices?.id ?? "voices",
      position: voices?.position ?? RANK.voices,
      node: voices ? <Voices content={voices.content as VoicesContent} backgroundColor={voices.background_color} /> : null,
    },
    {
      key: partners?.id ?? "partners",
      position: partners?.position ?? RANK.partners,
      node: partners ? (
        <Partners content={partners.content as PartnersContent} backgroundColor={partners.background_color} />
      ) : null,
    },
    {
      key: cta?.id ?? "cta",
      position: cta?.position ?? RANK.cta,
      node: cta ? (
        <Cta
          content={{
            ...(cta.content as CtaContent),
            text: (cta.content as CtaContent).text ?? "No procurement required to begin the conversation.",
          }}
          backgroundColor={cta.background_color}
        />
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
    <div className="page-home">
      {/* LOGOS — hidden at launch. CMS: sections table, type='logo_row', visible=false */}
      <section className="logos-section" id="logos" style={{ display: "none" }} aria-label="Partners and funders">
        <div className="logos-inner">
          <div className="logos-row">
            <p className="logos-label">Trusted by</p>
            <div className="logos-strip">
              <div className="logo-placeholder">
                <span>PA DHS — pending</span>
              </div>
              <div className="logo-placeholder">
                <span>AZ DES — pending</span>
              </div>
              <div className="logo-placeholder">
                <span>Partner logo</span>
              </div>
            </div>
          </div>

          <div className="logos-divider"></div>

          <div className="logos-row">
            <p className="logos-label">Backed by</p>
            <div className="logos-strip">
              <a href="https://www.drkfoundation.org" className="logo-text" target="_blank" rel="noopener">
                DRK Foundation
              </a>
              <a href="https://www.aarp.org/aarp-foundation/" className="logo-text" target="_blank" rel="noopener">
                AARP Foundation
              </a>
              <a href="https://familiesandworkers.org" className="logo-text" target="_blank" rel="noopener">
                Families and Workers Fund
              </a>
              <a
                href="https://www.pritzkerchildrensinitiative.org"
                className="logo-text"
                target="_blank"
                rel="noopener"
              >
                Pritzker Children&apos;s Initiative
              </a>
              <div className="logo-placeholder">
                <span>+ more</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {blocks.map((block) => (
        <Fragment key={block.key}>{block.node}</Fragment>
      ))}
    </div>
  );
}
