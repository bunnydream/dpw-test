// One-off seed script for the product page's dynamic sections.
// Run with: NODE_OPTIONS="--experimental-websocket" npx tsx scripts/seed-product.ts
//
// Inserts the 6 product-page sections that were promoted to dynamic
// (Supabase-backed) content: hero, content-cards ("Built to fit your
// systems"), photo-text ("The verification problem"), photo-text
// ("Accessible by design, not as an afterthought"), steps ("The path to a
// pilot"), and case-study ("In the field") — using the real, current copy
// from app/(site)/product/page.tsx verbatim, at positions 0-5 matching DOM
// order.
//
// Sections intentionally left OUT (stay fully hardcoded in page.tsx, per the
// scope decision documented in AGENTS.md / the task brief):
//   - the integration section's trailing "inline-note" paragraph and the
//     io-pill labels (auto-generated, not stored)
//   - the "the-problem" section's 4-item ps-acc-list accordion
//   - the .talk-cta CTA banner
//   - the .compare-full comparison table (7 rows need 3 cells each —
//     ct-dim/ct-them/ct-vmi — but admin's row shape only models
//     heading+text, i.e. 2 cells; left fully hardcoded rather than inventing
//     an unmodeled shape)
//   - the "Questions to Ask..." section (vendor-q) — it's 100% a 7-item
//     accordion with no plain text at all, doesn't match admin's text shape
//   - the access-section's callout-stat (65% stat block)
//   - the pilot section's trailing inline-note paragraph
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

process.loadEnvFile(".env.local");

function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

type SectionInsert = Database["public"]["Tables"]["sections"]["Insert"];

