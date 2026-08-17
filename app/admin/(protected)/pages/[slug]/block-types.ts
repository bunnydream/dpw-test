// The 12 section types supported by the real schema (supabase/migrations/0001_init.sql's
// `sections.type` check constraint) — this is intentionally narrower than the mockup's
// "Add a block" list, which also offers granular primitives (heading/button/quote/accordion)
// that aren't part of the real content model.
import type { ReactNode } from "react";
import type { SectionType } from "@/lib/supabase/types";
import {
  BlockAccordionIcon,
  BlockCardsIcon,
  BlockCaseStudyIcon,
  BlockComparisonIcon,
  BlockCtaIcon,
  BlockHeroIcon,
  BlockIconCardsIcon,
  BlockImageIcon,
  BlockPartnersIcon,
  BlockPhotoTextIcon,
  BlockStatsIcon,
  BlockStepsIcon,
  BlockTeamIcon,
  BlockTextIcon,
  BlockVoicesIcon,
} from "./icons";

export const BLOCK_TYPES: { type: SectionType; label: string; description: string; icon: ReactNode }[] = [
  { type: "hero", label: "Hero", description: "The large banner at the top of a page, like on the Impact page.", icon: BlockHeroIcon() },
  { type: "stats", label: "Stat row", description: "A row of large numbers with short labels.", icon: BlockStatsIcon() },
  {
    type: "photo-text",
    label: "Photo + text",
    description: "An image beside a heading and paragraph. Choose which side the photo sits on.",
    icon: BlockPhotoTextIcon(),
  },
  { type: "steps", label: "Step timeline", description: 'Centered numbered steps, like Product\'s "The path to a pilot."', icon: BlockStepsIcon() },
  {
    type: "voices",
    label: "Quote carousel",
    description: 'A scrolling set of testimonial cards, like "Trusted by real people."',
    icon: BlockVoicesIcon(),
  },
  { type: "partners", label: "Partners", description: 'A logo grid, like "Backed by." Show/hide or add partners.', icon: BlockPartnersIcon() },
  { type: "cta", label: "Call-to-action banner", description: "A full-width photo banner with a heading and button.", icon: BlockCtaIcon() },
  {
    type: "team-member",
    label: "Team member grid",
    description: "A grid of team member cards with a name, title, bio, and photo.",
    icon: BlockTeamIcon(),
  },
  { type: "text", label: "Text block", description: "An optional heading and a paragraph of body text.", icon: BlockTextIcon() },
  {
    type: "content-cards",
    label: "Card grid",
    description: "A row of small labeled cards for display only, like feature highlights.",
    icon: BlockCardsIcon(),
  },
  {
    type: "comparison",
    label: "Comparison table",
    description: "Two-column comparison rows, each with a heading and description.",
    icon: BlockComparisonIcon(),
  },
  {
    type: "case-study",
    label: "Linked card grid",
    description: "A grid of photo cards that link out to state or partner stories.",
    icon: BlockCaseStudyIcon(),
  },
  {
    type: "icon-cards",
    label: "Icon cards",
    description: 'A row of icon cards with a heading and text each, like "We fix the process."',
    icon: BlockIconCardsIcon(),
  },
  {
    type: "accordion",
    label: "Accordion",
    description: 'Expandable panels, like "Questions to Ask Any Income Verification Vendor."',
    icon: BlockAccordionIcon(),
  },
  {
    type: "image",
    label: "Image",
    description: "A single standalone photo.",
    icon: BlockImageIcon(),
  },
];

/** Page-specific, one-off designs used by exactly one fixed page each —
 * registered here (for the section-list label + starter content) but
 * intentionally left out of BLOCK_TYPES so they can't be added via
 * "Add a block" or reused anywhere else. */
