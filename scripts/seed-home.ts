// One-off seed script for the home page's dynamic sections.
// Run with: npx tsx scripts/seed-home.ts
//
// Inserts the 8 home sections that were promoted to dynamic (Supabase-backed)
// content: hero, stats, photo-text (pressure), steps, photo-text (model),
// voices, partners, cta — using the real, current copy from
// app/(site)/page.tsx verbatim, at positions 0-7 matching DOM order.
//
// Note: the task brief described "7 matched sections" but also explicitly
// called for both of home's photo-text sections ("pressure" and "model") to
// go dynamic — which is 8 rows total. This script seeds all 8, at positions
// 0-7, since that's what matches the page's actual DOM order and the
// PhotoText component spec.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

// Load .env.local (this is a plain node/tsx script, not a Next.js request,
// so Next's automatic env loading doesn't apply here).
process.loadEnvFile(".env.local");

// lib/supabase/admin.ts's createAdminClient() can't be imported directly
// here: it starts with `import "server-only"`, whose default export
// unconditionally throws outside of Next's bundler (the "react-server"
// export condition that makes it a no-op is only applied by Next's
// webpack/turbopack build, not by plain tsx/node execution). This inlines
// the same client construction for this standalone script.
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
    .eq("slug", "home")
    .single();

  if (pageError || !page) {
    console.error("Could not find 'home' page row:", pageError);
    process.exit(1);
  }

  // Wipe any existing home sections so this script is safely re-runnable.
  const { error: deleteError } = await supabase.from("sections").delete().eq("page_id", page.id);
  if (deleteError) {
    console.error("Failed to clear existing home sections:", deleteError);
    process.exit(1);
  }

  const sections: SectionInsert[] = [
    {
      page_id: page.id,
      type: "hero",
      position: 0,
      name: "What if income verification worked for families and states instead of vendors?",
      content: {
        headline: "What if income verification worked for families and states instead of vendors?",
        subtitle: null,
        text: "Digital Public Works is the nonprofit alternative. We built Verify My Income because families deserve a better experience — and states deserve a partner that isn't charging per query while the backlog grows. Open source. At cost. No lock-in.",
        footnote:
          "No procurement required to begin the conversation. We start with a free, philanthropically funded pilot.",
        photo_url: "/images/home/oosman-exptal-2_lHgY_ZvQo-unsplash.jpg",
        photo_alt: "Person holding a baby",
        button_primary: { text: "Request a demo", link: "/contact" },
        button_secondary: { text: "See how it works", link: "#how-vmi-works" },
      },
    },
    {
      page_id: page.id,
      type: "stats",
      position: 1,
      name: "Impact numbers",
      content: {
        stats: [
          { number: "Under 5 min", label: "Median time to verify income" },
          { number: "85%", label: "Of applicants report no difficulty" },
          { number: "93%", label: "Of caseworkers prefer VMI reports" },
          { number: "7.5×", label: "Faster than manual verification" },
        ],
      },
    },
    {
      page_id: page.id,
      type: "photo-text",
      position: 2,
      name: "The pressure is real",
      content: {
        side: "left",
        heading: "The pressure is real",
        text: [
          "H.R. 1 expands work requirements for SNAP and Medicaid. The Workforce for the Community Act introduces new community engagement verification requirements. States face financial penalties for SNAP payment error rates above 6%.",
          "The tools states have today were not built for this moment. Quarterly wage databases are months behind. Commercial verification services charge per query with prices that go up every year. When the data is wrong or incomplete, caseworkers absorb the cost in follow-up calls, manual processing, and an ever-growing backlog. Meanwhile, applicants face longer waits and higher burdens.",
          "Real-time payroll data is part of the answer, but raw data is not verification. A payroll connection can pull income records from an employer's system. It cannot tell you whether those records contain what a caseworker needs to make an eligibility determination. Without a layer that validates, contextualizes, and delivers that data in a usable format, states trade one set of problems for another.",
          "VMI addresses all of these pressures: real-time income data that reduces payment errors, a validation layer that ensures caseworkers receive only eligibility-grade reports, and a streamlined process that removes the verification bottleneck.",
        ],
        pullquote: "Real-time payroll data is part of the answer, but raw data is not verification.",
        photo_url: "/images/home/zach-wear-5_aNqrJeMIY-unsplash.jpg",
        photo_alt: "Woman working on laptop while sitting on a couch",
      },
    },
    {
      page_id: page.id,
      type: "steps",
      position: 3,
      name: "How Verify My Income works",
      content: {
        steps: [
          {
            heading: "Applicant receives a secure link",
            description:
              "During or after applying for benefits, the applicant is sent a link to verify their earned income. No paper. No office visit required.",
            photo_url: "/images/home/freestocks-mw6Onwg4frY-unsplash.jpg",
            photo_alt: "Applicant receiving a secure link on their phone",
          },
          {
            heading: "Applicant consents and connects their payroll",
            description:
              "The applicant reviews a plain-language consent screen, then connects to their payroll provider. No pay stubs to find. No documents to upload.",
            photo_url: "/images/home/andrej-lisakov-iIJJGpkp0As-unsplash.jpg",
            photo_alt: "Applicant consenting and connecting their payroll on their phone",
          },
          {
            heading: "Verified income data is delivered to the caseworker",
            description:
              "A standardized income report, verified directly from the payroll source, is delivered to the state benefit system. Every report passes through programmatic validation before delivery — caseworkers only receive eligibility-grade data and can act immediately.",
            photo_url: "/images/home/maxime-FV9uOiGYr74-unsplash.jpg",
            photo_alt: "Caseworker receiving verified income data at their desk",
          },
        ],
      },
    },
    {
      page_id: page.id,
      type: "photo-text",
      position: 4,
      name: "A better model",
      content: {
        side: "right",
        heading: "A better model for income verification",
        text: [
          "Traditional verification vendors lock you into rising costs and proprietary systems. When you need to switch, you start from scratch.",
          "DPW is different. We are a registered 501(c)(3) nonprofit. We are legally prohibited from profiting on this work. Your price reflects our operating costs and nothing more. As more states join the platform, the per-state cost decreases. States share infrastructure instead of building alone.",
          "Our code is open source under the AGPL-3.0 license, published on GitHub. If you adopt VMI, you have full access to the source code, the integration architecture, and all documentation. No vendor lock-in. No black boxes. No surprise overages.",
        ],
        pullquote: "No vendor lock-in. No black boxes. No surprise overages.",
        photo_url: "/images/home/karthik-balakrishnan-Y4zNMW3pQAs-unsplash.jpg",
        photo_alt: "Caseworker and client reviewing income verification together on a phone",
      },
    },
    {
      page_id: page.id,
      type: "voices",
      position: 5,
      name: "Trusted by real people",
      content: {
        heading: "Trusted by real people",
        quotes: [
          {
            quote:
              "This is a good product. It will make case reviews easier. This makes it almost fool-proof and it's low cost time-wise for the client.",
            name: "State Pilot Agency Leadership",
            role: "",
          },
          {
            quote:
              "Being able to update and report my income online is far more efficient than doing so by other means (in person, mail, etc.) and I am grateful for this option.",
            name: "Pennsylvania beneficiary",
            role: "Verify My Income user",
          },
          {
            quote: "It was quick and simple and best of all didn't require me to jump through hoops.",
            name: "Pennsylvania beneficiary",
            role: "Verify My Income user",
          },
        ],
      },
    },
    {
      page_id: page.id,
      type: "partners",
      position: 6,
      name: "Backed by",
      content: {
        heading: "Backed by",
        partners: [
          {
            name: "DRK Foundation",
            logo_url: "/partner-logos/drk-foundation.png",
            link: "https://www.drkfoundation.org",
            visible: true,
          },
          {
            name: "AARP Foundation",
            logo_url: "/images/funders/aarp-foundation-logo.png",
            link: "https://www.aarp.org/aarp-foundation/",
            visible: true,
          },
          {
            name: "Families and Workers Fund",
            logo_url: "/images/funders/fwf-logo-dark.svg",
            link: "https://familiesandworkers.org",
            visible: true,
          },
          {
            name: "Pritzker Children's Initiative",
            logo_url: "/partner-logos/pritzkerchildrensinitiative-logo-color-rgb.jpeg",
            link: "https://www.pritzkerchildrensinitiative.org",
            visible: true,
          },
          {
            name: "Samvid Ventures",
            logo_url: "/partner-logos/logo-samvid-ventures.webp",
            link: "https://samvidventures.com",
            visible: true,
          },
        ],
      },
    },
    {
      page_id: page.id,
      type: "cta",
      position: 7,
      name: "Ready to pilot Verify My Income?",
      content: {
        heading: "Ready to pilot Verify My Income in your jurisdiction? Let's talk.",
        button_text: "Request a demo",
        link: "/contact",
        background_photo_url: "/images/home/group-talking.jpg",
      },
    },
  ];

  const { data, error } = await supabase.from("sections").insert(sections).select("id, type, position");

  if (error) {
    console.error("Insert failed:", error);
    process.exit(1);
  }

  console.log(`Inserted ${data?.length ?? 0} sections for 'home':`);
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

  console.log(`\nVerification: ${verify?.length ?? 0} rows now exist for page 'home'.`);
  console.table(verify);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
