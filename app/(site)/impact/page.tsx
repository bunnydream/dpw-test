import Link from "next/link";
import type { Metadata } from "next";
import VoicesCarousel from "@/components/VoicesCarousel";
import "./impact.css";

export const metadata: Metadata = {
  title: "Impact — Digital Public Works",
};

export default function ImpactPage() {
  return (
    <>
      {/* ─── 1. HERO ─── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-heading-stack reveal">
            <h1>Our Impact</h1>
            <p className="hero-tagline">Measurable results for families and state systems</p>
          </div>
          <p className="hero-sub reveal d1">
            Verify My Income makes income verification faster, more accurate, and less burdensome — for everyone in
            the process.
          </p>
        </div>
        <div className="hero-img reveal d2">
          <img
            src="/images/impact/abdul-raheem-kannath-TBwW2tHnX9w-unsplash.jpg"
            alt="A family plays and spends time together"
            loading="eager"
            width={1200}
            height={1600}
          />
        </div>
      </section>

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

      {/* ─── 3. FAMILIES + COMPARISON ─── */}
      <section className="families">
        {/* Left: full-bleed image */}
        <div className="families-img">
          <img
            src="/images/impact/khaled-ali-e8ZJeTnfP6U-unsplash.jpg"
            alt="A woman looking at her phone"
            loading="lazy"
          />
        </div>

        {/* Right: content */}
        <div className="families-right">
          <h2 className="section-h reveal">From hours of paperwork to five minutes — without leaving home</h2>

          <div className="body-text reveal d1">
            <p>
              Before VMI, verifying income for SNAP or Medicaid meant finding old pay stubs, printing forms, visiting
              an office, and waiting. If something was missing, the process started over. For someone navigating a
              job change, caring for children, or managing a health crisis, this time tax could mean weeks without
              benefits.
            </p>
            <p>
              With Verify My Income, an applicant receives a secure link from their agency. They consent to share
              their payroll data and connect to their employer&apos;s payroll system. In under five minutes, a
              verified income report is delivered directly to their caseworker. No documents to find. No follow-up
              calls. No delays.
            </p>
          </div>

          {/* COMPARISON CARD: Manual left, VMI right */}
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
      <section className="voices" id="voices">
        <div className="voices-inner">
          <h2 className="section-h reveal">Real people. Real experiences.</h2>
        </div>

        <VoicesCarousel
          voices={[
            {
              text: "Easy process as I'm awful with technology & this was simple.",
              attr: "Pennsylvania VMI user",
            },
            {
              text: "It was simple to enter just my username and password from the payroll company. This is much less time-consuming than uploading my monthly pay stubs.",
              attr: "Pennsylvania VMI user",
            },
            {
              text: "Everything [was easy]. Sometimes it's hard getting paycheck stubs and dealing with sending them out or bringing them in [person]. This way is great.",
              attr: "Arizona VMI user",
            },
            {
              text: "All I had to do was login to my ADP account and that was it. No uploading pictures or scanning or faxing or going anywhere.",
              attr: "Pennsylvania VMI user",
            },
            {
              text: "Just super easy to navigate, and I expected to take hours away from my family and it took very little time, thank you.",
              attr: "Arizona VMI user",
            },
          ]}
        />
      </section>

      {/* ─── 5. DEPLOYED AND DELIVERING RESULTS ─── */}
      <section className="field section-pad" id="deployed">
        <div className="section-inner">
          <h2 className="section-h reveal">Deployed and delivering results</h2>
          <div className="case-grid">
            <a href="#" className="case-card reveal d1">
              <div className="case-text">
                <span className="case-state">Pennsylvania</span>
                <h3>Pennsylvania Department of Human Services</h3>
                <p className="case-detail">Case study forthcoming — pending draft and approval from PA DHS.</p>
              </div>
              <div className="case-photo">
                <img
                  src="/images/impact/katherine-mcadoo-HLKNH1-ITr0-unsplash.jpg"
                  alt="Pennsylvania State Capitol building"
                  loading="lazy"
                />
              </div>
            </a>

            <a href="#" className="case-card reveal d2">
              <div className="case-text">
                <span className="case-state">Arizona</span>
                <h3>Arizona Department of Economic Security</h3>
                <p className="case-detail">Case study forthcoming — pending draft and approval from AZ DES.</p>
              </div>
              <div className="case-photo">
                <img
                  src="/images/impact/nils-huenerfuerst-yPGXOJNofgA-unsplash.jpg"
                  alt="Arizona State Capitol building"
                  loading="lazy"
                />
              </div>
            </a>
          </div>
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
    </>
  );
}
