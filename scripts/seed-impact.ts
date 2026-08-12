// One-off seed script for the impact page's dynamic sections.
// Run with: NODE_OPTIONS="--experimental-websocket" npx tsx scripts/seed-impact.ts
//
// Inserts the 4 impact sections that were promoted to dynamic (Supabase-backed)
// content: hero, photo-text (families), voices, case-study (deployed) — using
// the real, current copy from app/(site)/impact/page.tsx verbatim, at
// positions 0-3 matching DOM order.
//
// Per the scope decision for this page, the following sections stay 100%
// hardcoded (not seeded here, no matching admin block shape / structural
// mismatch): the "METRICS" stat-row, "Year in review" (.annual), "How
// philanthropic investment creates public value" (.funding), and the
// Insights CTA at the bottom. The families section's .comp-card comparison
// widget also stays hardcoded — it's not part of admin's photo-text shape.
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
    .eq("slug", "impact")
    .single();

  if (pageError || !page) {
    console.error("Could not find 'impact' page row:", pageError);
    process.exit(1);
  }

  // Wipe any existing impact sections so this script is safely re-runnable.
  const { error: deleteError } = await supabase.from("sections").delete().eq("page_id", page.id);
  if (deleteError) {
    console.error("Failed to clear existing impact sections:", deleteError);
    process.exit(1);
  }

  const sections: SectionInsert[] = [
    {
      page_id: page.id,
      type: "hero",
      position: 0,
      name: "Our Impact",
      content: {
        headline: "Our Impact",
        subtitle: "Measurable results for families and state systems",
        text: "Verify My Income makes income verification faster, more accurate, and less burdensome — for everyone in the process.",
        footnote: null,
        photo_url: "/images/impact/abdul-raheem-kannath-TBwW2tHnX9w-unsplash.jpg",
        photo_alt: "A family plays and spends time together",
        button_primary: null,
        button_secondary: null,
      },
    },
    {
      page_id: page.id,
      type: "photo-text",
      position: 1,
      name: "From hours of paperwork to five minutes — without leaving home",
      content: {
        side: "left",
        heading: "From hours of paperwork to five minutes — without leaving home",
        text: [
          "Before VMI, verifying income for SNAP or Medicaid meant finding old pay stubs, printing forms, visiting an office, and waiting. If something was missing, the process started over. For someone navigating a job change, caring for children, or managing a health crisis, this time tax could mean weeks without benefits.",
          "With Verify My Income, an applicant receives a secure link from their agency. They consent to share their payroll data and connect to their employer's payroll system. In under five minutes, a verified income report is delivered directly to their caseworker. No documents to find. No follow-up calls. No delays.",
        ],
        pullquote: null,
        photo_url: "/images/impact/khaled-ali-e8ZJeTnfP6U-unsplash.jpg",
        photo_alt: "A woman looking at her phone",
      },
    },
    {
      page_id: page.id,
      type: "voices",
      position: 2,
      name: "Real people. Real experiences.",
      content: {
        heading: "Real people. Real experiences.",
        quotes: [
          {
            quote: "Easy process as I'm awful with technology & this was simple.",
            name: "Pennsylvania VMI user",
            role: "",
          },
          {
            quote:
              "It was simple to enter just my username and password from the payroll company. This is much less time-consuming than uploading my monthly pay stubs.",
            name: "Pennsylvania VMI user",
            role: "",
          },
          {
            quote:
              "Everything [was easy]. Sometimes it's hard getting paycheck stubs and dealing with sending them out or bringing them in [person]. This way is great.",
            name: "Arizona VMI user",
            role: "",
          },
          {
            quote:
              "All I had to do was login to my ADP account and that was it. No uploading pictures or scanning or faxing or going anywhere.",
            name: "Pennsylvania VMI user",
            role: "",
          },
          {
            quote:
              "Just super easy to navigate, and I expected to take hours away from my family and it took very little time, thank you.",
            name: "Arizona VMI user",
            role: "",
          },
        ],
      },
    },
    {
      page_id: page.id,
      type: "case-study",
      position: 3,
      name: "Deployed and delivering results",
      content: {
        cards: [
          {
            heading: "Pennsylvania Department of Human Services",
            text: "Case study forthcoming — pending draft and approval from PA DHS.",
            photo_url: "/images/impact/katherine-mcadoo-HLKNH1-ITr0-unsplash.jpg",
            photo_alt: "Pennsylvania State Capitol building",
            link: "#",
          },
          {
            heading: "Arizona Department of Economic Security",
            text: "Case study forthcoming — pending draft and approval from AZ DES.",
            photo_url: "/images/impact/nils-huenerfuerst-yPGXOJNofgA-unsplash.jpg",
            photo_alt: "Arizona State Capitol building",
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

  console.log(`Inserted ${data?.length ?? 0} sections for 'impact':`);
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

  console.log(`\nVerification: ${verify?.length ?? 0} rows now exist for page 'impact'.`);
  console.table(verify);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
