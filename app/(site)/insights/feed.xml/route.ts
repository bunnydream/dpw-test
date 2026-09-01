import { createClient } from "@/lib/supabase/server";
import { excerptFrom } from "@/lib/blog-excerpt";
import { SITE_URL } from "@/lib/seo";

// Rebuild the feed at most once an hour rather than on every request —
// Brevo's RSS campaign only polls on the schedule you set anyway (e.g.
// monthly), so this just avoids hitting Supabase on every crawler request.
export const revalidate = 3600;

const MAX_ITEMS = 20;
const DESCRIPTION_LENGTH = 300;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function guessImageType(url: string) {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

export async function GET() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(MAX_ITEMS);

  const publishedPosts = posts ?? [];
  const postIds = publishedPosts.map((p) => p.id);

  // Same excerpt derivation as the /insights card list: the first
  // paragraph-type block per post, in one batched query.
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
      if (text) excerptByPostId[block.post_id] = excerptFrom(text, DESCRIPTION_LENGTH);
    }
  }

  const items = publishedPosts
    .map((post) => {
      const link = `${SITE_URL}/insights/${post.slug}`;
      const pubDate = new Date(post.published_at ?? post.created_at).toUTCString();
      const description = post.meta_description?.trim() || excerptByPostId[post.id] || "";
      // Brevo's RSS default template pulls the article image from
      // <enclosure>, so a post without a featured image just omits it.
      const enclosure = post.featured_image_url
        ? `\n      <enclosure url="${escapeXml(post.featured_image_url)}" type="${guessImageType(
            post.featured_image_url
          )}" length="0" />`
        : "";
      const category = post.category ? `\n      <category>${escapeXml(post.category)}</category>` : "";

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>${category}${enclosure}
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join("");

  const lastBuildDate = publishedPosts[0]
    ? new Date(publishedPosts[0].published_at ?? publishedPosts[0].created_at).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Digital Public Works — Insights</title>
    <link>${SITE_URL}/insights</link>
    <atom:link href="${SITE_URL}/insights/feed.xml" rel="self" type="application/rss+xml" />
    <description>Field notes, service design research, and policy analysis from Digital Public Works</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
