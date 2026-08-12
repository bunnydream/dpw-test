import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "../insights.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!post) {
    return { title: "Insights — Digital Public Works" };
  }
  return { title: `${post.title} — Digital Public Works` };
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

  return (
    <div className="page-insights">
      <article className="insight-article section-pad">
        <div className="section-inner">
          {post.featured_image_url && (
            <figure className="insight-featured-photo reveal">
              <img src={post.featured_image_url} alt={post.featured_image_alt ?? ""} />
              {post.featured_image_caption && <figcaption>{post.featured_image_caption}</figcaption>}
            </figure>
          )}

          <div className="insight-header reveal d1">
            <span className="case-state insight-category">{post.category}</span>
            <h1>{post.title}</h1>
          </div>

          <div className="insight-body reveal d2">
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
