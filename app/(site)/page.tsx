import type { Metadata } from "next";
import HowStepsProgress from "@/components/HowStepsProgress";
import { getPageSections, makeExtrasSlotter, type Section } from "@/lib/sections";
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

  const hero = byType(sections, "hero")[0];
  const stats = byType(sections, "stats")[0];
  const photoTextSections = byType(sections, "photo-text");
  const pressure = photoTextSections[0];
  const model = photoTextSections[1];
  const compareTable = byType(sections, "home-compare-table")[0];
  const howHeading = byType(sections, "text")[0];
  const steps = byType(sections, "steps")[0];
  const stories = byType(sections, "icon-cards")[0];
  const howImage = byType(sections, "image")[0];
  const voices = byType(sections, "voices")[0];
  const partners = byType(sections, "partners")[0];
  const cta = byType(sections, "cta")[0];

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
  const slot = makeExtrasSlotter(extraSections);

  return (
    <div className="page-home">
      <SectionRenderer sections={slot(hero?.position ?? 0)} />
      {/* HERO */}
      {hero ? <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} /> : null}

      <SectionRenderer sections={slot(stats?.position ?? Infinity)} />
      {/* STAT ROW */}
      {stats ? <Stats content={stats.content as StatsContent} backgroundColor={stats.background_color} /> : null}

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

      <SectionRenderer sections={slot(compareTable?.position ?? Infinity)} />
      {/* COMPARISON TEASER */}
      <HomeCompareTable content={compareTableContent} backgroundColor={compareTable?.background_color} />

      <SectionRenderer sections={slot(pressure?.position ?? Infinity)} />
      {/* PRESSURE */}
      {pressure ? (
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
      ) : null}

      <SectionRenderer sections={slot(howHeading?.position ?? Infinity)} />
      {/* HOW IT WORKS */}
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

      <SectionRenderer sections={slot(stories?.position ?? Infinity)} />
      {/* STORIES */}
      <section className="stories" style={stories?.background_color ? { background: stories.background_color } : undefined}>
        <div className="stories-inner">
          <IconCards content={storiesContent} />
        </div>
      </section>

      <SectionRenderer sections={slot(model?.position ?? Infinity)} />
      {/* MODEL */}
      {model ? (
        <PhotoText
          content={model.content as PhotoTextContent}
          backgroundColor={model.background_color}
          pullquoteTag="blockquote"
          imgWidth={800}
          imgHeight={1000}
        />
      ) : null}

      <SectionRenderer sections={slot(voices?.position ?? Infinity)} />
      {/* QUOTES CAROUSEL */}
      {voices ? <Voices content={voices.content as VoicesContent} backgroundColor={voices.background_color} /> : null}

      <SectionRenderer sections={slot(partners?.position ?? Infinity)} />
      {/* FUNDERS */}
      {partners ? (
        <Partners content={partners.content as PartnersContent} backgroundColor={partners.background_color} />
      ) : null}

      <SectionRenderer sections={slot(cta?.position ?? Infinity)} />
      {/* PILOT CTA */}
      {cta ? (
        <Cta
          content={{
            ...(cta.content as CtaContent),
            text: (cta.content as CtaContent).text ?? "No procurement required to begin the conversation.",
          }}
          backgroundColor={cta.background_color}
        />
      ) : null}

      {/* Any remaining new blocks added via "Add a block" */}
      <SectionRenderer sections={slot(Infinity)} />
    </div>
  );
}
