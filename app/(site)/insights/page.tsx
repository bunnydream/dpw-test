import type { Metadata } from "next";
import InsightsFilter from "@/components/InsightsFilter";
import "./insights.css";

export const metadata: Metadata = {
  title: "Insights — Digital Public Works",
};

export default function InsightsPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left reveal">
          <h1>Insights</h1>
          <div className="hero-heading-stack" style={{ marginBottom: "28px" }}>
            <p className="hero-tagline">
              Field notes, service design research, and policy analysis from Digital Public Works
            </p>
          </div>
        </div>
        <div className="hero-img reveal d2">
          <img src="/images/insights/writing.jpg" alt="Open notebook and pen on a desk" loading="eager" />
        </div>
      </section>

      {/* POSTS */}
      <section className="posts section-pad">
        <div className="section-inner">
          <InsightsFilter>
            {/* Post 1: Policy */}
            <a href="#" className="case-card reveal" data-cat="policy">
              <div className="case-text">
                <span className="case-state">Policy</span>
                <h3>How H.R. 1 Changes the Stakes for Income Verification</h3>
                <p className="case-detail">
                  Expanded work requirements and tighter error-rate penalties are landing on states that already
                  struggle with aging verification tools. Here is what the legislative moment means for agencies on
                  the ground.
                </p>
              </div>
              <div className="case-photo post-photo-placeholder"></div>
            </a>

            {/* Post 2: Service Design */}
            <a href="#" className="case-card reveal d1" data-cat="service-design">
              <div className="case-text">
                <span className="case-state">Service Design</span>
                <h3>The 40% Problem: When the Process Fails Before the Technology Does</h3>
                <p className="case-detail">
                  In one state, nearly 40% of SNAP renewal applicants were not submitting required income documents —
                  not because the upload failed, but because they did not know they had a next step.
                </p>
              </div>
              <div className="case-photo post-photo-placeholder"></div>
            </a>

            {/* Post 3: Accessibility */}
            <a href="#" className="case-card reveal d2" data-cat="accessibility">
              <div className="case-text">
                <span className="case-state">Accessibility</span>
                <h3>Accessible by Design: What Our Research on VMI Is Revealing</h3>
                <p className="case-detail">
                  65% of our users access <i>Verify My Income</i> on a smartphone. We are conducting original
                  research into how income verification can be made usable for older adults, people with
                  disabilities, and those with limited English proficiency.
                </p>
              </div>
              <div className="case-photo post-photo-placeholder"></div>
            </a>
          </InsightsFilter>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="subscribe section-pad">
        <div className="section-inner">
          <div className="subscribe-inner">
            <div className="reveal">
              <h2 className="subscribe-h">Stay in the loop</h2>
              <p className="subscribe-sub">Get notified when we publish new insights.</p>
            </div>
            <div className="reveal d1">
              <form className="subscribe-form">
                <input
                  className="subscribe-input"
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  autoComplete="email"
                />
                <button type="submit" className="btn btn-forge">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
