import type { Metadata } from "next";
import "./about.css";

export const metadata: Metadata = {
  title: "About — Digital Public Works",
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left reveal">
          <h1>About Us</h1>
          <div className="hero-heading-stack" style={{ marginBottom: "28px" }}>
            <p className="hero-tagline">Our Mission: To deliver dignified, frictionless government services at cost.</p>
          </div>
        </div>
        <div className="hero-img reveal d2">
          <img
            src="/images/about/paulina-herpel-yxqVPJFAYHg-unsplash.jpg"
            alt="Two people working on laptops"
            loading="eager"
          />
        </div>
      </section>

      {/* FOUNDING STORY */}
      <section className="story section-pad">
        <div className="section-inner">
          <div className="story-grid">
            <div className="story-photo reveal">
              <img
                src="/images/about/mapbox-ZT5v0puBjZI-unsplash.jpg"
                alt="Four people at laptops in a board meeting"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="section-h reveal" style={{ marginBottom: "clamp(24px, 3vw, 36px)" }}>
                How Digital Public Works started
              </h2>
              <div className="body-text reveal d1">
                <p>
                  Digital Public Works was founded in 2025 by former United States Digital Service employees who
                  spent years working inside the federal government on benefits modernization and service delivery.
                  We saw firsthand how states struggle with income verification: the tools are expensive, the data
                  is stale, and the burden falls on the people who can least afford it.
                </p>
                <p>
                  We left federal service to build the infrastructure that states need but cannot fund individually.
                  DPW is an independent 501(c)(3) nonprofit. Our team of nine includes seven USDS veterans with deep
                  experience in federal and state government systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="team section-pad">
        <div className="section-inner">
          <h2 className="section-h reveal">Our team</h2>
          <div className="team-grid">
            {/* Michael Burstein */}
            <div className="team-card reveal">
              <div className="team-photo">
                <img src="/headshots/Michael.png" alt="Michael Burstein" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Michael Burstein</h3>
                <span className="team-title-label">Co-Founder, Executive Director</span>
                <p className="team-bio">
                  Michael Burstein is a civic technologist, strategist, and attorney with deep experience in
                  navigating bureaucracies to deliver digital products that serve the American public. Prior to
                  launching Digital Public Works, Michael served at the United States Digital Service. During his
                  time at USDS, he was Director of the Facing Financial Shock portfolio and the Chief of Staff for
                  the USDS-CDC team during the COVID response. Michael has been the executive in charge of legal and
                  finance functions for a digital design and software development firm that was named one of the
                  1,000 fastest growing companies in the U.S. in 2020 and 2021 by Inc.com.
                </p>
              </div>
            </div>

            {/* Patricia Perozo */}
            <div className="team-card reveal d1">
              <div className="team-photo">
                <img src="/headshots/PatriciaHeadshot-BW.png" alt="Patricia Perozo" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Patricia Perozo</h3>
                <span className="team-title-label">Co-Founder, Head of Delivery</span>
                <p className="team-bio">
                  Patricia Perozo is a civic technologist, backend software engineer, and part-time product manager
                  with experience across the federal government, Silicon Valley tech companies, and startups. Prior
                  to co-founding Digital Public Works, she served as a Digital Service Expert at the United States
                  Digital Service, where she led the Income Verification as a Service (IVaaS) team, contributed to
                  COVID response efforts, and supported the implementation of several Inflation Reduction Act
                  programs. Outside of work, she enjoys salsa dancing, practicing yoga, and watching Formula 1.
                </p>
              </div>
            </div>

            {/* Kali Lewis */}
            <div className="team-card reveal d2">
              <div className="team-photo">
                <img src="/headshots/Kali.png" alt="Kali Lewis" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Kali Lewis</h3>
                <span className="team-title-label">Interim Director of Design &amp; Research</span>
                <p className="team-bio">
                  Kali Lewis is a service designer with a background in ethnographic research. She anchors teams in
                  the nuanced realities of end users, makes abstract concepts tangible, and draws out the collective
                  wisdom of interdisciplinary teams. She specializes in crafting research plans, conducting
                  interviews, and synthesizing insights into actionable outcomes. Most recently at USDS, she focused
                  on Customer Experience projects with the Small Business Administration and the inter-agency life
                  experience project Facing a Financial Shock.
                </p>
              </div>
            </div>

            {/* Cle Diggins */}
            <div className="team-card reveal">
              <div className="team-photo">
                <img src="/headshots/Cle.png" alt="Cle Diggins" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Cle Diggins</h3>
                <span className="team-title-label">Director of Engineering</span>
                <p className="team-bio">
                  Cle Diggins is a seasoned technology leader with nearly 20 years of experience leading
                  cross-functional teams across public and private sectors. Prior to joining Digital Public Works,
                  Cle was a member of the United States Digital Service leading government and contractor teams
                  across numerous agencies including the CDC, DOT, HRSA, VA, and CMS with a focus on modernization
                  and usability of these systems.
                </p>
              </div>
            </div>

            {/* Jeff Catania */}
            <div className="team-card reveal d1">
              <div className="team-photo">
                <img src="/headshots/Jeff-BW.png" alt="Jeff Catania" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Jeff Catania</h3>
                <span className="team-title-label">Senior Software Engineer</span>
                <p className="team-bio">
                  Jeff Catania is a software engineer focused on the intersection of cloud architecture, data
                  visualization, and user experience to build elegant solutions to complex problems. Prior to
                  joining Digital Public Works, Jeff launched Medicaid and SNAP Income Verification tools at U.S.
                  Digital Service, virtual AI tutors at Harvard Business School Online, a digital assortment
                  platform at Levi Strauss and Company, and a Data+Design capability at Accenture Interactive.
                </p>
              </div>
            </div>

            {/* Tatiana Smith */}
            <div className="team-card reveal d2">
              <div className="team-photo">
                <img src="/headshots/Tatiana.png" alt="Tatiana Smith" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Tatiana Smith</h3>
                <span className="team-title-label">Senior Product Designer</span>
                <p className="team-bio">
                  Tatiana Smith is a product designer, full-spectrum doula, community activist, and mother based in
                  Raleigh, North Carolina. Tatiana served as a UX Product Designer and Researcher at the United
                  States Digital Service where she supported the launch of the Affordable Connectivity Program with
                  the FCC, FAFSA impact analysis with the Department of Education, and Online Passport Renewals and
                  Visa Modernization at the Department of State.
                </p>
              </div>
            </div>

            {/* Erika Tom */}
            <div className="team-card reveal">
              <div className="team-photo">
                <img src="/headshots/ErikaTom_BW.jpg" alt="Erika Tom" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Erika Tom</h3>
                <span className="team-title-label">Senior Product Manager</span>
                <p className="team-bio">
                  Erika Tom is a product manager with a background in data analytics and customer success. Prior to
                  joining Digital Public Works, she worked at the United States Digital Service unblocking
                  bottlenecks in refugee admissions, reimagining disease surveillance data features at CDC, and
                  supporting claims processing modernization at CMS. She also has past product experience in machine
                  learning and marketing startups, as well as with a government contractor.
                </p>
              </div>
            </div>

            {/* Anna Banchik */}
            <div className="team-card reveal d1">
              <div className="team-photo">
                <img src="/headshots/Anna%20Banchik.png" alt="Anna Banchik" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Anna Banchik</h3>
                <span className="team-title-label">Senior UX Researcher</span>
                <p className="team-bio">
                  Anna Banchik is a UX researcher driven by understanding people&apos;s experiences, the barriers
                  they face, and the creative ways they navigate complex challenges. Drawing on an ethnographic
                  background, her research has spanned topics from self-employment experiences among day laborers
                  and women entrepreneurs to how human rights researchers use social media. Before joining Digital
                  Public Works, she worked at Meta and volunteered with U.S. Digital Response. She holds a Ph.D. in
                  Sociology from the University of Texas at Austin.
                </p>
              </div>
            </div>

            {/* Runako Godfrey */}
            <div className="team-card reveal d2">
              <div className="team-photo">
                <img src="/headshots/Runako_bw.jpg" alt="Runako Godfrey" loading="lazy" />
              </div>
              <div className="team-info">
                <h3 className="team-name">Runako Godfrey</h3>
                <span className="team-title-label">Software Engineer</span>
                <p className="team-bio">
                  Runako Godfrey is a software engineer with expertise in shipping complex systems. His experience
                  includes work building web and cloud applications in both the nonprofit and commercial sectors. He
                  is passionate about using technology in empathetic ways to solve pressing problems for normal
                  people. When not building, Runako enjoys reading fiction and spending time with his wife and
                  daughters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNDERS */}
      <section className="funders section-pad">
        <div className="section-inner">
          <div className="funders-header reveal">
            <h2 className="funders-h">Backed by</h2>
            <div className="funders-rule"></div>
          </div>
          <div className="funder-grid reveal d1">
            {/* Confirmed funders */}
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
                  alt="Pritzker Children&apos;s Initiative"
                  className="funder-logo-img"
                />
              </div>
            </a>

            {/* Pending funders — hide for launch */}
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

      {/* ORGANIZATION STATUS */}
      <section className="org-status section-pad">
        <div className="section-inner">
          <div className="funders-header reveal">
            <h2 className="funders-h">Organization Status</h2>
            <div className="funders-rule"></div>
          </div>
          <p className="funders-org reveal d1">Digital Public Works is an independent 501(c)(3) nonprofit organization.</p>
        </div>
      </section>
    </>
  );
}
