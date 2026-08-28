import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import ContactForm from "@/components/ContactForm";
import { getPageSections, type Section } from "@/lib/sections";
import SectionRenderer from "@/components/blocks/SectionRenderer";
import { getSeoSettings } from "@/lib/site-settings";
import { resolveMetadata } from "@/lib/seo";
import "./contact.css";

export async function generateMetadata(): Promise<Metadata> {
  const [result, siteSeo] = await Promise.all([getPageSections("contact"), getSeoSettings()]);
  return resolveMetadata({ item: result?.page ?? null, fallbackTitle: "Contact", path: "/contact", siteSeo });
}

type TextContent = {
  heading?: string | null;
  text?: string | null;
};

type ContactFormSectionContent = {
  kicker_label: string;
  heading: string;
  text: string;
  first_name_label: string;
  first_name_placeholder: string;
  last_name_label: string;
  last_name_placeholder: string;
  email_label: string;
  email_placeholder: string;
  org_label?: string | null;
  org_placeholder?: string | null;
  state_field_label?: string | null;
  subject_label?: string | null;
  subject_placeholder?: string | null;
  message_label: string;
  message_placeholder: string;
  submit_label: string;
  success_message: string;
  address_org_name?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  address_email?: string | null;
};

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida",
  "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
  "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
  "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Washington D.C.",
];

const DEFAULT_STATE_PARTNERS: ContactFormSectionContent = {
  kicker_label: "For State Partners",
  heading: "Request a demo of Verify My Income",
  text:
    "We work with state health and human services agencies to pilot and implement real-time income verification for Medicaid, SNAP, and other benefit programs. If you're interested in exploring a partnership, we'd love to connect.",
  first_name_label: "First name",
  first_name_placeholder: "Jane",
  last_name_label: "Last name",
  last_name_placeholder: "Smith",
  email_label: "Work email",
  email_placeholder: "jane.smith@agency.gov",
  org_label: "Agency / organization",
  org_placeholder: "State Dept. of Health and Human Services",
  state_field_label: "State",
  message_label: "Tell us about your program",
  message_placeholder: "Which benefit programs are you administering? What income verification challenges are you facing?",
  submit_label: "Request a demo",
  success_message: "Thanks for reaching out — we'll be in touch about scheduling a demo soon.",
};

const DEFAULT_FUNDERS: ContactFormSectionContent = {
  kicker_label: "For Funders",
  heading: "Support our work",
  text:
    "Digital Public Works is an independent 501(c)(3) nonprofit. Philanthropic support enables us to keep our fees at cost for state agencies and to invest in research, accessibility, and the communities our work serves.",
  first_name_label: "First name",
  first_name_placeholder: "Jane",
  last_name_label: "Last name",
  last_name_placeholder: "Smith",
  email_label: "Work email",
  email_placeholder: "jane@foundation.org",
  org_label: "Foundation / organization",
  org_placeholder: "Example Foundation",
  message_label: "How can we help?",
  message_placeholder: "",
  submit_label: "Get in touch",
  success_message: "Thank you for your interest in supporting our work — we'll follow up soon.",
};

const DEFAULT_COMMUNITY: ContactFormSectionContent = {
  kicker_label: "For Community",
  heading: "Everything else",
  text: "Press inquiries, partnership ideas, and general questions are all welcome. We read everything.",
  first_name_label: "First name",
  first_name_placeholder: "Jane",
  last_name_label: "Last name",
  last_name_placeholder: "Smith",
  email_label: "Email",
  email_placeholder: "jane@example.com",
  subject_label: "Subject",
  subject_placeholder: "What's this about?",
  message_label: "Message",
  message_placeholder: "Your message here…",
  submit_label: "Get in touch",
  success_message: "Thanks for reaching out — we read everything and will get back to you soon.",
  address_org_name: "Digital Public Works",
  address_line1: "2261 Market Street, Suite 32572",
  address_line2: "San Francisco, CA 94114",
  address_email: "info@digitalpublicworks.org",
};

