// The 12 section types supported by the real schema (supabase/migrations/0001_init.sql's
// `sections.type` check constraint) — this is intentionally narrower than the mockup's
// "Add a block" list, which also offers granular primitives (heading/button/quote/accordion)
// that aren't part of the real content model.
import type { SectionType } from "@/lib/supabase/types";

export const BLOCK_TYPES: { type: SectionType; label: string; description: string }[] = [
  { type: "hero", label: "Hero", description: "The large banner at the top of a page, like on the Impact page." },
  { type: "stats", label: "Stat row", description: "A row of large numbers with short labels." },
  {
    type: "photo-text",
    label: "Photo + text",
    description: "An image beside a heading and paragraph. Choose which side the photo sits on.",
  },
  { type: "steps", label: "Step timeline", description: 'Numbered steps, like "How Verify My Income works."' },
  {
    type: "voices",
    label: "Quote carousel",
    description: 'A scrolling set of testimonial cards, like "Trusted by real people."',
  },
  { type: "partners", label: "Partners", description: 'A logo grid, like "Backed by." Show/hide or add partners.' },
  { type: "cta", label: "Call-to-action banner", description: "A full-width photo banner with a heading and button." },
  {
    type: "team-member",
    label: "Team member grid",
    description: "A grid of team member cards with a name, title, bio, and photo.",
  },
  { type: "text", label: "Text block", description: "An optional heading and a paragraph of body text." },
  {
    type: "content-cards",
    label: "Card grid",
    description: "A row of small labeled cards for display only, like feature highlights.",
  },
  {
    type: "comparison",
    label: "Comparison table",
    description: "Two-column comparison rows, each with a heading and description.",
  },
  {
    type: "case-study",
    label: "Linked card grid",
    description: "A grid of photo cards that link out to state or partner stories.",
  },
];

export const SECTION_TYPE_LABEL: Record<SectionType, string> = BLOCK_TYPES.reduce(
  (acc, b) => ({ ...acc, [b.type]: b.label }),
  {} as Record<SectionType, string>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function starterContent(type: SectionType): Record<string, any> {
  switch (type) {
    case "hero":
      return {
        headline: "New headline",
        subtitle: "",
        text: "",
        footnote: "",
        photo_url: "",
        photo_alt: "",
        button_primary: null,
        button_secondary: null,
      };
    case "stats":
      return {
        heading: "",
        stats: [
          { number: "", label: "" },
          { number: "", label: "" },
          { number: "", label: "" },
          { number: "", label: "" },
        ],
      };
    case "photo-text":
      return { side: "left", heading: "New heading", text: [""], pullquote: null, photo_url: "", photo_alt: "" };
    case "steps":
      return { steps: [{ heading: "", description: "", photo_url: "", photo_alt: "" }] };
    case "voices":
      return { heading: "New heading", quotes: [{ quote: "", name: "", role: "" }] };
    case "partners":
      return { heading: "New heading", partners: [] };
    case "cta":
      return { heading: "New heading", button_text: "Learn more", link: "/contact", background_photo_url: "" };
    case "team-member":
      return { members: [] };
    case "text":
      return { heading: "", text: "" };
    case "content-cards":
      return { heading: "", text: "", cards: [] };
    case "comparison":
      return { heading: "", column_a_title: "", column_b_title: "", rows: [] };
    case "case-study":
      return { cards: [] };
  }
}

export function starterName(type: SectionType): string {
  return `New ${SECTION_TYPE_LABEL[type].toLowerCase()}`;
}
