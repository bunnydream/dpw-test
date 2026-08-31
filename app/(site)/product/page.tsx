import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import ProductAccordion from "@/components/ProductAccordion";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import CaseStudy, { type CaseStudyContent } from "@/components/blocks/CaseStudy";
import Cta, { type CtaContent } from "@/components/blocks/Cta";
import ProductProblemAccordion, { type ProductProblemAccordionContent } from "@/components/blocks/ProductProblemAccordion";
import ProductTalkCta, { type ProductTalkCtaContent } from "@/components/blocks/ProductTalkCta";
import ProductCompareTable, { type ProductCompareTableContent } from "@/components/blocks/ProductCompareTable";
import ProductVendorQuestions, { type ProductVendorQuestionsContent } from "@/components/blocks/ProductVendorQuestions";
import SectionRenderer from "@/components/blocks/SectionRenderer";
import { getSeoSettings } from "@/lib/site-settings";
import { resolveMetadata } from "@/lib/seo";
import "./product.css";

export async function generateMetadata(): Promise<Metadata> {
  const [result, siteSeo] = await Promise.all([getPageSections("product"), getSeoSettings()]);
  return resolveMetadata({
    item: result?.page ?? null,
    fallbackTitle: "Verify My Income",
    path: "/product",
    siteSeo,
  });
}

type ContentCardsContent = {
  heading: string;
  text: string;
  footnote?: string | null;
  card_background_color?: string | null;
  cards: {
    title?: string | null;
    heading: string;
    text: string;
    photo_url: string;
    photo_alt?: string | null;
  }[];
};

type ProblemPhotoTextContent = {
  side?: "left" | "right" | null;
  heading: string;
  text: string;
  photo_url: string;
  photo_alt?: string | null;
};

type AccessPhotoTextContent = {
  side?: "left" | "right" | null;
  heading: string;
  text: string[];
  photo_url: string;
  photo_alt?: string | null;
  stat_number?: string | null;
  stat_text?: string | null;
};

type PilotStepsContent = {
  heading?: string | null;
  footnote?: string | null;
  steps: {
    heading: string;
    description: string;
  }[];
};

const DEFAULT_BUILT_TO_FIT_FOOTNOTE =
  "Each state deployment is white-labeled and configured to match the state's branding, communication preferences, and data requirements. Income reports are delivered via SFTP, S3, encrypted email, or webhooks API to fit existing state infrastructure.";

const DEFAULT_PROBLEM_ACCORDION: ProductProblemAccordionContent = {
  solution_label: "How VMI solves it",
  items: [
    {
      title: "No verification layer",
      problem:
        "States receive raw data from commercial databases or paper documents, but have no service layer to validate, contextualize, and deliver that data in a format caseworkers can act on immediately. The result: follow-up calls, manual processing, and delayed enrollment.",
      solution:
        "VMI handles the entire data journey: consent management, payroll connection, data validation, QA review, and delivery of a standardized income report to the caseworker. States get a complete service, not just a data feed.",
    },
    {
      title: "Burden on caseworkers",
      problem:
        "When electronic verification fails, caseworkers must manually process documents, make follow-up calls, and request additional information from applicants.",
      solution:
        "93% of caseworkers find VMI's income reports just as easy or easier to use than existing methods. Every report goes through data validation and sufficiency checks before it reaches a caseworker. Fewer follow-up calls. Less manual data entry.",
    },
    {
      title: "Time tax on applicants",
      problem:
        "People are required to track down pay stubs, print forms, and submit documents to prove their income. Access to benefits is delayed by days or weeks.",
      solution:
        "Applicants verify income in under 5 minutes. No documents to find or upload. 85% of applicants report no difficulty completing the process.",
    },
    {
      title: "Raw data is not verification",
      problem:
        "Payroll aggregators can connect to employer systems and pull income records. But raw aggregator data frequently lacks the information caseworkers need, including missing pay dates, no gross pay amounts, or no hours data. Without a verification layer, incomplete records reach the caseworker and drive errors.",
      solution:
        "Every aggregator response passes through VMI's validation layer before any data reaches a state agency. Reports that do not meet eligibility-grade standards are rejected, and the applicant is routed to an alternative. States receive only verified, caseworker-ready data.",
    },
  ],
};

