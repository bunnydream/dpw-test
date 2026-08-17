import type { Metadata } from "next";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import Voices, { type VoicesContent } from "@/components/blocks/Voices";
import CaseStudy, { type CaseStudyContent } from "@/components/blocks/CaseStudy";
import Cta, { type CtaContent } from "@/components/blocks/Cta";
import type { PhotoTextContent } from "@/components/blocks/PhotoText";
import type { StatsContent } from "@/components/blocks/Stats";
import ImpactManualTable, { type ImpactManualTableContent } from "@/components/blocks/ImpactManualTable";
import ImpactYearInReview, { type ImpactYearInReviewContent } from "@/components/blocks/ImpactYearInReview";
import IconCards, { type IconCardsContent } from "@/components/blocks/IconCards";
import "./impact.css";

export const metadata: Metadata = {
  title: "Impact — Digital Public Works",
};

const DEFAULT_STATS: StatsContent = {
  stats: [
    { number: "56%", label: "Application completion rate in recent statewide pilot, vs. 20–40% industry standard" },
    { number: "100%", label: "Of reports provide real-time data from linked payroll systems" },
    { number: "90%", label: "Of reports include a paystub from the last 14 days" },
    { number: "Under 5 min", label: "Median verification time, vs. 45 minutes for manual document submission" },
  ],
};

const DEFAULT_MANUAL_TABLE: ImpactManualTableContent = {
  manual_label: "Manual process",
  vmi_label: "With Verify My Income",
  rows: [
    { manual: "Find old pay stubs, print forms, and visit a benefits office in person", vmi: "Receive a secure link and connect payroll in minutes, from any device" },
    { manual: "Wait days or weeks for a caseworker to manually review documents", vmi: "Verified income report delivered to caseworker in under 5 minutes" },
    { manual: "Restart the process from scratch if anything is missing or wrong", vmi: "No documents to find, no follow-up calls, no delays" },
    { manual: "Stale quarterly wage data or documents that may be rejected", vmi: "Real-time payroll data, programmatically validated before delivery" },
  ],
};

const DEFAULT_YEAR_IN_REVIEW: ImpactYearInReviewContent = {
  heading: "Year in review",
  text: "Read our annual report to learn how DPW went from zero to one: from founding to production in two states.",
  button_text: "Read the 2025 Annual Report",
  link: "#",
};

const DEFAULT_FUNDING_MODEL: IconCardsContent = {
  heading: "How philanthropic investment creates public value",
  text: "DPW's model is built for the long term. As states move from pilots to paid contracts, earned revenue from per-verification pricing covers a growing share of operating costs.",
  cards: [
    {
      icon: "gift",
      heading: "Free to try",
      text: "Philanthropic investment funds free pilots and platform development. States can experience the full VMI service — service design, integration planning, and hands-on support — at no cost.",
    },
    {
      icon: "trend-down",
      heading: "Lower prices over time",
      text: "Because DPW operates at cost with no profit margin, every efficiency gain passes through to state partners as lower prices. The price of income verification goes down over time, not up.",
    },
    {
      icon: "lock-open",
      heading: "Open source forever",
      text: "VMI is open source. The public investment in this infrastructure is permanently protected from privatization.",
    },
  ],
};

const DEFAULT_BOTTOM_CTA: CtaContent = {
  heading: "Read our research on accessibility",
  button_text: "Read our insights",
  link: "/insights",
  background_photo_url: "/images/impact/christin-hume-Hcfwew744z4-unsplash.jpg",
};

function byType(sections: Section[], type: Section["type"]) {
  return sections.filter((s) => s.type === type);
}