function byType(sections: Section[], type: Section["type"]) {
  return sections.filter((s) => s.type === type);
}

export default async function ContactPage() {
  const result = await getPageSections("contact");
  const sections = result?.sections ?? [];

  const headerSection = byType(sections, "text")[0];
  const header = headerSection?.content as TextContent | undefined;
  const formSections = byType(sections, "contact-form-section");

  const statePartners = (formSections[0]?.content as ContactFormSectionContent | undefined) ?? DEFAULT_STATE_PARTNERS;
  const funders = (formSections[1]?.content as ContactFormSectionContent | undefined) ?? DEFAULT_FUNDERS;
  const community = (formSections[2]?.content as ContactFormSectionContent | undefined) ?? DEFAULT_COMMUNITY;

  const consumedIds = new Set(
    [headerSection, ...formSections.slice(0, 3)].filter((s): s is Section => !!s).map((s) => s.id)
  );
  const extraSections = sections.filter((s) => !consumedIds.has(s.id));

  // Rank used as a section's sort position only when its DB row doesn't
  // exist yet — reproduces today's fixed order for freshly-seeded pages.
  const RANK = { headerSection: 0, statePartners: 1, funders: 2, community: 3 };

  type Block = { key: string; position: number; node: ReactNode };

  const blocks: Block[] = [
    {
      key: headerSection?.id ?? "headerSection",
      position: headerSection?.position ?? RANK.headerSection,
      node: (
        <section className="page-header">
          <div className="page-header-inner">
            <h1 className="reveal d1">{header?.heading}</h1>
            <p className="page-header-sub reveal d2">{header?.text}</p>
          </div>
        </section>
      ),
    },
    {
      key: formSections[0]?.id ?? "statePartners",
      position: formSections[0]?.position ?? RANK.statePartners,
      node: (
        <section className="section-pad" style={{ background: (formSections[0]?.background_color) ?? "var(--cool-white)" }}>
        <div className="section-inner">
          <div className="contact-pair">
            <div className="contact-desc reveal">
              <span className="contact-label">{statePartners.kicker_label}</span>
              <span className="section-divider"></span>
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>{statePartners.heading}</h2>
              <div className="body-text">
                <p>{statePartners.text}</p>
              </div>
            </div>
            <div className="reveal d1">
              <div className="contact-form-card">
                <ContactForm
                  formName="state-partner-contact"
                  action={process.env.NEXT_PUBLIC_FORMSPREE_STATE_PARTNER ?? ""}
                  submitLabel={statePartners.submit_label}
                  successMessage={statePartners.success_message}
                >
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="sp-first">
                        {statePartners.first_name_label}
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="sp-first"
                        name="first_name"
                        placeholder={statePartners.first_name_placeholder}
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="sp-last">
                        {statePartners.last_name_label}
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="sp-last"
                        name="last_name"
                        placeholder={statePartners.last_name_placeholder}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sp-email">
                      {statePartners.email_label}
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      id="sp-email"
                      name="email"
                      placeholder={statePartners.email_placeholder}
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sp-org">
                      {statePartners.org_label}
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="sp-org"
                      name="organization"
                      placeholder={statePartners.org_placeholder ?? ""}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sp-state">
                      {statePartners.state_field_label}
                    </label>
                    <select className="form-select" id="sp-state" name="state" defaultValue="">
                      <option value="" disabled>
                        Select a state
                      </option>
                      {US_STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="sp-message">
                      {statePartners.message_label}
                    </label>
                    <textarea
                      className="form-textarea"
                      id="sp-message"
                      name="message"
                      placeholder={statePartners.message_placeholder}
                    ></textarea>
                  </div>
                </ContactForm>
              </div>
            </div>
          </div>
        </div>
      </section>
      ),
    },
    {
      key: formSections[1]?.id ?? "funders",
      position: formSections[1]?.position ?? RANK.funders,
      node: (
        <section className="section-pad" style={{ background: (formSections[1]?.background_color) ?? "var(--cool-white)" }}>
        <div className="section-inner">
          <div className="contact-pair">
            <div className="contact-desc reveal">
              <span className="contact-label">{funders.kicker_label}</span>
              <span className="section-divider"></span>
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>{funders.heading}</h2>
              <div className="body-text">
                <p>{funders.text}</p>
              </div>
            </div>
            <div className="reveal d1">
              <div className="contact-form-card">
                <ContactForm
                  formName="funder-contact"
                  action={process.env.NEXT_PUBLIC_FORMSPREE_FUNDER ?? ""}
                  submitLabel={funders.submit_label}
                  successMessage={funders.success_message}
                >
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="fn-first">
                        {funders.first_name_label}
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="fn-first"
                        name="first_name"
                        placeholder={funders.first_name_placeholder}
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="fn-last">
                        {funders.last_name_label}
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="fn-last"
                        name="last_name"
                        placeholder={funders.last_name_placeholder}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fn-email">
                      {funders.email_label}
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      id="fn-email"
                      name="email"
                      placeholder={funders.email_placeholder}
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fn-org">
                      {funders.org_label}
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="fn-org"
                      name="organization"
                      placeholder={funders.org_placeholder ?? ""}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fn-message">
                      {funders.message_label}
                    </label>
                    <textarea
                      className="form-textarea"
                      id="fn-message"
                      name="message"
                      placeholder={funders.message_placeholder}
                    ></textarea>
                  </div>
                </ContactForm>
              </div>
            </div>
          </div>
        </div>
      </section>
      ),
    },
    {
      key: formSections[2]?.id ?? "community",
      position: formSections[2]?.position ?? RANK.community,
      node: (
        <section className="section-pad" style={{ background: (formSections[2]?.background_color) ?? "var(--cool-white)" }}>
        <div className="section-inner">
          <div className="contact-pair">
            <div className="contact-desc reveal">
              <span className="contact-label">{community.kicker_label}</span>
              <span className="section-divider"></span>
              <h2 style={{ fontSize: "var(--t-headline)", marginBottom: "20px" }}>{community.heading}</h2>
              <div className="body-text">
                <p>{community.text}</p>
              </div>
              <div className="address-block reveal d1">
                <address>
                  <strong>{community.address_org_name}</strong>
                  <br />
                  {community.address_line1}
                  <br />
                  {community.address_line2}
                  <br />
                  <br />
                  <a href={`mailto:${community.address_email}`}>{community.address_email}</a>
                </address>
              </div>
            </div>
            <div className="reveal d1">
              <div className="contact-form-card">
                <ContactForm
                  formName="general-contact"
                  action={process.env.NEXT_PUBLIC_FORMSPREE_COMMUNITY ?? ""}
                  submitLabel={community.submit_label}
                  successMessage={community.success_message}
                >
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="gc-first">
                        {community.first_name_label}
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="gc-first"
                        name="first_name"
                        placeholder={community.first_name_placeholder}
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="gc-last">
                        {community.last_name_label}
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="gc-last"
                        name="last_name"
                        placeholder={community.last_name_placeholder}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="gc-email">
                      {community.email_label}
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      id="gc-email"
                      name="email"
                      placeholder={community.email_placeholder}
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="gc-subject">
                      {community.subject_label}
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="gc-subject"
                      name="subject"
                      placeholder={community.subject_placeholder ?? ""}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="gc-message">
                      {community.message_label}
                    </label>
                    <textarea
                      className="form-textarea"
                      id="gc-message"
                      name="message"
                      placeholder={community.message_placeholder}
                    ></textarea>
                  </div>
                </ContactForm>
              </div>
            </div>
          </div>
        </div>
      </section>
      ),
    },
    ...extraSections.map((section) => ({
      key: section.id,
      position: section.position,
      node: <SectionRenderer sections={[section]} />,
    })),
  ];

  blocks.sort((a, b) => a.position - b.position);

  return (
    <div className="page-contact">
      {blocks.map((block) => (
        <Fragment key={block.key}>{block.node}</Fragment>
      ))}
    </div>
  );
}