const DEFAULT_TALK_CTA: ProductTalkCtaContent = {
  heading: "Bring VMI to your state →",
  subtext: "Learn about piloting with Digital Public Works",
  link: "/contact",
};

const DEFAULT_COMPARE_TABLE: ProductCompareTableContent = {
  heading: "Traditional Approaches vs. VMI",
  traditional_label: "Traditional Approaches",
  vmi_label: "VMI — Digital Public Works",
  rows: [
    {
      label: "What you get",
      traditional: "A data connection, a bundled add-on to a larger contract, or a commercial product. The state fills the gaps.",
      vmi: "A complete verification service. Consent, benefits-specific data validation, and caseworker-ready reports included.",
    },
    {
      label: "Pricing",
      traditional: "Commercial pricing that rises over time. Some vendors bundle verification into larger contracts, hiding the true cost.",
      vmi: "Nonprofit, at cost. Price decreases as more states join the platform.",
    },
    {
      label: "Data quality",
      traditional: "Raw data delivered as-is. No validation against program requirements. Incomplete or unusable records reach caseworkers.",
      vmi: "Every report passes through programmatic validation. Reports that do not meet eligibility-grade standards are rejected and applicants are redirected to existing options.",
    },
    {
      label: "Open source",
      traditional: "Proprietary. No visibility into how the system works.",
      vmi: "Full codebase published under AGPL-3.0 on GitHub.",
    },
    {
      label: "Vendor lock-in",
      traditional: "High. Switching vendors means rebuilding. Some states are locked into multi-year contracts with no exit path.",
      vmi: "None. If DPW ceased to exist, states retain full access to the code, architecture, and documentation.",
    },
    {
      label: "Accessibility",
      traditional: "State inherits responsibility for all embedded components, including third-party interfaces it does not control.",
      vmi: "WCAG 2.1 AA commitment with independent third-party auditing funded by AARP Foundation.",
    },
    {
      label: "Service model",
      traditional: "Per-verification billing regardless of eligibility value.",
      vmi: "Embedded partnership: discovery sprints, case reviews, ongoing service design, and workflow improvement.",
    },
  ],
};

const DEFAULT_VENDOR_QUESTIONS: ProductVendorQuestionsContent = {
  heading: "Questions to Ask Any Income Verification Vendor",
  items: [
    {
      question: "What is the total cost of ownership?",
      answer:
        "Ask for the full picture, not just the per-verification price. Will you separately fund UX design, consent infrastructure, eligibility logic, security authorization, accessibility compliance, and ongoing maintenance?",
    },
    {
      question: "Who is responsible for accessibility compliance?",
      answer:
        "If the product embeds third-party login interfaces or components the vendor does not control, who remediates accessibility failures in those components? VMI's accessibility is independently audited by a third party, funded by AARP Foundation.",
    },
    {
      question: "Is there a data validation layer?",
      answer:
        "Raw payroll data is not always usable for eligibility determinations. What happens when a report is missing pay dates, gross pay, or hours data? After login, what happens if accounts are completely empty or the most recent pay date is 5 years old? Does the product catch that and redirect the client before it reaches a caseworker, or does the caseworker find out? VMI blocks reports that do not meet program-specific quality standards and redirects applicants to existing verification options.",
    },
    {
      question: "What happens if you need to switch vendors?",
      answer:
        "Can you take the code, the architecture, and the documentation with you? Or do you start over? VMI is open source under AGPL-3.0. The full codebase is published on GitHub.",
    },
    {
      question: "How does pricing change as usage scales?",
      answer:
        "Does the per-unit cost go up with volume, stay flat, or go down? VMI is operated at cost by a nonprofit. Per-state costs decrease as more states join the platform regardless of whether an individual state's own volume increases.",
    },
    {
      question: "Can you switch data providers without rebuilding?",
      answer:
        "VMI sits above the data layer — states integrate once with the platform, not with individual data providers. If a payroll aggregator raises prices or drops in quality, VMI can swap them out and absorb the normalization work. The state's integration never changes.",
    },
    {
      question: "What implementation support is included?",
      answer:
        "Does the vendor deliver data and walk away, or embed with your team? VMI engagements include discovery sprints, caseworker and applicant interviews, case review analysis, and ongoing service design improvements throughout the partnership.",
    },
  ],
};

