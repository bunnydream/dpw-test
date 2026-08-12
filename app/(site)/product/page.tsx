import Link from "next/link";
import type { Metadata } from "next";
import ProductAccordion from "@/components/ProductAccordion";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import CaseStudy, { type CaseStudyContent } from "@/components/blocks/CaseStudy";
import "./product.css";

export const metadata: Metadata = {
  title: "Verify My Income — Digital Public Works",
};

type ContentCardsContent = {
  heading: string;
  text: string;
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
  steps: {
    heading: string;
    description: string;
  }[];
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
  const pilotSteps = byType(sections, "steps")[0];
  const inTheField = byType(sections, "case-study")[0];

  const builtToFitContent = builtToFit?.content as ContentCardsContent | undefined;
  const verificationProblemContent = verificationProblem?.content as ProblemPhotoTextContent | undefined;
  const accessibleContent = accessible?.content as AccessPhotoTextContent | undefined;
  const pilotStepsContent = pilotSteps?.content as PilotStepsContent | undefined;

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

            <p className="inline-note reveal">
              Each state deployment is white-labeled and configured to match the state&apos;s branding, communication
              preferences, and data requirements. Income reports are delivered via SFTP, S3, encrypted email, or
              webhooks API to fit existing state infrastructure.
            </p>
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

              <div className="ps-acc-list">
                <div className="ps-acc-item">
                  <button className="ps-acc-trigger" aria-expanded="true" aria-controls="ps-1">
                    <span className="ps-acc-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 6H20M4 12H20M4 18H11"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                        />
                        <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M17 18H18V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="ps-acc-title">No verification layer</span>
                    <span className="ps-acc-chevron" aria-hidden="true">
                      <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                        <path
                          d="M1 1L7 7L13 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div className="ps-acc-panel" id="ps-1">
                    <p className="ps-acc-problem">
                      States receive raw data from commercial databases or paper documents, but have no service layer
                      to validate, contextualize, and deliver that data in a format caseworkers can act on
                      immediately. The result: follow-up calls, manual processing, and delayed enrollment.
                    </p>
                    <div className="ps-acc-solution">
                      <span className="ps-acc-sol-label">How VMI solves it</span>
                      VMI handles the entire data journey: consent management, payroll connection, data validation,
                      QA review, and delivery of a standardized income report to the caseworker. States get a
                      complete service, not just a data feed.
                    </div>
                  </div>
                </div>

                <div className="ps-acc-item">
                  <button className="ps-acc-trigger" aria-expanded="false" aria-controls="ps-2">
                    <span className="ps-acc-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
                        <path
                          d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="ps-acc-title">Burden on caseworkers</span>
                    <span className="ps-acc-chevron" aria-hidden="true">
                      <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                        <path
                          d="M1 1L7 7L13 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div className="ps-acc-panel" id="ps-2" hidden>
                    <p className="ps-acc-problem">
                      When electronic verification fails, caseworkers must manually process documents, make follow-up
                      calls, and request additional information from applicants.
                    </p>
                    <div className="ps-acc-solution">
                      <span className="ps-acc-sol-label">How VMI solves it</span>
                      93% of caseworkers find VMI&apos;s income reports just as easy or easier to use than existing
                      methods. Every report goes through data validation and sufficiency checks before it reaches a
                      caseworker. Fewer follow-up calls. Less manual data entry.
                    </div>
                  </div>
                </div>

                <div className="ps-acc-item">
                  <button className="ps-acc-trigger" aria-expanded="false" aria-controls="ps-3">
                    <span className="ps-acc-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
                        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="ps-acc-title">Time tax on applicants</span>
                    <span className="ps-acc-chevron" aria-hidden="true">
                      <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                        <path
                          d="M1 1L7 7L13 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div className="ps-acc-panel" id="ps-3" hidden>
                    <p className="ps-acc-problem">
                      People are required to track down pay stubs, print forms, and submit documents to prove their
                      income. Access to benefits is delayed by days or weeks.
                    </p>
                    <div className="ps-acc-solution">
                      <span className="ps-acc-sol-label">How VMI solves it</span>
                      Applicants verify income in under 5 minutes. No documents to find or upload. 85% of applicants
                      report no difficulty completing the process.
                    </div>
                  </div>
                </div>

                <div className="ps-acc-item">
                  <button className="ps-acc-trigger" aria-expanded="false" aria-controls="ps-4">
                    <span className="ps-acc-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M9 3V18M15 6V21" stroke="currentColor" strokeWidth="1.75" />
                      </svg>
                    </span>
                    <span className="ps-acc-title">Raw data is not verification</span>
                    <span className="ps-acc-chevron" aria-hidden="true">
                      <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                        <path
                          d="M1 1L7 7L13 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div className="ps-acc-panel" id="ps-4" hidden>
                    <p className="ps-acc-problem">
                      Payroll aggregators can connect to employer systems and pull income records. But raw aggregator
                      data frequently lacks the information caseworkers need, including missing pay dates, no gross
                      pay amounts, or no hours data. Without a verification layer, incomplete records reach the
                      caseworker and drive errors.
                    </p>
                    <div className="ps-acc-solution">
                      <span className="ps-acc-sol-label">How VMI solves it</span>
                      Every aggregator response passes through VMI&apos;s validation layer before any data reaches a
                      state agency. Reports that do not meet eligibility-grade standards are rejected, and the
                      applicant is routed to an alternative. States receive only verified, caseworker-ready data.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TALK TO US CTA BANNER */}
      <div className="talk-cta">
        <svg
          className="talk-cta-lines"
          aria-hidden="true"
          preserveAspectRatio="none"
          viewBox="0 0 1440 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* upper left: stacked diagonal lines */}
          <line x1="0" y1="0" x2="120" y2="160" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" />
          <line x1="40" y1="0" x2="160" y2="160" stroke="rgba(255,255,255,0.10)" strokeWidth="3.5" />
          {/* bottom right: stacked diagonal lines (mirror) */}
          <line x1="1320" y1="0" x2="1440" y2="160" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" />
          <line x1="1280" y1="0" x2="1400" y2="160" stroke="rgba(255,255,255,0.10)" strokeWidth="3.5" />
        </svg>
        <div className="talk-cta-inner">
          <Link href="/contact" className="talk-cta-heading">
            Bring <i>VMI</i> to your state →
          </Link>
          <p className="talk-cta-sub">Learn about piloting with Digital Public Works</p>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <section className="compare-full section-pad" id="comparison">
        <div className="section-inner">
          <h2 className="section-h reveal">Traditional Approaches vs. VMI</h2>
          <div className="ct-wrap reveal d1">
            <table className="ct" aria-label="Traditional approaches vs. VMI comparison">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">
                    <span className="ct-x-badge" aria-hidden="true">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    Traditional Approaches
                  </th>
                  <th scope="col" className="vmi-head">
                    <span className="ct-check-badge" aria-hidden="true">
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                          d="M1 4.5L4 7.5L10 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    VMI — Digital Public Works
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ct-dim">What you get</td>
                  <td className="ct-them">
                    A data connection, a bundled add-on to a larger contract, or a commercial product. The state
                    fills the gaps.
                  </td>
                  <td className="ct-vmi">
                    A complete verification service. Consent, benefits-specific data validation, and caseworker-ready
                    reports included.
                  </td>
                </tr>
                <tr>
                  <td className="ct-dim">Pricing</td>
                  <td className="ct-them">
                    Commercial pricing that rises over time. Some vendors bundle verification into larger contracts,
                    hiding the true cost.
                  </td>
                  <td className="ct-vmi">Nonprofit, at cost. Price decreases as more states join the platform.</td>
                </tr>
                <tr>
                  <td className="ct-dim">Data quality</td>
                  <td className="ct-them">
                    Raw data delivered as-is. No validation against program requirements. Incomplete or unusable
                    records reach caseworkers.
                  </td>
                  <td className="ct-vmi">
                    Every report passes through programmatic validation. Reports that do not meet eligibility-grade
                    standards are rejected and applicants are redirected to existing options.
                  </td>
                </tr>
                <tr>
                  <td className="ct-dim">Open source</td>
                  <td className="ct-them">Proprietary. No visibility into how the system works.</td>
                  <td className="ct-vmi">Full codebase published under AGPL-3.0 on GitHub.</td>
                </tr>
                <tr>
                  <td className="ct-dim">Vendor lock-in</td>
                  <td className="ct-them">
                    High. Switching vendors means rebuilding. Some states are locked into multi-year contracts with
                    no exit path.
                  </td>
                  <td className="ct-vmi">
                    None. If DPW ceased to exist, states retain full access to the code, architecture, and
                    documentation.
                  </td>
                </tr>
                <tr>
                  <td className="ct-dim">Accessibility</td>
                  <td className="ct-them">
                    State inherits responsibility for all embedded components, including third-party interfaces it
                    does not control.
                  </td>
                  <td className="ct-vmi">
                    WCAG 2.1 AA commitment with independent third-party auditing funded by AARP Foundation.
                  </td>
                </tr>
                <tr>
                  <td className="ct-dim">Service model</td>
                  <td className="ct-them">Per-verification billing regardless of eligibility value.</td>
                  <td className="ct-vmi">
                    Embedded partnership: discovery sprints, case reviews, ongoing service design, and workflow
                    improvement.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          QUESTIONS TO ASK — bigger bare chevrons
          ═══════════════════════════════════════════════ */}
      <section className="vendor-q section-pad" id="vendor-questions">
        <div className="section-inner">
          <h2 className="section-h reveal">Questions to Ask Any Income Verification Vendor</h2>

          <div className="vq-list reveal d1">
            <div className="vq-item">
              <button className="vq-trigger" aria-expanded="false" aria-controls="vq-1">
                <span className="vq-q">What is the total cost of ownership?</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path
                      d="M1 1L6.5 6.5L12 1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id="vq-1" hidden>
                <p className="vq-a">
                  Ask for the full picture, not just the per-verification price. Will you separately fund UX design,
                  consent infrastructure, eligibility logic, security authorization, accessibility compliance, and
                  ongoing maintenance?
                </p>
              </div>
            </div>

            <div className="vq-item">
              <button className="vq-trigger" aria-expanded="false" aria-controls="vq-2">
                <span className="vq-q">Who is responsible for accessibility compliance?</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path
                      d="M1 1L6.5 6.5L12 1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id="vq-2" hidden>
                <p className="vq-a">
                  If the product embeds third-party login interfaces or components the vendor does not control, who
                  remediates accessibility failures in those components? VMI&apos;s accessibility is independently
                  audited by a third party, funded by AARP Foundation.
                </p>
              </div>
            </div>

            <div className="vq-item">
              <button className="vq-trigger" aria-expanded="false" aria-controls="vq-3">
                <span className="vq-q">Is there a data validation layer?</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path
                      d="M1 1L6.5 6.5L12 1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id="vq-3" hidden>
                <p className="vq-a">
                  Raw payroll data is not always usable for eligibility determinations. What happens when a report is
                  missing pay dates, gross pay, or hours data? After login, what happens if accounts are completely
                  empty or the most recent pay date is 5 years old? Does the product catch that and redirect the
                  client before it reaches a caseworker, or does the caseworker find out? VMI blocks reports that do
                  not meet program-specific quality standards and redirects applicants to existing verification
                  options.
                </p>
              </div>
            </div>

            <div className="vq-item">
              <button className="vq-trigger" aria-expanded="false" aria-controls="vq-4">
                <span className="vq-q">What happens if you need to switch vendors?</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path
                      d="M1 1L6.5 6.5L12 1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id="vq-4" hidden>
                <p className="vq-a">
                  Can you take the code, the architecture, and the documentation with you? Or do you start over? VMI
                  is open source under AGPL-3.0. The full codebase is published on GitHub.
                </p>
              </div>
            </div>

            <div className="vq-item">
              <button className="vq-trigger" aria-expanded="false" aria-controls="vq-5">
                <span className="vq-q">How does pricing change as usage scales?</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path
                      d="M1 1L6.5 6.5L12 1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id="vq-5" hidden>
                <p className="vq-a">
                  Does the per-unit cost go up with volume, stay flat, or go down? VMI is operated at cost by a
                  nonprofit. Per-state costs decrease as more states join the platform{" "}
                  <em>regardless of whether an individual state&apos;s own volume increases</em>.
                </p>
              </div>
            </div>

            <div className="vq-item">
              <button className="vq-trigger" aria-expanded="false" aria-controls="vq-6">
                <span className="vq-q">Can you switch data providers without rebuilding?</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path
                      d="M1 1L6.5 6.5L12 1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id="vq-6" hidden>
                <p className="vq-a">
                  VMI sits above the data layer — states integrate once with the platform, not with individual data
                  providers. If a payroll aggregator raises prices or drops in quality, VMI can swap them out and
                  absorb the normalization work. The state&apos;s integration never changes.
                </p>
              </div>
            </div>

            <div className="vq-item">
              <button className="vq-trigger" aria-expanded="false" aria-controls="vq-7">
                <span className="vq-q">What implementation support is included?</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path
                      d="M1 1L6.5 6.5L12 1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id="vq-7" hidden>
                <p className="vq-a">
                  Does the vendor deliver data and walk away, or embed with your team? VMI engagements include
                  discovery sprints, caseworker and applicant interviews, case review analysis, and ongoing service
                  design improvements throughout the partnership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <h2 className="section-h reveal">The path to a pilot</h2>

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

            <p className="inline-note pilot-note reveal">
              Pennsylvania launched in six weeks from kickoff to go-live and scaled to statewide availability eight
              weeks later. DPW moves at the speed of the state&apos;s capacity. Tightly scoped integrations can launch
              in as little as four weeks; broader engagements typically take 8 to 12.
            </p>
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
      <div className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-h reveal">
            See the difference <i>Verify My Income</i> makes for families and state systems
          </h2>
          <Link href="/impact" className="btn btn-white reveal d1">
            See our impact
          </Link>
        </div>
      </div>
    </div>
  );
}
