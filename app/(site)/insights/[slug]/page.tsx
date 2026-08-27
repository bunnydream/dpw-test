import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSeoSettings } from "@/lib/site-settings";
import { resolveMetadata } from "@/lib/seo";
import "../insights.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const [{ data: post }, siteSeo] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("title, meta_title, meta_description, og_image_url, canonical_url, noindex")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle(),
    getSeoSettings(),
  ]);

  if (!post) {
    return { title: "Insights — Digital Public Works" };
  }
  return resolveMetadata({ item: post, fallbackTitle: post.title, path: `/insights/${slug}`, siteSeo });
}

export default async function InsightPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!post) {
    notFound();
  }

  const { data: blocks } = await supabase
    .from("blog_blocks")
    .select("*")
    .eq("post_id", post.id)
    .order("position", { ascending: true });

  const postedDate = new Date(post.published_at ?? post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="page-insights">
      <section className="insight-hero">
        <div className="section-inner insight-hero-inner">
          <div className="insight-hero-title-col reveal">
            <h1>{post.title}</h1>
            {post.subtitle ? <p className="insight-subtitle">{post.subtitle}</p> : null}
          </div>
          <div className="insight-hero-meta-col reveal d1">
            {post.author ? (
              <div className="insight-meta-row">
                <span className="insight-meta-label">Written By</span>
                <span className="insight-meta-value">{post.author}</span>
              </div>
            ) : null}
            <div className="insight-meta-row">
              <span className="insight-meta-label">Posted</span>
              <span className="insight-meta-value">{postedDate}</span>
            </div>
            <div className="insight-meta-row">
              <span className="insight-meta-label">Category</span>
              <span className="insight-meta-value">{post.category}</span>
            </div>
          </div>
        </div>
      </section>

      {post.featured_image_url && (
        <figure className="insight-featured-photo reveal d2">
          <img src={post.featured_image_url} alt={post.featured_image_alt ?? ""} />
          {post.featured_image_caption && <figcaption>{post.featured_image_caption}</figcaption>}
        </figure>
      )}

      <article className="insight-article section-pad">
        <div className="section-inner">
          <div className="insight-body reveal d3">
            {(blocks ?? []).map((block) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const content = block.content as any;
              switch (block.type) {
                case "heading":
                  return (
                    <h2 key={block.id} className="insight-heading">
                      {content.text}
                    </h2>
                  );
                case "paragraph":
                  return (
                    <p key={block.id} className="body-p">
                      {content.text}
                    </p>
                  );
                case "quote":
                  return (
                    <blockquote key={block.id} className="pullquote">
                      <p className="pq-text">{content.text}</p>
                    </blockquote>
                  );
                case "photo":
                  return (
                    <figure key={block.id} className="insight-photo-block">
                      <img src={content.url} alt={content.alt ?? ""} />
                      {content.caption && <figcaption>{content.caption}</figcaption>}
                    </figure>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