const DEFAULT_PILOT_HEADING = "The path to a pilot";
const DEFAULT_PILOT_FOOTNOTE =
  "Pennsylvania launched in six weeks from kickoff to go-live and scaled to statewide availability eight weeks later. DPW moves at the speed of the state's capacity. Tightly scoped integrations can launch in as little as four weeks; broader engagements typically take 8 to 12.";

const DEFAULT_BOTTOM_CTA: CtaContent = {
  heading: "See the difference Verify My Income makes for families and state systems",
  button_text: "See our impact",
  link: "/impact",
  background_photo_url: "/images/product/harald-wolff-msHKfPyFH7g-unsplash.jpg",
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

export default async function ProductPage() {
  const result = await getPageSections("product");
  const sections = result?.sections ?? [];

  const hero = pickByName(sections, "hero", ["Verify My Income"])[0];
  const builtToFit = pickByName(sections, "content-cards", ["Built to fit your systems"])[0];
  const [verificationProblem, accessible] = pickByName(sections, "photo-text", [
    "The verification problem",
    "Accessible by design, not as an afterthought",
  ]);
  const problemAccordion = byType(sections, "product-problem-accordion")[0];
  const talkCta = byType(sections, "product-talk-cta")[0];
  const compareTable = byType(sections, "product-compare-table")[0];
  const vendorQuestions = byType(sections, "product-vendor-questions")[0];
  const pilotSteps = pickByName(sections, "steps", ["The path to a pilot"])[0];
  const inTheField = pickByName(sections, "case-study", ["In the field"])[0];
  const bottomCta = pickByName(sections, "cta", ["Impact CTA"])[0];

  const builtToFitContent = builtToFit?.content as ContentCardsContent | undefined;
  const verificationProblemContent = verificationProblem?.content as ProblemPhotoTextContent | undefined;
  const accessibleContent = accessible?.content as AccessPhotoTextContent | undefined;
  const pilotStepsContent = pilotSteps?.content as PilotStepsContent | undefined;

  const problemAccordionContent = (problemAccordion?.content as ProductProblemAccordionContent | undefined) ?? DEFAULT_PROBLEM_ACCORDION;
  const talkCtaContent = (talkCta?.content as ProductTalkCtaContent | undefined) ?? DEFAULT_TALK_CTA;
  const compareTableContent = (compareTable?.content as ProductCompareTableContent | undefined) ?? DEFAULT_COMPARE_TABLE;
  const vendorQuestionsContent = (vendorQuestions?.content as ProductVendorQuestionsContent | undefined) ?? DEFAULT_VENDOR_QUESTIONS;
  const bottomCtaContent = (bottomCta?.content as CtaContent | undefined) ?? DEFAULT_BOTTOM_CTA;

  const consumedIds = new Set(
    [hero, builtToFit, verificationProblem, accessible, problemAccordion, talkCta, compareTable, vendorQuestions, pilotSteps, inTheField, bottomCta]
      .filter((s): s is Section => !!s)
      .map((s) => s.id)
  );
  const extraSections = sections.filter((s) => !consumedIds.has(s.id));

  // Rank used as a section's sort position only when its DB row doesn't
  // exist yet — reproduces today's fixed order for freshly-seeded pages.
  const RANK = {
    hero: 0,
    builtToFit: 1,
    verificationProblem: 2,
    talkCta: 3,
    compareTable: 4,
    vendorQuestions: 5,
    accessible: 6,
    pilotSteps: 7,
    inTheField: 8,
    bottomCta: 9,
  };

  type Block = { key: string; position: number; node: ReactNode };

  const blocks: Block[] = [
    {
      key: hero?.id ?? "hero",
      position: hero?.position ?? RANK.hero,
      node: hero ? (
        <Hero
          content={hero.content as HeroContent}
          backgroundColor={hero.background_color}
          subtitleLayout="stack"
          primaryButtonStyle={{ marginTop: "8px" }}
        />
      ) : null,
    },
    {
      key: builtToFit?.id ?? "builtToFit",
      position: builtToFit?.position ?? RANK.builtToFit,
      // ═══════════════════════════════════════════════
      // BUILT TO FIT YOUR SYSTEMS
      // Option labels: copper text only. No checkmarks.
      // ═══════════════════════════════════════════════
      node: builtToFitContent ? (
        <section
          className="integration section-pad"
          id="integration"
          style={builtToFit?.background_color ? { background: builtToFit.background_color } : undefined}
        >
          <div className="section-inner">
            <h2 className="section-h reveal">{builtToFitContent.heading}</h2>
            <p className="body-p reveal d1">{builtToFitContent.text}</p>

            <div className="io-grid">
              {builtToFitContent.cards.map((card, i) => (
                <div
                  className={`io-card reveal d${i + 1}`}
                  key={i}
                  style={builtToFitContent.card_background_color ? { background: builtToFitContent.card_background_color } : undefined}
                >
                  <div className="io-top">
                    <img src={card.photo_url} alt={card.photo_alt ?? ""} loading="lazy" />
                  </div>
                  <div className="io-body">
                    <span className="io-pill">{card.title ?? `Option ${i + 1}`}</span>
                    <h3>{card.heading}</h3>
                    <p className="io-desc">{card.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="inline-note reveal">{builtToFitContent.footnote ?? DEFAULT_BUILT_TO_FIT_FOOTNOTE}</p>
          </div>
        </section>
      ) : null,
    },
    {
      key: verificationProblem?.id ?? problemAccordion?.id ?? "verificationProblem",
      position: verificationProblem?.position ?? problemAccordion?.position ?? RANK.verificationProblem,
      node: verificationProblem || problemAccordion ? (
        <section
          className="ps-section section-pad"
          id="the-problem"
          style={verificationProblem?.background_color ? { background: verificationProblem.background_color } : undefined}
        >
          <div className="section-inner">
            <div className="ps-grid">
              {verificationProblemContent?.side === "right" ? (
                <>
                  <div className="ps-right reveal d1">
                    <h2 className="section-h">{verificationProblemContent?.heading ?? "The verification problem"}</h2>
                    <p className="ps-right-intro">
                      {verificationProblemContent?.text ??
                        "States face four systemic problems with income verification. VMI is built to address all of them — not as a data feed, but as a complete service."}
                    </p>

                    <ProductProblemAccordion content={problemAccordionContent} />
                  </div>
                  <div className="ps-visual reveal">
                    <img
                      src={verificationProblemContent?.photo_url ?? "/images/product/product-verify.png"}
                      alt={
                        verificationProblemContent?.photo_alt ??
                        "VMI data flow diagram — applicant to payroll connection to VMI validation to caseworker-ready report to state eligibility system"
                      }
                      loading="lazy"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="ps-visual reveal">
                    <img
                      src={verificationProblemContent?.photo_url ?? "/images/product/product-verify.png"}
                      alt={
                        verificationProblemContent?.photo_alt ??
                        "VMI data flow diagram — applicant to payroll connection to VMI validation to caseworker-ready report to state eligibility system"
                      }
                      loading="lazy"
                    />
                  </div>

                  <div className="ps-right reveal d1">
                    <h2 className="section-h">{verificationProblemContent?.heading ?? "The verification problem"}</h2>
                    <p className="ps-right-intro">
                      {verificationProblemContent?.text ??
                        "States face four systemic problems with income verification. VMI is built to address all of them — not as a data feed, but as a complete service."}
                    </p>

                    <ProductProblemAccordion content={problemAccordionContent} />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ) : null,
    },
    {
      key: talkCta?.id ?? "talkCta",
      position: talkCta?.position ?? RANK.talkCta,
      node: talkCta ? <ProductTalkCta content={talkCtaContent} backgroundColor={talkCta.background_color} /> : null,
    },
    {
      key: compareTable?.id ?? "compareTable",
      position: compareTable?.position ?? RANK.compareTable,
      node: compareTable ? (
        <ProductCompareTable content={compareTableContent} backgroundColor={compareTable.background_color} />
      ) : null,
    },
    {
      key: vendorQuestions?.id ?? "vendorQuestions",
      position: vendorQuestions?.position ?? RANK.vendorQuestions,
      // ═══════════════════════════════════════════════
      // QUESTIONS TO ASK — bigger bare chevrons
      // ═══════════════════════════════════════════════
      node: vendorQuestions ? (
        <ProductVendorQuestions content={vendorQuestionsContent} backgroundColor={vendorQuestions.background_color} />
      ) : null,
    },
    {
      key: accessible?.id ?? "accessible",
      position: accessible?.position ?? RANK.accessible,
      node: accessible ? (
        <section
          className="access-section"
          id="accessibility"
          style={accessible.background_color ? { background: accessible.background_color } : undefined}
        >
          {(() => {
            const textEl = (
              <div className="access-left">
                <h2 className="section-h reveal">
                  {accessibleContent?.heading ?? "Accessible by design, not as an afterthought"}
                </h2>
                <div className="body-text reveal d1">
                  {(
                    accessibleContent?.text ?? [
                      "DPW is investing in accessibility research in partnership with the AARP Foundation, with independent third-party accessibility auditing. VMI is designed to meet Section 508 and WCAG 2.1 AA accessibility standards. The platform supports English and Spanish.",
                      "We do not treat accessibility as a compliance checkbox. We are conducting original research into how income verification tools can be made usable for older adults, people with disabilities, and individuals with limited English proficiency. Findings from this research will be published and shared with the field.",
                    ]
                  ).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <div className="callout-stat reveal d2">
                  <span className="callout-stat-num">{accessibleContent?.stat_number ?? "65%"}</span>
                  <p className="callout-stat-text">
                    {accessibleContent?.stat_text ?? "of our users access VMI on a smartphone. The platform is built mobile-first."}
                  </p>
                </div>
              </div>
            );
            const photoEl = (
              <div className="access-photo reveal d2">
                <img
                  src={accessibleContent?.photo_url ?? "/images/product/centre-for-ageing-better-6S4Vx0ZHD4k-unsplash.jpg"}
                  alt={accessibleContent?.photo_alt ?? "An older adult using a cell phone to verify her income"}
                  loading="lazy"
                />
              </div>
            );
            return accessibleContent?.side === "left" ? (
              <>
                {photoEl}
                {textEl}
              </>
            ) : (
              <>
                {textEl}
                {photoEl}
              </>
            );
          })()}
        </section>
      ) : null,
    },
    {
      key: pilotSteps?.id ?? "pilotSteps",
      position: pilotSteps?.position ?? RANK.pilotSteps,
      // ═══════════════════════════════════════════════
      // THE PATH TO A PILOT — racetrack path
      // ═══════════════════════════════════════════════
      node: pilotStepsContent ? (
        <section
          className="pilot section-pad"
          id="path-to-pilot"
          style={pilotSteps?.background_color ? { background: pilotSteps.background_color } : undefined}
        >
          <div className="section-inner">
            <h2 className="section-h reveal">{pilotStepsContent.heading ?? DEFAULT_PILOT_HEADING}</h2>

            <div className="steps reveal d1">
              <div className="steps-line" aria-hidden="true"></div>

              {pilotStepsContent.steps.map((step, i) => (
                <div className={`step reveal d${i + 1}`} key={i}>
                  <div className="step-badge" aria-hidden="true">
                    <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="step-lbl">Step</span>
                  </div>
                  <div className="step-content">
                    <h3>{step.heading}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="inline-note pilot-note reveal">{pilotStepsContent.footnote ?? DEFAULT_PILOT_FOOTNOTE}</p>
          </div>
        </section>
      ) : null,
    },
    {
      key: inTheField?.id ?? "inTheField",
      position: inTheField?.position ?? RANK.inTheField,
      node: inTheField ? (
        <section
          className="field section-pad"
          id="in-the-field"
          style={inTheField?.background_color ? { background: inTheField.background_color } : undefined}
        >
          <div className="section-inner">
            <h2 className="section-h reveal">{(inTheField.content as CaseStudyContent).heading ?? "In the field"}</h2>
            <CaseStudy content={inTheField.content as CaseStudyContent} />
          </div>
        </section>
      ) : null,
    },
    {
      key: bottomCta?.id ?? "bottomCta",
      position: bottomCta?.position ?? RANK.bottomCta,
      node: bottomCta ? <Cta content={bottomCtaContent} backgroundColor={bottomCta.background_color} /> : null,
    },
    ...extraSections.map((section) => ({
      key: section.id,
      position: section.position,
      node: <SectionRenderer sections={[section]} />,
    })),
  ];

  blocks.sort((a, b) => a.position - b.position);

  return (
    <div className="page-product">
      <ProductAccordion />

      {blocks.map((block) => (
        <Fragment key={block.key}>{block.node}</Fragment>
      ))}
    </div>
  );
}
