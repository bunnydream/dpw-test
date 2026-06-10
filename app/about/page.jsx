import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About — Digital Public Works',
  description: 'The nonprofit alternative for income verification. Open source. At cost. No vendor lock-in.',
};

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* NAV */}
      <nav className="about-nav">
        <Image src="/logo/extended-dark/Duo-copper.svg" alt="Digital Public Works" className="nav-logo" width={160} height={22} />
        <div className="about-nav-links">
          <Link href="/">Home</Link>
          <Link href="/product">Product</Link>
          <Link href="/impact">Impact</Link>
          <Link href="/about">About</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/contact" className="about-nav-cta">Request a Demo</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <section className="about-hero">
          <div className="about-hero-left">
            <div className="about-hero-eyebrow">Nonprofit &middot; Open Source &middot; At Cost</div>
            <h1>What if income verification worked for families and states instead of vendors?</h1>
            <div className="about-hero-underline"></div>
            <p className="about-hero-sub">Digital Public Works is the nonprofit alternative. We built Verify My Income (VMI) because families deserve better. Open source. At cost. No vendor lock-in.</p>
            <div className="about-hero-ctas">
              <Link href="/contact" className="about-btn-primary">Request a Demo</Link>
              <Link href="#how" className="about-btn-secondary">See How It Works</Link>
            </div>
            <p className="about-hero-footnote">No procurement required to begin the conversation. We start with a free, philanthropically funded pilot.</p>
          </div>
          <div className="about-hero-right">
            <div className="about-hero-card">
              <div className="about-hero-card-label">VMI by the numbers</div>
              <div className="about-stat-row">
                <div className="about-stat-item">
                  <div className="about-stat-num">&lt;5m</div>
                  <div className="about-stat-text">Median applicant verification time</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-num">85%</div>
                  <div className="about-stat-text">Of applicants report no difficulty completing the process</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-num">93%</div>
                  <div className="about-stat-text">Of caseworkers find VMI reports as easy or easier to use</div>
                </div>
                <div className="about-stat-item">
                  <div className="about-stat-num">7.5x</div>
                  <div className="about-stat-text">Faster than manual income verification</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* TRUST BAR */}
      <div className="about-trust-bar">
        <div className="about-trust-bar-text">Deployed in</div>
        <div className="about-trust-items">
          <span className="about-trust-item">Pennsylvania</span>
          <span className="about-trust-item">Arizona</span>
          <span className="about-trust-item">Active pilots in additional states</span>
        </div>
      </div>

      {/* PRESSURE */}
      <section className="about-pressure">
        <div className="about-section-inner">
          <span className="about-section-label">The policy context</span>
          <h2>The pressure is real</h2>
          <div className="about-pressure-cols">
            <div className="about-pressure-text">
              <p>H.R. 1 expands work requirements for SNAP and Medicaid. The Workforce for the Community Act introduces new community engagement verification requirements. States face financial penalties for SNAP payment error rates above 6%.</p>
              <p>The tools states have today were not built for this moment. Quarterly wage databases are months behind. Commercial verification services charge per query with prices that go up every year. When the data is wrong or incomplete, caseworkers absorb the cost in follow-up calls, manual processing, and the ever-increasing backlog.</p>
              <div className="about-pressure-cta"><Link href="/contact" className="about-btn-primary">Request a Demo</Link></div>
            </div>
            <div className="about-pressure-right">
              <div className="about-pullquote">
                <p>Real-time payroll data is part of the answer, but raw data is not verification.</p>
              </div>
              <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#4A5568' }}>VMI addresses all of these pressures: real-time income data that reduces payment errors, a validation layer that ensures caseworkers receive only eligibility-grade reports, and a streamlined process that removes the verification bottleneck for caseworkers and applicants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="about-how" id="how">
        <div className="about-section-inner">
          <div className="about-how-header">
            <span className="about-section-label">The process</span>
            <h2>How VMI works</h2>
          </div>
          <div className="about-steps">
            <div className="about-step">
              <div className="about-step-num">1</div>
              <h3>Applicant receives a secure link</h3>
              <p>During or after applying for benefits, the applicant is told they need to verify earned income and is shown a link to verify their income.</p>
            </div>
            <div className="about-step">
              <div className="about-step-num">2</div>
              <h3>Applicant consents and connects their payroll</h3>
              <p>The applicant reviews a plain-language consent screen, then connects to their payroll provider. No pay stubs to find. No documents to upload.</p>
            </div>
            <div className="about-step">
              <div className="about-step-num">3</div>
              <h3>Verified data is delivered to the caseworker</h3>
              <p>A standardized income report is delivered to the state benefit system after passing through validation. The caseworker only receives eligibility-grade data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="about-stories">
        <div className="about-section-inner">
          <div className="about-stories-header">
            <span className="about-section-label">Service design</span>
            <h2>We do not just deliver data.<br />We fix the process.</h2>
            <p>Most verification vendors hand off data and walk away. DPW embeds with your team to find and fix the problems that no data feed can solve.</p>
          </div>
          <div className="about-stories-grid">
            <div className="about-story-card">
              <div className="about-story-num">Case 01</div>
              <h4>A form question that created unnecessary work</h4>
              <p>A form asking for a specific number of hours worked (rather than a range) caused caseworkers to issue unnecessary Requests for Information. DPW identified the problem and recommended a fix, eliminating a workflow burden that had nothing to do with data access.</p>
            </div>
            <div className="about-story-card">
              <div className="about-story-num">Case 02</div>
              <h4>40% of applicants did not know they had a next step</h4>
              <p>Required actions were buried in a generic PDF. DPW worked with the state to add a clear alert on the post-submission landing page&mdash;this led to a 35% increase in income document submissions across all verification methods.</p>
            </div>
            <div className="about-story-card">
              <div className="about-story-num">Case 03</div>
              <h4>Caseworkers were over-verifying without realizing it</h4>
              <p>Case review analysis found caseworkers requesting household composition verification at unnecessary steps. After DPW flagged the pattern, a policy bulletin was published, reducing burden on both applicants and caseworkers.</p>
            </div>
          </div>
          <div className="about-stories-footnote">Every state engagement includes a discovery sprint with interviews of policy experts, caseworkers, quality control workers, community-based organizations, and applicants. These are not one-time exercises&mdash;DPW conducts ongoing case reviews, feedback analysis, and service design improvements throughout the partnership.</div>
        </div>
      </section>

      {/* METRICS */}
      <section className="about-metrics">
        <div className="about-section-inner">
          <div className="about-metrics-header">
            <span className="about-section-label" style={{ color: 'rgba(255,255,255,0.5)' }}>Outcomes</span>
            <h2>Proven in the field</h2>
            <p className="about-metrics-context">VMI is in production with state agencies in Pennsylvania and Arizona, with additional states and multiple commercial partners in active discussion.</p>
          </div>
          <div className="about-metrics-grid">
            <div className="about-metric"><div className="about-metric-num">&lt;<span>5</span> min</div><p>Median time for an applicant to verify income</p></div>
            <div className="about-metric"><div className="about-metric-num"><span>85</span>%</div><p>Of applicants report no difficulty completing the process</p></div>
            <div className="about-metric"><div className="about-metric-num"><span>93</span>%</div><p>Of caseworkers find VMI reports as easy or easier than existing methods</p></div>
            <div className="about-metric"><div className="about-metric-num"><span>7.5</span>x</div><p>Faster than manual income verification processes</p></div>
          </div>
        </div>
      </section>

      {/* BETTER MODEL */}
      <section className="about-model">
        <div className="about-section-inner">
          <div className="about-model-grid">
            <div>
              <span className="about-section-label">Our approach</span>
              <h2>A better model for income verification</h2>
              <div className="about-model-body">
                <p>Traditional verification vendors lock you into rising costs and proprietary systems. When you need to switch, you start from scratch.</p>
                <p>DPW is different. We are a registered <strong>501(c)(3) nonprofit</strong>. We are legally prohibited from profiting on this work. Your price reflects our operating costs and nothing more. As more states join the platform, the per-state cost decreases.</p>
                <p>Our code is open source under the AGPL-3.0 license, published on GitHub. No vendor lock-in. No black boxes. No surprise overages.</p>
              </div>
            </div>
            <div className="about-model-right">
              <table className="about-diff-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Traditional</th>
                    <th className="dpw">VMI / DPW</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Pricing</td><td>Rises over time</td><td className="dpw">At cost, decreases as scale grows</td></tr>
                  <tr><td>Data quality</td><td>Raw data as-is</td><td className="dpw">Validated, eligibility-grade reports</td></tr>
                  <tr><td>Source code</td><td>Proprietary</td><td className="dpw">AGPL-3.0 on GitHub</td></tr>
                  <tr><td>Vendor lock-in</td><td>High</td><td className="dpw">None</td></tr>
                  <tr><td>Accessibility</td><td>Inherited liability</td><td className="dpw">WCAG 2.1 AA, third-party audited</td></tr>
                  <tr><td>Support model</td><td>Data delivery only</td><td className="dpw">Embedded partnership</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="about-quotes">
        <div className="about-section-inner">
          <span className="about-section-label">In their own words</span>
          <h2>What people are saying</h2>
          <div className="about-quotes-grid">
            <div className="about-quote-card">
              <span className="about-quote-mark">&ldquo;</span>
              <p className="about-quote-text">This is a good product. It will make case reviews easier. This makes it almost fool-proof and it&rsquo;s low cost time-wise for the client.</p>
              <div className="about-quote-line"></div>
              <div className="about-quote-attr">Pilot Agency Leadership</div>
            </div>
            <div className="about-quote-card">
              <span className="about-quote-mark">&ldquo;</span>
              <p className="about-quote-text">Being able to update and report my income online is far more efficient than doing so by other means and I am grateful for this option.</p>
              <div className="about-quote-line"></div>
              <div className="about-quote-attr">Pennsylvania VMI User</div>
            </div>
            <div className="about-quote-card">
              <span className="about-quote-mark">&ldquo;</span>
              <p className="about-quote-text">It was quick and simple and best of all didn&rsquo;t require me to jump through hoops.</p>
              <div className="about-quote-line"></div>
              <div className="about-quote-attr">VMI User</div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNDERS */}
      <section className="about-funders">
        <div className="about-section-inner">
          <span className="about-funders-label">Backed by</span>
          <div className="about-funders-row">
            <a href="https://www.drkfoundation.org" className="about-funder-name" target="_blank" rel="noopener noreferrer">DRK Foundation</a>
            <a href="https://www.aarp.org/aarp-foundation/" className="about-funder-name" target="_blank" rel="noopener noreferrer">AARP Foundation</a>
            <a href="https://familiesandworkers.org" className="about-funder-name" target="_blank" rel="noopener noreferrer">Families and Workers Fund</a>
            <a href="https://www.pritzkerchildrensinitiative.org" className="about-funder-name" target="_blank" rel="noopener noreferrer">Pritzker Children&rsquo;s Initiative</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="about-footer">
        <div className="about-footer-inner">
          <div className="about-footer-top">
            <div className="about-footer-cta">
              <Image src="/logo/extended-dark/Duo-copper.svg" alt="Digital Public Works" width={140} height={20} style={{ marginBottom: '28px', display: 'block', opacity: 0.9 }} />
              <h3>Ready to pilot Verify My Income in your jurisdiction? Let&rsquo;s talk.</h3>
              <p>No procurement required to begin the conversation.</p>
              <Link href="/contact" className="about-btn-white">Request a Demo</Link>
            </div>
            <div className="about-footer-contact">
              <span className="about-footer-contact-label">Contact</span>
              <p><a href="mailto:info@digitalpublicworks.org">info@digitalpublicworks.org</a></p>
              <p style={{ marginTop: '8px' }}>2261 Market Street, Suite 32572<br />San Francisco, CA 94114</p>
            </div>
          </div>
          <div className="about-footer-bottom">
            <p className="about-footer-tagline">Digital Public Works is an independent 501(c)(3) nonprofit.</p>
            <div className="about-footer-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/accessibility">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
