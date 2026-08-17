import type { Metadata } from "next";
import ProductAccordion from "@/components/ProductAccordion";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import CaseStudy, { type CaseStudyContent } from "@/components/blocks/CaseStudy";
import Cta, { type CtaContent } from "@/components/blocks/Cta";
import ProductProblemAccordion, { type ProductProblemAccordionContent } from "@/components/blocks/ProductProblemAccordion";
import ProductTalkCta, { type ProductTalkCtaContent } from "@/components/blocks/ProductTalkCta";
import ProductCompareTable, { type ProductCompareTableContent } from "@/components/blocks/ProductCompareTable";
import ProductVendorQuestions, { type ProductVendorQuestionsContent } from "@/components/blocks/ProductVendorQuestions";
import "./product.css";

export const metadata: Metadata = {
  title: "Verify My Income — Digital Public Works",
};

type ContentCardsContent = {
  heading: string;
  text: string;
  footnote?: string | null;
  cards: {
    heading: string;
    text: string;
    photo_url: string;
    photo_alt?: string | null;
  }[];
};

type ProblemPhotoTextContent = {
  heading: string;
  text: string;
  photo_url: string;
  photo_alt?: string | null;
};

type AccessPhotoTextContent = {
  heading: string;
  text: string[];
  photo_url: string;
  photo_alt?: string | null;
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

export default async function ProductPage() {
  const result = await getPageSections("product");
  const sections = result?.sections ?? [];

  const hero = byType(sections, "hero")[0];
  const builtToFit = byType(sections, "content-cards")[0];
  const photoTextSections = byType(sections, "photo-text");
  const verificationProblem = photoTextSections[0];
  const accessible = photoTextSections[1];
  const problemAccordion = byType(sections, "product-problem-accordion")[0];
  const talkCta = byType(sections, "product-talk-cta")[0];
  const compareTable = byType(sections, "product-compare-table")[0];
  const vendorQuestions = byType(sections, "product-vendor-questions")[0];
  const pilotSteps = byType(sections, "steps")[0];
  const inTheField = byType(sections, "case-study")[0];
  const bottomCta = byType(sections, "cta")[0];

  const builtToFitContent = builtToFit?.content as ContentCardsContent | undefined;
  const verificationProblemContent = verificationProblem?.content as ProblemPhotoTextContent | undefined;
  const accessibleContent = accessible?.content as AccessPhotoTextContent | undefined;
  const pilotStepsContent = pilotSteps?.content as PilotStepsContent | undefined;

  const problemAccordionContent = (problemAccordion?.content as ProductProblemAccordionContent | undefined) ?? DEFAULT_PROBLEM_ACCORDION;
  const talkCtaContent = (talkCta?.content as ProductTalkCtaContent | undefined) ?? DEFAULT_TALK_CTA;
  const compareTableContent = (compareTable?.content as ProductCompareTableContent | undefined) ?? DEFAULT_COMPARE_TABLE;
  const vendorQuestionsContent = (vendorQuestions?.content as ProductVendorQuestionsContent | undefined) ?? DEFAULT_VENDOR_QUESTIONS;
  const bottomCtaContent = (bottomCta?.content as CtaContent | undefined) ?? DEFAULT_BOTTOM_CTA;

  return (
    <div className="page-product">
      <ProductAccordion />

      {/* HERO */}
      {hero ? (
        <Hero
          content={hero.content as HeroContent}
          backgroundColor={hero.background_color}
          subtitleLayout="stack"
          primaryButtonStyle={{ marginTop: "8px" }}
        />
      ) : null}

      {/* ═══════════════════════════════════════════════
          BUILT TO FIT YOUR SYSTEMS
          Option labels: copper text only. No checkmarks.
          ═══════════════════════════════════════════════ */}
      {builtToFitContent ? (
        <section className="integration section-pad" id="integration">
          <div className="section-inner">
            <h2 className="section-h reveal">{builtToFitContent.heading}</h2>
            <p className="body-p reveal d1">{builtToFitContent.text}</p>

            <div className="io-grid">
              {builtToFitContent.cards.map((card, i) => (
                <div className={`io-card reveal d${i + 1}`} key={i}>
                  <div className="io-top">
                    <img src={card.photo_url} alt={card.photo_alt ?? ""} loading="lazy" />
                  </div>
                  <div className="io-body">
                    <span className="io-pill">Option {i + 1}</span>
                    <h3>{card.heading}</h3>
                    <p className="io-desc">{card.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="inline-note reveal">{builtToFitContent.footnote ?? DEFAULT_BUILT_TO_FIT_FOOTNOTE}</p>
          </div>
        </section>
      ) : null}

      {/* THE VERIFICATION PROBLEM */}
      <section className="ps-section section-pad" id="the-problem">
        <div className="section-inner">
          <div className="ps-grid">
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
          </div>
        </div>
      </section>

      {/* TALK TO US CTA BANNER */}
      <ProductTalkCta content={talkCtaContent} />

      {/* COMPARISON TABLE */}
      <ProductCompareTable content={compareTableContent} />

      {/* ═══════════════════════════════════════════════
          QUESTIONS TO ASK — bigger bare chevrons
          ═══════════════════════════════════════════════ */}
      <ProductVendorQuestions content={vendorQuestionsContent} />

      {/* ACCESSIBLE BY DESIGN */}
      <section className="access-section" id="accessibility">
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
            <span className="callout-stat-num">65%</span>
            <p className="callout-stat-text">of our users access VMI on a smartphone. The platform is built mobile-first.</p>
          </div>
        </div>
        <div className="access-photo reveal d2">
          <img
            src={accessibleContent?.photo_url ?? "/images/product/centre-for-ageing-better-6S4Vx0ZHD4k-unsplash.jpg"}
            alt={accessibleContent?.photo_alt ?? "An older adult using a cell phone to verify her income"}
            loading="lazy"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          THE PATH TO A PILOT — racetrack path
          ═══════════════════════════════════════════════ */}
      {pilotStepsContent ? (
        <section className="pilot section-pad" id="path-to-pilot">
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
      ) : null}

      {/* IN THE FIELD */}
      {inTheField ? (
        <section className="field section-pad" id="in-the-field">
          <div className="section-inner">
            <h2 className="section-h reveal">In the field</h2>
            <CaseStudy content={inTheField.content as CaseStudyContent} />
          </div>
        </section>
      ) : null}

      {/* IMPACT CTA */}
      <Cta content={bottomCtaContent} backgroundColor={bottomCta?.background_color} />
    </div>
  );
}
