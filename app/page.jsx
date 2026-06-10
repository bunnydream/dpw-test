import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Digital Public Works',
  description: 'The nonprofit alternative for income verification. Open source. At cost. No vendor lock-in.',
};

export default function HomePage() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <Image src="/logo/extended-dark/Duo-copper.svg" alt="Digital Public Works" className="nav-logo" width={160} height={22} />
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/product">Product</Link>
          <Link href="/impact">Impact</Link>
          <Link href="/about">About</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/contact" className="nav-cta">Request a Demo</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-tag">Nonprofit &middot; Open Source &middot; At Cost</div>
        <h1>What if income verification worked for families and states instead of vendors?</h1>
        <p className="hero-sub">Digital Public Works is the nonprofit alternative. We built Verify My Income (VMI) because families deserve better. It handles the entire process, from applicant consent to caseworker-ready income report. Open source. At cost. No vendor lock-in.</p>
        <div className="hero-ctas">
          <Link href="/contact" className="btn-primary">Request a Demo</Link>
          <Link href="#how" className="btn-secondary">See How It Works &darr;</Link>
        </div>
        <p className="hero-footnote">No procurement required to begin the conversation. We start with a free, philanthropically funded pilot.</p>
      </section>

      <hr className="section-divider" />

      {/* PRESSURE */}
      <section className="pressure">
        <div className="section-inner">
          <div className="pressure-grid">
            <div>
              <span className="section-label">The policy context</span>
              <h2>The pressure is real</h2>
            </div>
            <div className="pressure-body">
              <p>H.R. 1 expands work requirements for SNAP and Medicaid. The Workforce for the Community Act introduces new community engagement verification requirements. States face financial penalties for SNAP payment error rates above 6%.</p>
              <p>The tools states have today were not built for this moment. Quarterly wage databases are months behind. Commercial verification services charge per query with prices that go up every year.</p>
              <p><strong>VMI addresses all of these pressures:</strong> real-time income data that reduces payment errors, a validation layer that ensures caseworkers receive only eligibility-grade reports, support for work and community engagement requirements, and a streamlined process that removes the verification bottleneck for caseworkers and applicants.</p>
              <div className="pressure-cta"><Link href="/contact" className="btn-primary">Request a Demo</Link></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="section-inner">
          <h2>How VMI works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">Step 01</div>
              <h3>Applicant receives a secure link</h3>
              <p>During or after applying for benefits, the applicant is told they need to verify earned income and is shown a link to verify their income.</p>
            </div>
            <div className="step">
              <div className="step-num">Step 02</div>
              <h3>Applicant consents and connects their payroll</h3>
              <p>The applicant reviews a plain-language consent screen, then connects to their payroll provider. No pay stubs to find. No documents to upload.</p>
            </div>
            <div className="step">
              <div className="step-num">Step 03</div>
              <h3>Verified income data is delivered to the caseworker</h3>
              <p>A standardized income report, verified directly from the payroll source, is delivered to the state benefit system. The caseworker only receives eligibility-grade data and can act immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="stories">
        <div className="section-inner">
          <div className="stories-header">
            <span className="section-label">Service design</span>
            <h2>We do not just deliver data. We fix the process.</h2>
            <p>Most verification vendors hand off data and walk away. DPW embeds with your team to find and fix the problems that no data feed can solve.</p>
          </div>
          <div className="stories-grid">
            <div className="story-card">
              <h4>A form question that created unnecessary work</h4>
              <p>In one state, the application asked for a specific number of hours worked rather than a range. DPW identified the problem through service design analysis and recommended changing the question to ask for a range, eliminating unnecessary RFIs caused by a form-wording problem that had nothing to do with data access.</p>
            </div>
            <div className="story-card">
              <h4>40% of applicants did not know they had a next step</h4>
              <p>In another state, approximately 40% of people completing SNAP renewals were not submitting required income documents. DPW worked with the state to add a clear alert on the post-submission landing page. This workflow improvement led to a 35% increase in income document submissions.</p>
            </div>
            <div className="story-card">
              <h4>Caseworkers were over-verifying without realizing it</h4>
              <p>DPW&rsquo;s case review analysis found that caseworkers were frequently requesting household composition verification at unnecessary steps. After DPW flagged this pattern to agency leadership, a policy bulletin was published. This reduced unnecessary burden on both applicants and caseworkers.</p>
            </div>
          </div>
          <p className="stories-note">Every state engagement includes a discovery sprint with interviews of policy experts, caseworkers, quality control workers, community-based organizations, and applicants. These are not one-time exercises. DPW conducts ongoing case reviews, feedback analysis, and service design improvements throughout the partnership.</p>
        </div>
      </section>

      {/* METRICS */}
      <section className="metrics">
        <div className="section-inner">
          <h2>Proven in the field</h2>
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-num">&lt;5 min</div>
              <p>Median time for an applicant to verify income</p>
            </div>
            <div className="metric">
              <div className="metric-num">85%</div>
              <p>Of applicants report no difficulty completing the process</p>
            </div>
            <div className="metric">
              <div className="metric-num">93%</div>
              <p>Of caseworkers find VMI reports just as easy or easier to use than existing methods</p>
            </div>
            <div className="metric">
              <div className="metric-num">7.5&times;</div>
              <p>Faster than manual income verification processes</p>
            </div>
          </div>
        </div>
      </section>

      {/* BETTER MODEL */}
      <section className="model">
        <div className="section-inner">
          <div className="model-grid">
            <div>
              <span className="section-label">Our model</span>
              <h2>A better model for income verification</h2>
              <div className="model-body">
                <p>Traditional verification vendors lock you into rising costs and proprietary systems. When you need to switch, you start from scratch.</p>
                <p>DPW is different. We are a registered 501(c)(3) nonprofit. <strong>We are legally prohibited from profiting on this work.</strong> Your price reflects our operating costs and nothing more. As more states join the platform, the per-state cost decreases.</p>
                <p>Our code is open source under the AGPL-3.0 license, published on GitHub. No vendor lock-in. No black boxes. No surprise overages.</p>
              </div>
            </div>
            <div>
              <div className="model-callout">
                <span className="callout-badge">What DPW provides</span>
                <ul className="callout-items">
                  <li>Nonprofit 501(c)(3) &mdash; legally at-cost pricing</li>
                  <li>Full codebase published under AGPL-3.0 on GitHub</li>
                  <li>Per-state cost decreases as the platform grows</li>
                  <li>WCAG 2.1 AA accessibility with independent third-party auditing</li>
                  <li>Discovery sprints, case reviews, and ongoing service design</li>
                  <li>No vendor lock-in &mdash; states retain full access to code and architecture</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="quotes">
        <div className="section-inner">
          <h2>In their own words</h2>
          <div className="quotes-grid">
            <div className="quote-card">
              <p className="quote-text">&ldquo;This is a good product. It will make case reviews easier. This makes it almost fool-proof and it&rsquo;s low cost time-wise for the client.&rdquo;</p>
              <div className="quote-attr">Pilot Agency Leadership</div>
            </div>
            <div className="quote-card">
              <p className="quote-text">&ldquo;Being able to update and report my income online is far more efficient than doing so by other means and I am grateful for this option.&rdquo;</p>
              <div className="quote-attr">Pennsylvania VMI User</div>
            </div>
            <div className="quote-card">
              <p className="quote-text">&ldquo;It was quick and simple and best of all didn&rsquo;t require me to jump through hoops.&rdquo;</p>
              <div className="quote-attr">VMI User</div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNDERS */}
      <section className="funders">
        <div className="section-inner">
          <div className="funders-label">Backed by</div>
          <div className="funders-row">
            <a href="https://www.drkfoundation.org" className="funder-name" target="_blank" rel="noopener noreferrer">DRK Foundation</a>
            <a href="https://www.aarp.org/aarp-foundation/" className="funder-name" target="_blank" rel="noopener noreferrer">AARP Foundation</a>
            <a href="https://familiesandworkers.org" className="funder-name" target="_blank" rel="noopener noreferrer">Families and Workers Fund</a>
            <a href="https://www.pritzkerchildrensinitiative.org" className="funder-name" target="_blank" rel="noopener noreferrer">Pritzker Children&rsquo;s Initiative</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-cta">
              <Image src="/logo/extended-dark/Duo-copper.svg" alt="Digital Public Works" width={140} height={20} style={{ marginBottom: '28px', display: 'block' }} />
              <h3>Ready to pilot Verify My Income in your jurisdiction? Let&rsquo;s talk.</h3>
              <p>No procurement required to begin the conversation.</p>
              <Link href="/contact" className="btn-primary">Request a Demo</Link>
            </div>
            <div className="footer-contact">
              <p style={{ fontFamily: 'var(--font-space)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--aluminum)', marginBottom: '16px' }}>Contact</p>
              <p><a href="mailto:info@digitalpublicworks.org">info@digitalpublicworks.org</a></p>
              <p style={{ marginTop: '8px', color: 'var(--aluminum)' }}>2261 Market Street, Suite 32572<br />San Francisco, CA 94114</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-tagline">Digital Public Works is an independent 501(c)(3) nonprofit.</p>
            <div className="footer-links">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/accessibility">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