export default async function ImpactPage() {
  const result = await getPageSections("impact");
  const sections = result?.sections ?? [];

  const hero = byType(sections, "hero")[0];
  const stats = byType(sections, "stats")[0];
  const families = byType(sections, "photo-text")[0];
  const familiesContent = families?.content as PhotoTextContent | undefined;
  const manualTable = byType(sections, "impact-manual-table")[0];
  const voices = byType(sections, "voices")[0];
  const deployed = byType(sections, "case-study")[0];
  const yearInReview = byType(sections, "impact-year-in-review")[0];
  const fundingModel = byType(sections, "icon-cards")[0];
  const bottomCta = byType(sections, "cta")[0];

  const statsContent = (stats?.content as StatsContent | undefined) ?? DEFAULT_STATS;
  const manualTableContent = (manualTable?.content as ImpactManualTableContent | undefined) ?? DEFAULT_MANUAL_TABLE;
  const yearInReviewContent = (yearInReview?.content as ImpactYearInReviewContent | undefined) ?? DEFAULT_YEAR_IN_REVIEW;
  const fundingModelContent = (fundingModel?.content as IconCardsContent | undefined) ?? DEFAULT_FUNDING_MODEL;
  const bottomCtaContent = (bottomCta?.content as CtaContent | undefined) ?? DEFAULT_BOTTOM_CTA;

  return (
    <div className="page-impact">
      {/* ─── 1. HERO ─── */}
      {hero ? (
        <Hero
          content={hero.content as HeroContent}
          backgroundColor={hero.background_color}
          subtitleLayout="stack-staggered"
          imgWidth={1200}
          imgHeight={1600}
        />
      ) : null}

      {/* ─── 2. METRICS ───
          Rendered inline rather than via the shared Stats component: the
          live markup uses <span class="stat-label"> while Stats.tsx renders
          <p class="stat-label"> — a real tag difference with no explicit
          `display` override in CSS, so swapping would risk a layout shift. */}
      <div className="stat-row" role="list">
        {statsContent.stats.map((stat, i) => (
          <div className={`stat-cell reveal d${i + 1}`} role="listitem" key={i}>
            <span className="stat-num">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ─── 3. FAMILIES + COMPARISON ───
          Rendered inline rather than via the shared PhotoText component: this
          section's classNames (families-img / families-right) differ from
          home's pressure/model pattern that PhotoText.tsx implements, and it
          has no pullquote but does have a fixed .comp-card widget that isn't
          part of admin's photo-text field shape at all. */}
      <section className="families">
        {(() => {
          const imgEl = (
            <div className="families-img">
              <img
                src={familiesContent?.photo_url ?? "/images/impact/khaled-ali-e8ZJeTnfP6U-unsplash.jpg"}
                alt={familiesContent?.photo_alt ?? "A woman looking at her phone"}
                loading="lazy"
              />
            </div>
          );
          const contentEl = (
            <div className="families-right">
              <h2 className="section-h reveal">
                {familiesContent?.heading ?? "From hours of paperwork to five minutes — without leaving home"}
              </h2>

              <div className="body-text reveal d1">
                {(
                  familiesContent?.text ?? [
                    "Before VMI, verifying income for SNAP or Medicaid meant finding old pay stubs, printing forms, visiting an office, and waiting. If something was missing, the process started over. For someone navigating a job change, caring for children, or managing a health crisis, this time tax could mean weeks without benefits.",
                    "With Verify My Income, an applicant receives a secure link from their agency. They consent to share their payroll data and connect to their employer's payroll system. In under five minutes, a verified income report is delivered directly to their caseworker. No documents to find. No follow-up calls. No delays.",
                  ]
                ).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <ImpactManualTable content={manualTableContent} />
            </div>
          );
          return familiesContent?.side === "right" ? (
            <>
              {contentEl}
              {imgEl}
            </>
          ) : (
            <>
              {imgEl}
              {contentEl}
            </>
          );
        })()}
      </section>

      {/* ─── 4. VOICES CAROUSEL ─── */}
      {voices ? <Voices content={voices.content as VoicesContent} backgroundColor={voices.background_color} /> : null}

      {/* ─── 5. DEPLOYED AND DELIVERING RESULTS ─── */}
      <section className="field section-pad" id="deployed">
        <div className="section-inner">
          <h2 className="section-h reveal">
            {deployed ? (deployed.content as CaseStudyContent).heading ?? "Deployed and delivering results" : "Deployed and delivering results"}
          </h2>
          {deployed ? <CaseStudy content={deployed.content as CaseStudyContent} /> : null}
        </div>
      </section>

      {/* ─── 6. YEAR IN REVIEW ─── */}
      <ImpactYearInReview content={yearInReviewContent} backgroundColor={yearInReview?.background_color} />

      {/* ─── 7. FUNDING MODEL ─── */}
      <section
        className="funding section-pad"
        id="funding-model"
        style={fundingModel?.background_color ? { background: fundingModel.background_color } : undefined}
      >
        <div className="section-inner">
          <IconCards content={fundingModelContent} />
        </div>
      </section>

      {/* INSIGHTS CTA */}
      <Cta content={bottomCtaContent} backgroundColor={bottomCta?.background_color} />
    </div>
  );
}
