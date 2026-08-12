"use client";

import { useState, useTransition } from "react";
import { updateEmail } from "@/lib/admin/settings";

export default function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState(currentEmail);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setMessage({ type: "error", text: "Enter a valid email address." });
      return;
    }
    startTransition(async () => {
      const result = await updateEmail(trimmed);
      if (result.ok) {
        setMessage({ type: "success", text: "Email address updated." });
      } else {
        setMessage({ type: "error", text: result.error ?? "Couldn't update email." });
      }
    });
  }

  return (
    <form className="a-card" onSubmit={handleSubmit}>
      <div className="a-settings-card-title">Email address</div>
      <div className="a-settings-card-sub">
        This is the email you use to log in and the one notifications are sent to.
      </div>
      <div className="a-field" style={{ marginTop: 0 }}>
        <label htmlFor="email-input">Email address</label>
        <input
          className="a-input"
          type="email"
          id="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {message ? (
        <div className="a-field-hint" style={{ color: message.type === "error" ? "#B91C1C" : "var(--park-green)" }}>
          {message.text}
        </div>
      ) : null}
      <div className="a-settings-actions">
        <button type="submit" className="a-btn a-btn-primary" disabled={isPending}>
          {isPending ? "Saving…" : "Save email"}
        </button>
      </div>
    </form>
  );
}
