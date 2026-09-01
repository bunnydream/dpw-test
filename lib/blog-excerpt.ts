/**
 * Truncates a paragraph's raw text into a short excerpt/description, used
 * both for the Insights card previews and the RSS feed's item descriptions.
 */
export function excerptFrom(text: string | undefined, max = 160) {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trim()}...`;
}
