import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getPageSections, type Section } from "@/lib/sections";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact — Digital Public Works",
};

type TextContent = {
  heading?: string | null;
  text?: string | null;
};

function byType(sections: Section[], type: Section["type"]) {
  return sections.filter((s) => s.type === type);
}

export default async function ContactPage() {
  const result = await getPageSections("contact");
  const sections = result?.sections ?? [];

  const textSections = byType(sections, "text");
  const header = textSections[0]?.content as TextContent | undefined;
  const statePartners = textSections[1]?.content as TextContent | undefined;
  const funders = textSections[2]?.content as TextContent | undefined;
  const community = textSections[3]?.content as TextContent | undefined;

  return (
    <div className="page-contact">
      {/* PAGE HEADER */}
      <section className="page-header">
        <div className="page-header-inner">
          <h1 className="reveal d1">{header?.heading}</h1>
          <p className="page-header-sub reveal d2">{header?.text}</p>
        </div>
      </section>

      {/* FOR STATE PARTNERS */}
      <section className="section-pad" style={{ background: "var(--cool-white)" }}>
        <div className="section-inner">
          <div className="contact-pair">
            <div className="contact-desc reveal">
              <span className="contact-label">For State Partners</span>
              <span className="section-divider"></span>
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>{statePartners?.heading}</h2>
              <div className="body-text">
                <p>{statePartners?.text}</p>
              </div>
            </div>
            <div className="reveal d1">
              <div className="contact-form-card">
                <ContactForm
                  formName="state-partner-contact"
                  action={process.env.NEXT_PUBLIC_FORMSPREE_STATE_PARTNER ?? ""}
                  submitLabel="Request a demo"
                  successMessage="Thanks for reaching out — we'll be in touch about scheduling a demo soon."
                >
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
                    <select className="form-select" id="sp-state" name="state" defaultValue="">
                      <option value="" disabled>
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
                </ContactForm>
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
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>{funders?.heading}</h2>
              <div className="body-text">
                <p>{funders?.text}</p>
              </div>
            </div>
            <div className="reveal d1">
              <div className="contact-form-card">
                <ContactForm
                  formName="funder-contact"
                  action={process.env.NEXT_PUBLIC_FORMSPREE_FUNDER ?? ""}
                  submitLabel="Get in touch"
                  successMessage="Thank you for your interest in supporting our work — we'll follow up soon."
                >
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
                </ContactForm>
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
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>{community?.heading}</h2>
              <div className="body-text">
                <p>{community?.text}</p>
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
                <ContactForm
                  formName="general-contact"
                  action={process.env.NEXT_PUBLIC_FORMSPREE_COMMUNITY ?? ""}
                  submitLabel="Get in touch"
                  successMessage="Thanks for reaching out — we read everything and will get back to you soon."
                >
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
                </ContactForm>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