async function main() {
  const supabase = createAdminClient();

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id, slug")
    .eq("slug", "product")
    .single();

  if (pageError || !page) {
    console.error("Could not find 'product' page row:", pageError);
    process.exit(1);
  }

  // Wipe any existing product sections so this script is safely re-runnable.
  const { error: deleteError } = await supabase.from("sections").delete().eq("page_id", page.id);
  if (deleteError) {
    console.error("Failed to clear existing product sections:", deleteError);
    process.exit(1);
  }

  const sections: SectionInsert[] = [
    {
      page_id: page.id,
      type: "hero",
      position: 0,
      name: "Verify My Income",
      content: {
        headline: "Verify My Income",
        subtitle: "The verification service layer between payroll data and state benefit systems",
        text: "VMI is an end-to-end verification service that handles the entire journey income data takes, from the applicant's payroll provider, through a consent-driven workflow, to a caseworker-ready report delivered to the state's eligibility system. VMI is designed around enrollment outcomes, not just data retrieval.",
        footnote: null,
        photo_url: "/images/product/product-hero.png",
        photo_alt: "VMI product interface showing income verification on mobile",
        button_primary: { text: "Request a Demo", link: "/contact" },
        button_secondary: null,
      },
    },
    {
      page_id: page.id,
      type: "content-cards",
      position: 1,
      name: "Built to fit your systems",
      content: {
        heading: "Built to fit your systems",
        text: "VMI integrates with existing state benefit systems through multiple deployment options:",
        cards: [
          {
            heading: "API integration with state eligibility systems",
            text: "Connect VMI directly to your existing eligibility infrastructure. Income reports are delivered in real time to your system of record via SFTP, S3, encrypted email, or webhooks API.",
            photo_url: "/images/product/bee-oI9Q3fXF3_0-unsplash.jpg",
            photo_alt: "Classical government building with columns and dome",
          },
          {
            heading: "Standalone portal accessible via unique link per household",
            text: "Launch fast with zero development resources. Each household receives a unique link to a fully hosted, state-branded VMI portal in English and Spanish.",
            photo_url: "/images/product/kelly-sikkema-FqqaJI9OxMI-unsplash.jpg",
            photo_alt: "Father carrying baby boy",
          },
          {
            heading: "Embedded widget in state application portals",
            text: "Incorporate VMI directly into your existing application flow. Applicants never leave your portal during the verification step.",
            photo_url: "/images/product/emile-perron-xrVDYZRGdw4-unsplash.jpg",
            photo_alt: "MacBook Pro showing programming language",
          },
        ],
      },
    },
    {
      page_id: page.id,
      type: "photo-text",
      position: 2,
      name: "The verification problem",
      content: {
        heading: "The verification problem",
        text: "States face four systemic problems with income verification. VMI is built to address all of them — not as a data feed, but as a complete service.",
        photo_url: "/images/product/product-verify.png",
        photo_alt:
          "VMI data flow diagram — applicant to payroll connection to VMI validation to caseworker-ready report to state eligibility system",
      },
    },
    {
      page_id: page.id,
      type: "photo-text",
      position: 3,
      name: "Accessible by design, not as an afterthought",
      content: {
        heading: "Accessible by design, not as an afterthought",
        text: [
          "DPW is investing in accessibility research in partnership with the AARP Foundation, with independent third-party accessibility auditing. VMI is designed to meet Section 508 and WCAG 2.1 AA accessibility standards. The platform supports English and Spanish.",
          "We do not treat accessibility as a compliance checkbox. We are conducting original research into how income verification tools can be made usable for older adults, people with disabilities, and individuals with limited English proficiency. Findings from this research will be published and shared with the field.",
        ],
        photo_url: "/images/product/centre-for-ageing-better-6S4Vx0ZHD4k-unsplash.jpg",
        photo_alt: "An older adult using a cell phone to verify her income",
      },
    },
    {
      page_id: page.id,
      type: "steps",
      position: 4,
      name: "The path to a pilot",
      content: {
        steps: [
          {
            heading: "Discovery (2–4 weeks)",
            description:
              "Meetings with executive leadership. Discovery sprint with interviews of policy experts, caseworkers, QC workers, community-based organizations, and applicants. Vendor coordination and integration scoping.",
          },
          {
            heading: "Configuration and integration (4–6 weeks)",
            description:
              "Technical integration setup (SFTP, S3, encrypted email, or webhooks API). State-specific configuration: branding, consent language, report format.",
          },
          {
            heading: "Pilot launch",
            description:
              "Launch with a defined population. Data collection and analysis. Iterative improvements based on caseworker and applicant feedback.",
          },
          {
            heading: "Expansion",
            description: "Scale to broader populations and additional programs based on pilot data.",
          },
        ],
      },
    },
    {
      page_id: page.id,
      type: "case-study",
      position: 5,
      name: "In the field",
      content: {
        cards: [
          {
            heading: "Pennsylvania Department of Human Services",
            text: "Case study forthcoming — pending draft and approval from PA DHS.",
            photo_url: "/images/product/katherine-mcadoo-HLKNH1-ITr0-unsplash.jpg",
            photo_alt: "Pennsylvania State Capitol building",
            link: "#",
          },
          {
            heading: "Arizona Department of Economic Security",
            text: "Case study forthcoming — pending draft and approval from AZ DES.",
            photo_url: "/images/product/nils-huenerfuerst-yPGXOJNofgA-unsplash.jpg",
            photo_alt: "Arizona State Capitol building with flag",
            link: "#",
          },
        ],
      },
    },
  ];

  const { data, error } = await supabase.from("sections").insert(sections).select("id, type, position");

  if (error) {
    console.error("Insert failed:", error);
    process.exit(1);
  }

  console.log(`Inserted ${data?.length ?? 0} sections for 'product':`);
  console.table(data);

  const { data: verify, error: verifyError } = await supabase
    .from("sections")
    .select("id, type, position, name")
    .eq("page_id", page.id)
    .order("position", { ascending: true });

  if (verifyError) {
    console.error("Verification query failed:", verifyError);
    process.exit(1);
  }

  console.log(`\nVerification: ${verify?.length ?? 0} rows now exist for page 'product'.`);
  console.table(verify);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
