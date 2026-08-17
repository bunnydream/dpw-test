-- Adds 9 new section types so the remaining hardcoded text/buttons on the 6
-- fixed pages can be made editable in admin. `icon-cards` is a reusable type
-- (offered in "Add a block"); the other 8 are page-specific one-off designs
-- (registered here so they're editable in place, but intentionally left out
-- of the admin "Add a block" list so they can't be reused elsewhere):
--   icon-cards:              { heading?, text?, footnote?, cards: [{ icon, label?, heading, text }] }
--   home-compare-table:      { heading, link_text, link, rows: [{ label, traditional, vmi }] }
--   product-problem-accordion: { items: [{ title, problem, solution }] } (fixed 4 items)
--   product-talk-cta:        { heading, subtext, link }
--   product-compare-table:   { heading, rows: [{ label, traditional, vmi }] }
--   product-vendor-questions: { heading, items: [{ question, answer }] }
--   impact-manual-table:     { manual_label, vmi_label, rows: [{ manual, vmi }] }
--   impact-year-in-review:   { heading, text, button_text, link }
--   contact-form-section:    { kicker_label, heading, text, field labels/placeholders, submit_label, success_message, address? }
alter table sections drop constraint sections_type_check;
alter table sections add constraint sections_type_check check (type in (
  'hero', 'stats', 'photo-text', 'steps', 'voices', 'partners',
  'cta', 'team-member', 'text', 'content-cards', 'comparison', 'case-study',
  'icon-cards', 'home-compare-table', 'product-problem-accordion',
  'product-talk-cta', 'product-compare-table', 'product-vendor-questions',
  'impact-manual-table', 'impact-year-in-review', 'contact-form-section'
));
