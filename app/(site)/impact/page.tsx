import Link from "next/link";
import type { Metadata } from "next";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import Voices, { type VoicesContent } from "@/components/blocks/Voices";
import CaseStudy, { type CaseStudyContent } from "@/components/blocks/CaseStudy";
import type { PhotoTextContent } from "@/components/blocks/PhotoText";
import "./impact.css";

export const metadata: Metadata = {
  title: "Impact — Digital Public Works",
};

function byType(sections: Section[], type: Section["type"]) {
  return sections.filter((s) => s.type === type);
}

export default async function ImpactPage() {
  const result = await getPageSections("impact");
  const sections = result?.sections ?? [];

  const hero = byType(sections, "hero")[0];
  const families = byType(sections, "photo-text")[0];
  const familiesContent = families?.content as PhotoTextContent | undefined;
  const voices = byType(sections, "voices")[0];
  const deployed = byType(sections, "case-study")[0];

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

      {/* ─── 2. METRICS ─── */}
      <div className="stat-row" role="list">
        <div className="stat-cell reveal d1" role="listitem">
          <span className="stat-num">56%</span>
          <span className="stat-label">
            Application completion rate in recent statewide pilot, vs. 20–40% industry standard
          </span>
        </div>

        <div className="stat-cell reveal d2" role="listitem">
          <span className="stat-num">100%</span>
          <span className="stat-label">Of reports provide real-time data from linked payroll systems</span>
        </div>

        <div className="stat-cell reveal d3" role="listitem">
          <span className="stat-num">90%</span>
          <span className="stat-label">Of reports include a paystub from the last 14 days</span>
        </div>

        <div className="stat-cell reveal d4" role="listitem">
          <span className="stat-num">Under 5 min</span>
          <span className="stat-label">Median verification time, vs. 45 minutes for manual document submission</span>
        </div>
      </div>

      {/* ─── 3. FAMILIES + COMPARISON ───
          Rendered inline rather than via the shared PhotoText component: this
          section's classNames (families-img / families-right) differ from
          home's pressure/model pattern that PhotoText.tsx implements, and it
          has no pullquote but does have a fixed .comp-card widget that isn't
          part of admin's photo-text field shape at all. */}
      <section className="families">
        {/* Left: full-bleed image */}
        <div className="families-img">
          <img
            src={familiesContent?.photo_url ?? "/images/impact/khaled-ali-e8ZJeTnfP6U-unsplash.jpg"}
            alt={familiesContent?.photo_alt ?? "A woman looking at her phone"}
            loading="lazy"
          />
        </div>

        {/* Right: content */}
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

          {/* COMPARISON CARD: Manual left, VMI right — fixed chrome, not part of admin's photo-text shape */}
          <div className="comp-card reveal d2">
            <div className="comp-header">
              <div className="comp-col-head comp-col-head--manual">
                <div className="comp-col-dot comp-col-dot--al"></div>
                Manual process
              </div>
              <div className="comp-col-head comp-col-head--vmi">
                <div className="comp-col-dot comp-col-dot--vg"></div>
                With Verify My Income
              </div>
            </div>

            <div className="comp-row">
              <div className="comp-cell comp-cell--manual">
                <div className="comp-dot comp-dot--al"></div>
                <p>Find old pay stubs, print forms, and visit a benefits office in person</p>
              </div>
              <div className="comp-cell comp-cell--vmi">
                <div className="comp-dot comp-dot--vg"></div>
                <p>Receive a secure link and connect payroll in minutes, from any device</p>
              </div>
            </div>

            <div className="comp-row">
              <div className="comp-cell comp-cell--manual">
                <div className="comp-dot comp-dot--al"></div>
                <p>Wait days or weeks for a caseworker to manually review documents</p>
              </div>
              <div className="comp-cell comp-cell--vmi">
                <div className="comp-dot comp-dot--vg"></div>
                <p>Verified income report delivered to caseworker in under 5 minutes</p>
              </div>
            </div>

            <div className="comp-row">
              <div className="comp-cell comp-cell--manual">
                <div className="comp-dot comp-dot--al"></div>
                <p>Restart the process from scratch if anything is missing or wrong</p>
              </div>
              <div className="comp-cell comp-cell--vmi">
                <div className="comp-dot comp-dot--vg"></div>
                <p>No documents to find, no follow-up calls, no delays</p>
              </div>
            </div>

            <div className="comp-row">
              <div className="comp-cell comp-cell--manual">
                <div className="comp-dot comp-dot--al"></div>
                <p>Stale quarterly wage data or documents that may be rejected</p>
              </div>
              <div className="comp-cell comp-cell--vmi">
                <div className="comp-dot comp-dot--vg"></div>
                <p>Real-time payroll data, programmatically validated before delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. VOICES CAROUSEL ─── */}
      {voices ? <Voices content={voices.content as VoicesContent} backgroundColor={voices.background_color} /> : null}

      {/* ─── 5. DEPLOYED AND DELIVERING RESULTS ─── */}
      <section className="field section-pad" id="deployed">
        <div className="section-inner">
          <h2 className="section-h reveal">Deployed and delivering results</h2>
          {deployed ? <CaseStudy content={deployed.content as CaseStudyContent} /> : null}
        </div>
      </section>

      {/* ─── 6. YEAR IN REVIEW ─── */}
      <section className="annual section-pad" id="annual-report">
        <div className="section-inner annual-inner">
          <div>
            <h2 className="section-h reveal">Year in review</h2>
            <p className="body-p reveal d1">
              Read our annual report to learn how DPW went from zero to one: from founding to production in two
              states.
            </p>
            {/* NOTE: Replace href="#" with final PDF link before launch */}
            <a href="#" className="btn btn-forge reveal d2">
              Read the 2025 Annual Report <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="annual-visual reveal d2">
            <div className="report-book">
              <span>Annual Report</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FUNDING MODEL ─── */}
      <section className="funding section-pad" id="funding-model">
        <div className="section-inner">
          <h2 className="section-h reveal">How philanthropic investment creates public value</h2>
          <p className="body-p reveal d1">
            DPW&apos;s model is built for the long term. As states move from pilots to paid contracts, earned revenue
            from per-verification pricing covers a growing share of operating costs.
          </p>

          <div className="content-card-grid">
            <div className="content-card reveal d1">
              <div className="content-card-accent"></div>
              <div className="content-card-body">
                <span className="content-card-icon" aria-hidden="true">
                  {/* Gift box icon */}
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="22" height="4" rx="1" />
                    <rect x="5" y="15" width="18" height="10" rx="1" />
                    <line x1="14" y1="11" x2="14" y2="25" />
                    <path d="M14 11C14 11 11 5 8 6C6 7 7 11 14 11Z" />
                    <path d="M14 11C14 11 17 5 20 6C22 7 21 11 14 11Z" />
                  </svg>
                </span>
                <h4>Free to try</h4>
                <p>
                  Philanthropic investment funds free pilots and platform development. States can experience the
                  full VMI service — service design, integration planning, and hands-on support — at no cost.
                </p>
              </div>
            </div>

            <div className="content-card reveal d2">
              <div className="content-card-accent"></div>
              <div className="content-card-body">
                <span className="content-card-icon" aria-hidden="true">
                  {/* Downward trending arrow icon */}
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="4,8 10,14 16,10 24,20" />
                    <polyline points="19,20 24,20 24,15" />
                  </svg>
                </span>
                <h4>Lower prices over time</h4>
                <p>
                  Because DPW operates at cost with no profit margin, every efficiency gain passes through to state
                  partners as lower prices. The price of income verification goes down over time, not up.
                </p>
              </div>
            </div>

            <div className="content-card reveal d3">
              <div className="content-card-accent"></div>
              <div className="content-card-body">
                <span className="content-card-icon" aria-hidden="true">
                  {/* Open lock icon */}
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="13" width="18" height="13" rx="2" />
                    <path d="M9 13V8C9 5.2 11.2 3 14 3C16.8 3 19 5.2 19 8V8" />
                    <circle cx="14" cy="19" r="2" fill="none" />
                    <line x1="14" y1="21" x2="14" y2="24" />
                  </svg>
                </span>
                <h4>Open source forever</h4>
                <p>
                  VMI is open source. The public investment in this infrastructure is permanently protected from
                  privatization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHTS CTA */}
      <div className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-h reveal">Read our research on accessibility</h2>
          <Link href="/insights" className="btn btn-white reveal d1">
            Read our insights
          </Link>
        </div>
      </div>
    </div>
  );
}
