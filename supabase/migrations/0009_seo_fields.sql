-- Additive-only: nullable SEO override columns on pages/blog_posts, plus a
-- new 'seo' site_settings row for sitewide defaults. No drops, no rewrites
-- of existing columns/constraints. Mirrors the 'nav'/'footer' pattern from
-- 0003_site_settings_and_deleted_blogs.sql.

alter table pages
  add column meta_title text,
  add column meta_description text,
  add column og_image_url text,
  add column canonical_url text,
  add column noindex boolean not null default false;

alter table blog_posts
  add column meta_title text,
  add column meta_description text,
  add column og_image_url text,
  add column canonical_url text,
  add column noindex boolean not null default false;

insert into site_settings (key, value) values
  ('seo', '{
    "titleSuffix": "— Digital Public Works",
    "defaultMetaDescription": "Digital Public Works is an independent 501(c)(3) nonprofit building digital infrastructure that strengthens communities.",
    "defaultOgImageUrl": null,
    "faviconUrl": null,
    "twitterHandle": null
  }'::jsonb)
on conflict (key) do nothing;
