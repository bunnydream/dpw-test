// One-off seed script for the about page's dynamic sections.
// Run with: NODE_OPTIONS="--experimental-websocket" npx tsx scripts/seed-about.ts
//
// Inserts the 5 about sections — hero, photo-text (story), team-member,
// partners, text (org status) — using the real, current copy from
// app/(site)/about/page.tsx verbatim, at positions 0-4 matching DOM order.
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
    .eq("slug", "about")
    .single();

  if (pageError || !page) {
    console.error("Could not find 'about' page row:", pageError);
    process.exit(1);
  }

  // Wipe any existing about sections so this script is safely re-runnable.
  const { error: deleteError } = await supabase.from("sections").delete().eq("page_id", page.id);
  if (deleteError) {
    console.error("Failed to clear existing about sections:", deleteError);
    process.exit(1);
  }

  const sections: SectionInsert[] = [
    {
      page_id: page.id,
      type: "hero",
      position: 0,
      name: "About Us",
      content: {
        headline: "About Us",
        subtitle: "Our Mission: To deliver dignified, frictionless government services at cost.",
        photo_url: "/images/about/paulina-herpel-yxqVPJFAYHg-unsplash.jpg",
        photo_alt: "Two people working on laptops",
      },
    },
    {
      page_id: page.id,
      type: "photo-text",
      position: 1,
      name: "How Digital Public Works started",
      content: {
        side: "left",
        heading: "How Digital Public Works started",
        text: [
          "Digital Public Works was founded in 2025 by former United States Digital Service employees who spent years working inside the federal government on benefits modernization and service delivery. We saw firsthand how states struggle with income verification: the tools are expensive, the data is stale, and the burden falls on the people who can least afford it.",
          "We left federal service to build the infrastructure that states need but cannot fund individually. DPW is an independent 501(c)(3) nonprofit. Our team of nine includes seven USDS veterans with deep experience in federal and state government systems.",
        ],
        photo_url: "/images/about/mapbox-ZT5v0puBjZI-unsplash.jpg",
        photo_alt: "Four people at laptops in a board meeting",
      },
    },
    {
      page_id: page.id,
      type: "team-member",
      position: 2,
      name: "Our team",
      content: {
        members: [
          {
            name: "Michael Burstein",
            title: "Co-Founder, Executive Director",
            text: "Michael Burstein is a civic technologist, strategist, and attorney with deep experience in navigating bureaucracies to deliver digital products that serve the American public. Prior to launching Digital Public Works, Michael served at the United States Digital Service. During his time at USDS, he was Director of the Facing Financial Shock portfolio and the Chief of Staff for the USDS-CDC team during the COVID response. Michael has been the executive in charge of legal and finance functions for a digital design and software development firm that was named one of the 1,000 fastest growing companies in the U.S. in 2020 and 2021 by Inc.com.",
            photo_url: "/headshots/Michael.png",
            photo_alt: "Michael Burstein",
          },
          {
            name: "Patricia Perozo",
            title: "Co-Founder, Head of Delivery",
            text: "Patricia Perozo is a civic technologist, backend software engineer, and part-time product manager with experience across the federal government, Silicon Valley tech companies, and startups. Prior to co-founding Digital Public Works, she served as a Digital Service Expert at the United States Digital Service, where she led the Income Verification as a Service (IVaaS) team, contributed to COVID response efforts, and supported the implementation of several Inflation Reduction Act programs. Outside of work, she enjoys salsa dancing, practicing yoga, and watching Formula 1.",
            photo_url: "/headshots/PatriciaHeadshot-BW.png",
            photo_alt: "Patricia Perozo",
          },
          {
            name: "Kali Lewis",
            title: "Interim Director of Design & Research",
            text: "Kali Lewis is a service designer with a background in ethnographic research. She anchors teams in the nuanced realities of end users, makes abstract concepts tangible, and draws out the collective wisdom of interdisciplinary teams. She specializes in crafting research plans, conducting interviews, and synthesizing insights into actionable outcomes. Most recently at USDS, she focused on Customer Experience projects with the Small Business Administration and the inter-agency life experience project Facing a Financial Shock.",
            photo_url: "/headshots/Kali.png",
            photo_alt: "Kali Lewis",
          },
          {
            name: "Cle Diggins",
            title: "Director of Engineering",
            text: "Cle Diggins is a seasoned technology leader with nearly 20 years of experience leading cross-functional teams across public and private sectors. Prior to joining Digital Public Works, Cle was a member of the United States Digital Service leading government and contractor teams across numerous agencies including the CDC, DOT, HRSA, VA, and CMS with a focus on modernization and usability of these systems.",
            photo_url: "/headshots/Cle.png",
            photo_alt: "Cle Diggins",
          },
          {
            name: "Jeff Catania",
            title: "Senior Software Engineer",
            text: "Jeff Catania is a software engineer focused on the intersection of cloud architecture, data visualization, and user experience to build elegant solutions to complex problems. Prior to joining Digital Public Works, Jeff launched Medicaid and SNAP Income Verification tools at U.S. Digital Service, virtual AI tutors at Harvard Business School Online, a digital assortment platform at Levi Strauss and Company, and a Data+Design capability at Accenture Interactive.",
            photo_url: "/headshots/Jeff-BW.png",
            photo_alt: "Jeff Catania",
          },
          {
            name: "Tatiana Smith",
            title: "Senior Product Designer",
            text: "Tatiana Smith is a product designer, full-spectrum doula, community activist, and mother based in Raleigh, North Carolina. Tatiana served as a UX Product Designer and Researcher at the United States Digital Service where she supported the launch of the Affordable Connectivity Program with the FCC, FAFSA impact analysis with the Department of Education, and Online Passport Renewals and Visa Modernization at the Department of State.",
            photo_url: "/headshots/Tatiana.png",
            photo_alt: "Tatiana Smith",
          },
          {
            name: "Erika Tom",
            title: "Senior Product Manager",
            text: "Erika Tom is a product manager with a background in data analytics and customer success. Prior to joining Digital Public Works, she worked at the United States Digital Service unblocking bottlenecks in refugee admissions, reimagining disease surveillance data features at CDC, and supporting claims processing modernization at CMS. She also has past product experience in machine learning and marketing startups, as well as with a government contractor.",
            photo_url: "/headshots/ErikaTom_BW.jpg",
            photo_alt: "Erika Tom",
          },
          {
            name: "Anna Banchik",
            title: "Senior UX Researcher",
            text: "Anna Banchik is a UX researcher driven by understanding people's experiences, the barriers they face, and the creative ways they navigate complex challenges. Drawing on an ethnographic background, her research has spanned topics from self-employment experiences among day laborers and women entrepreneurs to how human rights researchers use social media. Before joining Digital Public Works, she worked at Meta and volunteered with U.S. Digital Response. She holds a Ph.D. in Sociology from the University of Texas at Austin.",
            photo_url: "/headshots/Anna%20Banchik.png",
            photo_alt: "Anna Banchik",
          },
          {
            name: "Runako Godfrey",
            title: "Software Engineer",
            text: "Runako Godfrey is a software engineer with expertise in shipping complex systems. His experience includes work building web and cloud applications in both the nonprofit and commercial sectors. He is passionate about using technology in empathetic ways to solve pressing problems for normal people. When not building, Runako enjoys reading fiction and spending time with his wife and daughters.",
            photo_url: "/headshots/Runako_bw.jpg",
            photo_alt: "Runako Godfrey",
          },
        ],
      },
    },
    {
      page_id: page.id,
      type: "partners",
      position: 3,
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
            pending: true,
          },
        ],
      },
    },
    {
      page_id: page.id,
      type: "text",
      position: 4,
      name: "Organization Status",
      content: {
        heading: "Organization Status",
        text: "Digital Public Works is an independent 501(c)(3) nonprofit organization.",
      },
    },
  ];

  const { data, error } = await supabase.from("sections").insert(sections).select("id, type, position");

  if (error) {
    console.error("Insert failed:", error);
    process.exit(1);
  }

  console.log(`Inserted ${data?.length ?? 0} sections for 'about':`);
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

  console.log(`\nVerification: ${verify?.length ?? 0} rows now exist for page 'about'.`);
  console.table(verify);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
