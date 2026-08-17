-- Adds two new reusable section types requested after the editor-coverage
-- sweep:
--   accordion: { heading?, panels: [{ header, content }] }
--   image:     { photo_url, photo_alt? }
alter table sections drop constraint sections_type_check;
alter table sections add constraint sections_type_check check (type in (
  'hero', 'stats', 'photo-text', 'steps', 'voices', 'partners',
  'cta', 'team-member', 'text', 'content-cards', 'comparison', 'case-study',
  'icon-cards', 'home-compare-table', 'product-problem-accordion',
  'product-talk-cta', 'product-compare-table', 'product-vendor-questions',
  'impact-manual-table', 'impact-year-in-review', 'contact-form-section',
  'accordion', 'image'
));
