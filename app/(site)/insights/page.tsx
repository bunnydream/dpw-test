import type { Metadata } from "next";
import InsightsFilter from "@/components/InsightsFilter";
import LinkedCard from "@/components/blocks/LinkedCard";
import { createClient } from "@/lib/supabase/server";
import { getSeoSettings } from "@/lib/site-settings";
import { resolveMetadata } from "@/lib/seo";
import "./insights.css";

export async function generateMetadata(): Promise<Metadata> {
  const siteSeo = await getSeoSettings();
  return resolveMetadata({ item: null, fallbackTitle: "Insights", path: "/insights", siteSeo });
}

function excerptFrom(text: string | undefined, max = 160) {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}...`;
}

export default async function InsightsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const publishedPosts = posts ?? [];
  const postIds = publishedPosts.map((p) => p.id);

  // Derive each card's excerpt from its first paragraph-type block. One
  // batched query for all posts on the page, then keep only the
  // lowest-position paragraph per post (the block list is ordered by
  // position, so the first row seen for a given post_id is its earliest).
  const excerptByPostId: Record<string, string> = {};
  if (postIds.length > 0) {
    const { data: blocks } = await supabase
      .from("blog_blocks")
      .select("post_id, content")
      .in("post_id", postIds)
      .eq("type", "paragraph")
      .order("position", { ascending: true });

    for (const block of blocks ?? []) {
      if (excerptByPostId[block.post_id]) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = (block.content as any)?.text as string | undefined;
      if (text) excerptByPostId[block.post_id] = excerptFrom(text);
    }
  }

  const categories = Array.from(new Set(publishedPosts.map((p) => p.category).filter(Boolean)));

  return (
    <div className="page-insights">
      {/* HERO */}
      <section className="hero">
        <div className="hero-left reveal">
          <h1>Insights</h1>
          <div className="hero-heading-stack" style={{ marginBottom: "28px" }}>
            <p className="hero-tagline">
              Field notes, service design research, and policy analysis from Digital Public Works
            </p>
          </div>
        </div>
        <div className="hero-img reveal d2">
          <img src="/images/insights/writing.jpg" alt="Open notebook and pen on a desk" loading="eager" />
        </div>
      </section>

      {/* POSTS */}
      <section className="posts section-pad">
        <div className="section-inner">
          <InsightsFilter categories={categories}>
            {publishedPosts.map((post, idx) => {
              const excerpt = excerptByPostId[post.id];
              const delayClass = idx % 3 === 1 ? "d1" : idx % 3 === 2 ? "d2" : "";
              return (
                <LinkedCard
                  key={post.id}
                  href={`/insights/${post.slug}`}
                  label={post.category}
                  heading={post.title}
                  text={excerpt}
                  photoUrl={post.featured_image_url}
                  photoAlt={post.featured_image_alt}
                  dataCat={post.category}
                  className={`reveal${delayClass ? ` ${delayClass}` : ""}`}
                />
              );
            })}
          </InsightsFilter>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="subscribe section-pad">
        <div className="section-inner">
          <div className="subscribe-inner">
            <div className="reveal">
              <h2 className="subscribe-h">Stay in the loop</h2>
              <p className="subscribe-sub">Get notified when we publish new insights.</p>
            </div>
            <div className="reveal d1">
              <form className="subscribe-form">
                <input
                  className="subscribe-input"
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  autoComplete="email"
                />
                <button type="submit" className="btn btn-forge">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
