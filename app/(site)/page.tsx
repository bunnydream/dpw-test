import Link from "next/link";
import HowStepsProgress from "@/components/HowStepsProgress";
import { getPageSections, type Section } from "@/lib/sections";
import Hero, { type HeroContent } from "@/components/blocks/Hero";
import Stats, { type StatsContent } from "@/components/blocks/Stats";
import PhotoText, { type PhotoTextContent } from "@/components/blocks/PhotoText";
import Steps, { type StepsContent } from "@/components/blocks/Steps";
import Voices, { type VoicesContent } from "@/components/blocks/Voices";
import Partners, { type PartnersContent } from "@/components/blocks/Partners";
import Cta, { type CtaContent } from "@/components/blocks/Cta";
import "./home.css";

function byType(sections: Section[], type: Section["type"]) {
  return sections.filter((s) => s.type === type);
}

export default async function HomePage() {
  const result = await getPageSections("home");
  const sections = result?.sections ?? [];

  const hero = byType(sections, "hero")[0];
  const stats = byType(sections, "stats")[0];
  const photoTextSections = byType(sections, "photo-text");
  const pressure = photoTextSections[0];
  const model = photoTextSections[1];
  const steps = byType(sections, "steps")[0];
  const voices = byType(sections, "voices")[0];
  const partners = byType(sections, "partners")[0];
  const cta = byType(sections, "cta")[0];

  return (
    <div className="page-home">
      {/* HERO */}
      {hero ? <Hero content={hero.content as HeroContent} backgroundColor={hero.background_color} /> : null}

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

      {/* COMPARISON TEASER */}
      <section className="compare-teaser">
        <div className="compare-teaser-inner">
          <div className="ct-header reveal">
            <h2 style={{ fontSize: "clamp(28px, 3vw, 36px)" }}>
              At a glance: how <i>Verify My Income</i> compares
            </h2>
            <Link href="/product#comparison" className="btn btn-outline">
              See the full comparison
            </Link>
          </div>
          <div className="ct-wrap reveal d1">
            <table className="ct" aria-label="VMI vs. traditional approaches comparison">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Traditional Approaches</th>
                  <th scope="col" className="vmi-head">
                    VMI — Digital Public Works
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="ct-dim">Pricing</td>
                  <td className="ct-them">Per-query, rising over time</td>
                  <td className="ct-vmi">
                    <CheckIcon />
                    Nonprofit, at-cost. Price falls as more states join.
                  </td>
                </tr>
                <tr>
                  <td className="ct-dim">Data quality</td>
                  <td className="ct-them">Raw data, no validation</td>
                  <td className="ct-vmi">
                    <CheckIcon />
                    Every report programmatically validated
                  </td>
                </tr>
                <tr>
                  <td className="ct-dim">Source code</td>
                  <td className="ct-them">Proprietary</td>
                  <td className="ct-vmi">
                    <CheckIcon />
                    Open source under AGPL-3.0
                  </td>
                </tr>
                <tr>
                  <td className="ct-dim">Vendor lock-in</td>
                  <td className="ct-them">High — no exit path</td>
                  <td className="ct-vmi">
                    <CheckIcon />
                    None. Full code and architecture access.
                  </td>
                </tr>
                <tr>
                  <td className="ct-dim">Service model</td>
                  <td className="ct-them">Data hand-off</td>
                  <td className="ct-vmi">
                    <CheckIcon />
                    Embedded partnership and service design
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRESSURE */}
      {pressure ? (
        <PhotoText
          content={pressure.content as PhotoTextContent}
          backgroundColor={pressure.background_color}
          pullquoteTag="div"
          id="pressure"
          imgWidth={1400}
          imgHeight={1050}
        >
          <Link href="/contact" className="btn btn-forge reveal d3">
            Request a demo
          </Link>
        </PhotoText>
      ) : null}

      {/* HOW IT WORKS */}
      <section className="how" id="how-vmi-works">
        <div className="how-inner">
          <h2 className="section-h reveal">
            How <i>Verify My Income</i> works
          </h2>
          <p className="body-p reveal d1">
            VMI handles the entire data journey from the applicant&apos;s payroll provider, through a consent-driven
            workflow, to a caseworker-ready report. States get a complete service, not just a data feed.
          </p>

          <div className="how-cols">
            <div className="how-left">
              {steps ? <Steps content={steps.content as StepsContent} /> : null}
            </div>

            <div className="how-right reveal d2">
              <img src="/images/home/home-howVMIworks.png" alt="How VMI works diagram" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
      <HowStepsProgress />

      {/* STORIES */}
      <section className="stories">
        <div className="stories-inner">
          <h2 className="section-h reveal">
            We do not just deliver data.
            <br /> We fix the process.
          </h2>
          <p className="body-p reveal d1">
            Most verification vendors hand off data and walk away. DPW embeds with your team to find and fix the
            problems no data feed can solve.
          </p>

          <div className="content-card-grid">
            <div className="content-card reveal d1">
              <div className="content-card-accent"></div>
              <div className="content-card-body">
                <div className="content-card-icon" aria-hidden="true">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <span className="content-card-label">Finding 1</span>
                <h4>A form question that created unnecessary work</h4>
                <p>
                  In one state, the application asked for a specific number of hours worked rather than a range.
                  When paystubs showed normal week-to-week variation, caseworkers were forced to issue unnecessary
                  Requests for Information. DPW recommended changing the question to ask for a range — eliminating
                  RFIs caused by a form-wording problem that had nothing to do with data access.
                </p>
              </div>
            </div>
            <div className="content-card reveal d2">
              <div className="content-card-accent"></div>
              <div className="content-card-body">
                <div className="content-card-icon" aria-hidden="true">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </div>
                <span className="content-card-label">Finding 2</span>
                <h4>40% of applicants did not know they had a next step</h4>
                <p>
                  In another state, approximately 40% of SNAP renewal applicants were not submitting required income
                  documents because they did not realize they needed to. DPW worked with the state to add a clear
                  alert on the post-submission page. The result: a 35% increase in income document submissions
                  across all verification methods, not just VMI.
                </p>
              </div>
            </div>
            <div className="content-card reveal d3">
              <div className="content-card-accent"></div>
              <div className="content-card-body">
                <div className="content-card-icon" aria-hidden="true">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="1 4 1 10 7 10" />
                    <polyline points="23 20 23 14 17 14" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                  </svg>
                </div>
                <span className="content-card-label">Finding 3</span>
                <h4>Caseworkers were over-verifying without realizing it</h4>
                <p>
                  DPW&apos;s case review analysis found caseworkers frequently requesting household composition
                  verification at unnecessary steps in the benefit lifecycle. After DPW flagged this pattern, a
                  policy bulletin was published clarifying when such requests were appropriate — reducing burden on
                  both applicants and staff.
                </p>
              </div>
            </div>
          </div>

          <p className="inline-note reveal d4">
            Every state engagement includes a discovery sprint with interviews of policy experts, caseworkers,
            quality control workers, community organizations, and applicants. These are not one-time exercises. DPW
            conducts ongoing case reviews, feedback analysis, and service design improvements throughout the
            partnership.
          </p>
        </div>
      </section>

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

      {/* QUOTES CAROUSEL */}
      {voices ? <Voices content={voices.content as VoicesContent} backgroundColor={voices.background_color} /> : null}

      {/* FUNDERS */}
      {partners ? (
        <Partners content={partners.content as PartnersContent} backgroundColor={partners.background_color} />
      ) : null}

      {/* PILOT CTA */}
      {cta ? (
        <Cta content={cta.content as CtaContent} backgroundColor={cta.background_color}>
          <p className="cta-sub reveal d1">No procurement required to begin the conversation.</p>
        </Cta>
      ) : null}
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="ct-check" aria-hidden="true">
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
        <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
