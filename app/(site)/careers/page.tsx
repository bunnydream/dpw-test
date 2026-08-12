import type { Metadata } from "next";
import "./careers.css";

export const metadata: Metadata = {
  title: "Careers — Digital Public Works",
};

export default function CareersPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left reveal">
          <h1>Join Digital Public Works</h1>
          <p className="hero-tagline">
            Join us in making government digital services better for everyone (and doing it at cost).
          </p>
        </div>
        <div className="hero-img reveal d2">
          <img
            src="/images/careers/johannes-kopf-h0pHxbb6a78-unsplash.jpg"
            alt="Three hikers on a mountainous trail at dusk"
            loading="eager"
          />
        </div>
      </section>

      {/* INTRO */}
      <section className="intro section-pad">
        <div className="section-inner">
          <p
            className="body-text reveal"
            style={{ fontSize: "var(--t-body)", lineHeight: 1.82, color: "var(--steel)", maxWidth: "72ch" }}
          >
            Digital Public Works is a small team doing work that matters. We build the tools and infrastructure that
            states need to verify income for public benefits, and we are growing. Our team is mostly U.S. Digital
            Service veterans and civic tech practitioners who have built and shipped technology at scale in
            government. We put humans at the center of everything we do, we ship real products into real systems,
            and we hold ourselves to a high standard while assuming the best in each other. If that sounds like your
            kind of environment, we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section className="openings section-pad">
        <div className="section-inner">
          <div className="openings-header reveal">
            <h2 className="openings-h">Open Positions</h2>
            <div className="openings-rule"></div>
          </div>
          <p className="openings-body reveal d1">
            Thank you for your interest in joining our team. We do not have any current job openings and are not
            accepting applications at this time. We encourage you to visit this page periodically for future
            opportunities.
          </p>
        </div>
      </section>
    </>
  );
}
