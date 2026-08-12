import type { Metadata } from "next";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact — Digital Public Works",
};

export default function ContactPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section className="page-header">
        <div className="page-header-inner">
          <h1 className="reveal d1">Get in touch</h1>
          <p className="page-header-sub reveal d2">
            Whether you are a state agency, a funder, a community organization, or a fellow practitioner, we would
            love to hear from you.
          </p>
        </div>
      </section>

      {/* FOR STATE PARTNERS */}
      <section className="section-pad" style={{ background: "var(--cool-white)" }}>
        <div className="section-inner">
          <div className="contact-pair">
            <div className="contact-desc reveal">
              <span className="contact-label">For State Partners</span>
              <span className="section-divider"></span>
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>
                Request a demo of <i>Verify My Income</i>
              </h2>
              <div className="body-text">
                <p>
                  We work with state health and human services agencies to pilot and implement real-time income
                  verification for Medicaid, SNAP, and other benefit programs. If you&apos;re interested in exploring
                  a partnership, we&apos;d love to connect.
                </p>
              </div>
            </div>
            <div className="reveal d1">
              <div className="contact-form-card">
                <form name="state-partner-contact" method="POST" noValidate>
                  <div className="form-stack">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sp-first">
                          First name
                        </label>
                        <input
                          className="form-input"
                          type="text"
                          id="sp-first"
                          name="first_name"
                          placeholder="Jane"
                          autoComplete="given-name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="sp-last">
                          Last name
                        </label>
                        <input
                          className="form-input"
                          type="text"
                          id="sp-last"
                          name="last_name"
                          placeholder="Smith"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="sp-email">
                        Work email
                      </label>
                      <input
                        className="form-input"
                        type="email"
                        id="sp-email"
                        name="email"
                        placeholder="jane.smith@agency.gov"
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="sp-org">
                        Agency / organization
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="sp-org"
                        name="organization"
                        placeholder="State Dept. of Health and Human Services"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="sp-state">
                        State
                      </label>
                      <select className="form-select" id="sp-state" name="state">
                        <option value="" disabled selected>
                          Select a state
                        </option>
                        <option>Alabama</option>
                        <option>Alaska</option>
                        <option>Arizona</option>
                        <option>Arkansas</option>
                        <option>California</option>
                        <option>Colorado</option>
                        <option>Connecticut</option>
                        <option>Delaware</option>
                        <option>Florida</option>
                        <option>Georgia</option>
                        <option>Hawaii</option>
                        <option>Idaho</option>
                        <option>Illinois</option>
                        <option>Indiana</option>
                        <option>Iowa</option>
                        <option>Kansas</option>
                        <option>Kentucky</option>
                        <option>Louisiana</option>
                        <option>Maine</option>
                        <option>Maryland</option>
                        <option>Massachusetts</option>
                        <option>Michigan</option>
                        <option>Minnesota</option>
                        <option>Mississippi</option>
                        <option>Missouri</option>
                        <option>Montana</option>
                        <option>Nebraska</option>
                        <option>Nevada</option>
                        <option>New Hampshire</option>
                        <option>New Jersey</option>
                        <option>New Mexico</option>
                        <option>New York</option>
                        <option>North Carolina</option>
                        <option>North Dakota</option>
                        <option>Ohio</option>
                        <option>Oklahoma</option>
                        <option>Oregon</option>
                        <option>Pennsylvania</option>
                        <option>Rhode Island</option>
                        <option>South Carolina</option>
                        <option>South Dakota</option>
                        <option>Tennessee</option>
                        <option>Texas</option>
                        <option>Utah</option>
                        <option>Vermont</option>
                        <option>Virginia</option>
                        <option>Washington</option>
                        <option>West Virginia</option>
                        <option>Wisconsin</option>
                        <option>Wyoming</option>
                        <option>Washington D.C.</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="sp-message">
                        Tell us about your program
                      </label>
                      <textarea
                        className="form-textarea"
                        id="sp-message"
                        name="message"
                        placeholder="Which benefit programs are you administering? What income verification challenges are you facing?"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-forge" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                      Request a demo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR FUNDERS */}
      <section className="section-pad" style={{ background: "var(--cool-white)" }}>
        <div className="section-inner">
          <div className="contact-pair">
            <div className="contact-desc reveal">
              <span className="contact-label">For Funders</span>
              <span className="section-divider"></span>
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>Support our work</h2>
              <div className="body-text">
                <p>
                  Digital Public Works is an independent 501(c)(3) nonprofit. Philanthropic support enables us to
                  keep our fees at cost for state agencies and to invest in research, accessibility, and the
                  communities our work serves.
                </p>
              </div>
            </div>
            <div className="reveal d1">
              <div className="contact-form-card">
                <form name="funder-contact" method="POST" noValidate>
                  <div className="form-stack">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="fn-first">
                          First name
                        </label>
                        <input
                          className="form-input"
                          type="text"
                          id="fn-first"
                          name="first_name"
                          placeholder="Jane"
                          autoComplete="given-name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="fn-last">
                          Last name
                        </label>
                        <input
                          className="form-input"
                          type="text"
                          id="fn-last"
                          name="last_name"
                          placeholder="Smith"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="fn-email">
                        Work email
                      </label>
                      <input
                        className="form-input"
                        type="email"
                        id="fn-email"
                        name="email"
                        placeholder="jane@foundation.org"
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="fn-org">
                        Foundation / organization
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="fn-org"
                        name="organization"
                        placeholder="Example Foundation"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="fn-message">
                        How can we help?
                      </label>
                      <textarea
                        className="form-textarea"
                        id="fn-message"
                        name="message"
                        placeholder="Tell us about your foundation's priorities and what drew you to DPW's work."
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-forge" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                      Get in touch
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR COMMUNITY + ADDRESS */}
      <section className="section-pad" style={{ background: "var(--cool-white)" }}>
        <div className="section-inner">
          <div className="contact-pair">
            <div className="contact-desc reveal">
              <span className="contact-label">For Community</span>
              <span className="section-divider"></span>
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>Everything else</h2>
              <div className="body-text">
                <p>Press inquiries, partnership ideas, and general questions are all welcome. We read everything.</p>
              </div>
              <div className="address-block reveal d1">
                <address>
                  <strong>Digital Public Works</strong>
                  <br />
                  2261 Market Street, Suite 32572
                  <br />
                  San Francisco, CA 94114
                  <br />
                  <br />
                  <a href="mailto:info@digitalpublicworks.org">info@digitalpublicworks.org</a>
                </address>
              </div>
            </div>
            <div className="reveal d1">
              <div className="contact-form-card">
                <form name="general-contact" method="POST" noValidate>
                  <div className="form-stack">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="gc-first">
                          First name
                        </label>
                        <input
                          className="form-input"
                          type="text"
                          id="gc-first"
                          name="first_name"
                          placeholder="Jane"
                          autoComplete="given-name"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="gc-last">
                          Last name
                        </label>
                        <input
                          className="form-input"
                          type="text"
                          id="gc-last"
                          name="last_name"
                          placeholder="Smith"
                          autoComplete="family-name"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="gc-email">
                        Email
                      </label>
                      <input
                        className="form-input"
                        type="email"
                        id="gc-email"
                        name="email"
                        placeholder="jane@example.com"
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="gc-subject">
                        Subject
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="gc-subject"
                        name="subject"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="gc-message">
                        Message
                      </label>
                      <textarea
                        className="form-textarea"
                        id="gc-message"
                        name="message"
                        placeholder="Your message here…"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-forge" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                      Get in touch
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