const HIDDEN_BLOCK_TYPES: { type: SectionType; label: string }[] = [
  { type: "home-compare-table", label: "Compare table (home)" },
  { type: "product-problem-accordion", label: "Problem accordion (product)" },
  { type: "product-talk-cta", label: "Talk CTA banner (product)" },
  { type: "product-compare-table", label: "Compare table (product)" },
  { type: "product-vendor-questions", label: "Vendor questions (product)" },
  { type: "impact-manual-table", label: "Manual vs. VMI table (impact)" },
  { type: "impact-year-in-review", label: "Year in review (impact)" },
  { type: "contact-form-section", label: "Contact form section" },
];

export const SECTION_TYPE_LABEL: Record<SectionType, string> = [...BLOCK_TYPES, ...HIDDEN_BLOCK_TYPES].reduce(
  (acc, b) => ({ ...acc, [b.type]: b.label }),
  {} as Record<SectionType, string>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function starterContent(type: SectionType): Record<string, any> {
  switch (type) {
    case "hero":
      return {
        headline: "",
        subtitle: "",
        text: "",
        footnote: "",
        photo_url: "",
        photo_alt: "",
        photo_position: { x: 50, y: 50 },
        button_primary: null,
        button_secondary: null,
      };
    case "stats":
      return {
        heading: "",
        stats: [
          { number: "", label: "" },
          { number: "", label: "" },
        ],
      };
    case "photo-text":
      return { side: "left", heading: "", text: [""], pullquote: null, photo_url: "", photo_alt: "" };
    case "steps":
      return { heading: "", steps: [{ heading: "", description: "", photo_url: "", photo_alt: "" }] };
    case "voices":
      return { heading: "", quotes: [{ quote: "", name: "", role: "" }] };
    case "partners":
      return { heading: "", partners: [] };
    case "cta":
      return { heading: "", text: "", button_text: "", link: "", background_photo_url: "" };
    case "team-member":
      return { heading: "", members: [] };
    case "text":
      return { heading: "", text: "" };
    case "content-cards":
      return { heading: "", text: "", cards: [] };
    case "comparison":
      return { heading: "", column_a_title: "", column_b_title: "", rows: [] };
    case "case-study":
      return { cards: [] };
    case "icon-cards":
      return { heading: "", text: "", footnote: "", cards: [] };
    case "home-compare-table":
      return { heading: "", traditional_label: "Traditional Approaches", vmi_label: "VMI — Digital Public Works", link_text: "", link: "/product#comparison", rows: [] };
    case "product-problem-accordion":
      return {
        solution_label: "How VMI solves it",
        items: [
          { title: "", problem: "", solution: "" },
          { title: "", problem: "", solution: "" },
          { title: "", problem: "", solution: "" },
          { title: "", problem: "", solution: "" },
        ],
      };
    case "product-talk-cta":
      return { heading: "", subtext: "", link: "/contact" };
    case "product-compare-table":
      return { heading: "", traditional_label: "Traditional Approaches", vmi_label: "VMI — Digital Public Works", rows: [] };
    case "product-vendor-questions":
      return { heading: "", items: [] };
    case "impact-manual-table":
      return { manual_label: "Manual process", vmi_label: "With Verify My Income", rows: [] };
    case "impact-year-in-review":
      return { heading: "", text: "", button_text: "", link: "#" };
    case "contact-form-section":
      return {
        kicker_label: "",
        heading: "",
        text: "",
        first_name_label: "First name",
        first_name_placeholder: "Jane",
        last_name_label: "Last name",
        last_name_placeholder: "Smith",
        email_label: "Email",
        email_placeholder: "jane@example.com",
        message_label: "Message",
        message_placeholder: "",
        submit_label: "Submit",
        success_message: "Thanks for reaching out.",
      };
    case "accordion":
      return { heading: "", panels: [{ header: "", content: "" }] };
    case "image":
      return { photo_url: "", photo_alt: "" };
  }
}

export function starterName(type: SectionType): string {
  return `New ${SECTION_TYPE_LABEL[type].toLowerCase()}`;
}
