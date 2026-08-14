"use client";

import { useState } from "react";

const SITE_LINKS: [string, string][] = [
  ["/", "Home"],
  ["/about", "About"],
  ["/product", "Product"],
  ["/impact", "Impact"],
  ["/careers", "Careers"],
  ["/contact", "Contact"],
  ["/insights", "Insights / Blog"],
];

/** Page-or-custom-link dropdown, shared by the page editor and the
 * navbar/footer editors. */
export default function LinkPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [customMode, setCustomMode] = useState(() => !!value && !SITE_LINKS.some(([v]) => v === value));
  const selectValue = customMode ? "custom" : value || "";
  return (
    <div className="a-field">
      <label>{label}</label>
      <select
        className="a-select"
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "custom") {
            setCustomMode(true);
          } else {
            setCustomMode(false);
            onChange(v);
          }
        }}
      >
        {!value && !customMode ? (
          <option value="" disabled>
            Choose a page...
          </option>
        ) : null}
        {SITE_LINKS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
        <option value="custom">Custom link...</option>
      </select>
      {customMode ? (
        <input
          className="a-input"
          type="text"
          placeholder="https://..."
          style={{ marginTop: 8 }}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}
