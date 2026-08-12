import Link from "next/link";
import VoicesCarousel from "@/components/VoicesCarousel";
import HowStepsProgress from "@/components/HowStepsProgress";
import "./home.css";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left reveal">
          <h1>What if income verification worked for families and states instead of vendors?</h1>
          <p className="hero-sub">
            Digital Public Works is the nonprofit alternative. We built <i>Verify My Income</i> because families
            deserve a better experience — and states deserve a partner that isn&apos;t charging per query while the
            backlog grows. Open source. At cost. No lock-in.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="btn btn-forge">
              Request a demo
            </Link>
            <a href="#how-vmi-works" className="btn btn-outline">
              See how it works
            </a>
          </div>
          <p className="hero-note" style={{ fontSize: "15px" }}>
            No procurement required to begin the conversation. We start with a free, philanthropically funded pilot.
          </p>
        </div>

        <div className="hero-img reveal d2">
          <img
            src="/images/home/oosman-exptal-2_lHgY_ZvQo-unsplash.jpg"
            alt="Person holding a baby"
            loading="eager"
            width={900}
            height={1125}
          />
        </div>
      </section>

      <div className="stat-row" role="list" aria-label="Key statistics">
        <div className="stat-cell reveal" role="listitem">
          <span className="stat-num">Under 5 min</span>
          <p className="stat-label">Median time to verify income</p>
        </div>
        <div className="stat-cell reveal d1" role="listitem">
          <span className="stat-num">85%</span>
          <p className="stat-label">Of applicants report no difficulty</p>
        </div>
        <div className="stat-cell reveal d2" role="listitem">
          <span className="stat-num">93%</span>
          <p className="stat-label">Of caseworkers prefer VMI reports</p>
        </div>
        <div className="stat-cell reveal d3" role="listitem">
          <span className="stat-num">7.5×</span>
          <p className="stat-label">Faster than manual verification</p>
        </div>
      </div>

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
            <Link href="/compare" className="btn btn-outline">
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
      <section className="pressure" id="pressure">
        <div className="pressure-img reveal">
          <img
            src="/images/home/zach-wear-5_aNqrJeMIY-unsplash.jpg"
            alt="Woman working on laptop while sitting on a couch"
            loading="lazy"
            width={1400}
            height={1050}
          />
        </div>

        <div className="pressure-right">
          <h2 className="section-h reveal">The pressure is real</h2>
          <div className="body-text reveal d1">
            <p>
              H.R. 1 expands work requirements for SNAP and Medicaid. The Workforce for the Community Act introduces
              new community engagement verification requirements. States face financial penalties for SNAP payment
              error rates above 6%.
            </p>
            <p>
              The tools states have today were not built for this moment. Quarterly wage databases are months
              behind. Commercial verification services charge per query with prices that go up every year. When the
              data is wrong or incomplete, caseworkers absorb the cost in follow-up calls, manual processing, and an
              ever-growing backlog. Meanwhile, applicants face longer waits and higher burdens.
            </p>
            <p>
              Real-time payroll data is part of the answer, but raw data is not verification. A payroll connection
              can pull income records from an employer&apos;s system. It cannot tell you whether those records
              contain what a caseworker needs to make an eligibility determination. Without a layer that validates,
              contextualizes, and delivers that data in a usable format, states trade one set of problems for
              another.
            </p>
            <p>
              VMI addresses all of these pressures: real-time income data that reduces payment errors, a validation
              layer that ensures caseworkers receive only eligibility-grade reports, and a streamlined process that
              removes the verification bottleneck.
            </p>
          </div>
          <div className="pullquote reveal d2">
            <p className="pq-text">
              Real-time payroll data is part of the answer, but <em>raw data is not verification.</em>
            </p>
          </div>
          <Link href="/contact" className="btn btn-forge reveal d3">
            Request a demo
          </Link>
        </div>
      </section>

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
              <div className="how-steps-wrap">
                <div className="steps-line" aria-hidden="true"></div>
                <div className="how-steps-progress" aria-hidden="true"></div>

                <div className="how-step-row reveal">
                  <div className="step-badge" aria-hidden="true">
                    <span className="step-n">01</span>
                    <span className="step-lbl">Step</span>
                  </div>
                  <div className="how-step-card">
                    <div className="how-step-img">
                      <img
                        src="/images/home/freestocks-mw6Onwg4frY-unsplash.jpg"
                        alt="Applicant receiving a secure link on their phone"
                        loading="lazy"
                      />
                    </div>
                    <div className="how-step-body">
                      <h3>Applicant receives a secure link</h3>
                      <p>
                        During or after applying for benefits, the applicant is sent a link to verify their earned
                        income. No paper. No office visit required.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="how-step-row reveal d1">
                  <div className="step-badge" aria-hidden="true">
                    <span className="step-n">02</span>
                    <span className="step-lbl">Step</span>
                  </div>
                  <div className="how-step-card">
                    <div className="how-step-img">
                      <img
                        src="/images/home/andrej-lisakov-iIJJGpkp0As-unsplash.jpg"
                        alt="Applicant consenting and connecting their payroll on their phone"
                        loading="lazy"
                      />
                    </div>
                    <div className="how-step-body">
                      <h3>Applicant consents and connects their payroll</h3>
                      <p>
                        The applicant reviews a plain-language consent screen, then connects to their payroll
                        provider. No pay stubs to find. No documents to upload.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="how-step-row reveal d2">
                  <div className="step-badge" aria-hidden="true">
                    <span className="step-n">03</span>
                    <span className="step-lbl">Step</span>
                  </div>
                  <div className="how-step-card">
                    <div className="how-step-img">
                      <img
                        src="/images/home/maxime-FV9uOiGYr74-unsplash.jpg"
                        alt="Caseworker receiving verified income data at their desk"
                        loading="lazy"
                      />
                    </div>
                    <div className="how-step-body">
                      <h3>Verified income data is delivered to the caseworker</h3>
                      <p>
                        A standardized income report, verified directly from the payroll source, is delivered to the
                        state benefit system. Every report passes through programmatic validation before delivery —
                        caseworkers only receive eligibility-grade data and can act immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
      <section className="model">
        <div className="model-content">
          <h2 className="section-h reveal">A better model for income verification</h2>
          <div className="body-text reveal d1">
            <p>
              Traditional verification vendors lock you into rising costs and proprietary systems. When you need to
              switch, you start from scratch.
            </p>
            <p>
              DPW is different. We are a registered 501(c)(3) nonprofit. We are legally prohibited from profiting on
              this work. Your price reflects our operating costs and nothing more. As more states join the
              platform, the per-state cost decreases. States share infrastructure instead of building alone.
            </p>
            <p>
              Our code is open source under the AGPL-3.0 license, published on GitHub. If you adopt VMI, you have
              full access to the source code, the integration architecture, and all documentation. No vendor
              lock-in. No black boxes. No surprise overages.
            </p>
          </div>
          <blockquote className="pullquote reveal d2">
            <p className="pq-text">No vendor lock-in. No black boxes. No surprise overages.</p>
          </blockquote>
        </div>
        <div className="model-photo reveal d2">
          <img
            src="/images/home/karthik-balakrishnan-Y4zNMW3pQAs-unsplash.jpg"
            alt="Caseworker and client reviewing income verification together on a phone"
            loading="lazy"
            width={800}
            height={1000}
          />
        </div>
      </section>

      {/* QUOTES CAROUSEL */}
      <section className="voices" id="voices">
        <div className="voices-inner">
          <h2 className="section-h reveal">Trusted by real people</h2>
        </div>

        <VoicesCarousel
          voices={[
            {
              text: "This is a good product. It will make case reviews easier. This makes it almost fool-proof and it's low cost time-wise for the client.",
              attr: "State Pilot Agency Leadership",
            },
            {
              text: "Being able to update and report my income online is far more efficient than doing so by other means (in person, mail, etc.) and I am grateful for this option.",
              attr: (
                <>
                  Pennsylvania beneficiary &amp; <i>Verify My Income</i> user
                </>
              ),
            },
            {
              text: "It was quick and simple and best of all didn't require me to jump through hoops.",
              attr: (
                <>
                  Pennsylvania beneficiary &amp; <i>Verify My Income</i> user
                </>
              ),
            },
          ]}
        />
      </section>

      {/* FUNDERS */}
      <section className="funders section-pad">
        <div className="section-inner">
          <div className="funders-header reveal">
            <h2 className="funders-h">Backed by</h2>
            <div className="funders-rule"></div>
          </div>
          <div className="funder-grid reveal d1">
            <a href="https://www.drkfoundation.org" className="funder-card" target="_blank" rel="noopener">
              <div className="funder-logo-area">
                <img src="/partner-logos/drk-foundation.png" alt="DRK Foundation" className="funder-logo-img" />
              </div>
            </a>
            <a href="https://www.aarp.org/aarp-foundation/" className="funder-card" target="_blank" rel="noopener">
              <div className="funder-logo-area">
                <img
                  src="/images/funders/aarp-foundation-logo.png"
                  alt="AARP Foundation"
                  className="funder-logo-img"
                />
              </div>
            </a>
            <a href="https://familiesandworkers.org" className="funder-card" target="_blank" rel="noopener">
              <div className="funder-logo-area">
                <img
                  src="/images/funders/fwf-logo-dark.svg"
                  alt="Families and Workers Fund"
                  className="funder-logo-img"
                />
              </div>
            </a>
            <a
              href="https://www.pritzkerchildrensinitiative.org"
              className="funder-card"
              target="_blank"
              rel="noopener"
            >
              <div className="funder-logo-area">
                <img
                  src="/partner-logos/pritzkerchildrensinitiative-logo-color-rgb.jpeg"
                  alt="Pritzker Children's Initiative"
                  className="funder-logo-img"
                />
              </div>
            </a>

            <a
              href="https://samvidventures.com"
              className="funder-card funder-pending"
              target="_blank"
              rel="noopener"
            >
              <div className="funder-logo-area">
                <img
                  src="/partner-logos/logo-samvid-ventures.webp"
                  alt="Samvid Ventures"
                  className="funder-logo-img"
                />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* PILOT CTA */}
      <div className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-h reveal">
            Ready to pilot <i>Verify My Income</i> in your jurisdiction? <br />
            Let&apos;s talk.
          </h2>
          <p className="cta-sub reveal d1">No procurement required to begin the conversation.</p>
          <Link href="/contact" className="btn btn-white reveal d2">
            Request a demo
          </Link>
        </div>
      </div>
    </>
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
