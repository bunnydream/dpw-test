-- Careers' "Careers intro" and "Open Positions" sections were both stored as
-- generic `text`-type sections, identified in careers/page.tsx by array index
-- (textSections[0] / textSections[1]) rather than by type. That breaks as
-- soon as any other generic "Text" block is added to the page — the new
-- block shifts the array indices, so the real "Open Positions" section gets
-- treated as an unclaimed "extra" (rendering at the bottom of the page,
-- unstyled) while the new block gets misidentified as "Open Positions" and
-- rendered in its place. Splitting them into their own dedicated types (same
-- pattern as every other page-specific one-off section, e.g.
-- impact-year-in-review, product-talk-cta) makes them identifiable
-- regardless of how many generic Text blocks get added around them.
--   careers-intro:     { text }
--   careers-openings:  { heading, text }
alter table sections drop constraint sections_type_check;
alter table sections add constraint sections_type_check check (type in (
  'hero', 'stats', 'photo-text', 'steps', 'voices', 'partners',
  'cta', 'team-member', 'text', 'content-cards', 'comparison', 'case-study',
  'icon-cards', 'home-compare-table', 'product-problem-accordion',
  'product-talk-cta', 'product-compare-table', 'product-vendor-questions',
  'impact-manual-table', 'impact-year-in-review', 'contact-form-section',
  'accordion', 'image', 'careers-intro', 'careers-openings'
));
