"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "@/lib/admin/settings";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation don't match." });
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(currentPassword, newPassword);
      if (result.ok) {
        setMessage({ type: "success", text: "Password updated." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: result.error ?? "Couldn't update password." });
      }
    });
  }

  return (
    <form className="a-card" onSubmit={handleSubmit}>
      <div className="a-settings-card-title">Password</div>
      <div className="a-settings-card-sub">Choose a password that&apos;s at least 8 characters long.</div>

      <div className="a-field" style={{ marginTop: 0 }}>
        <label htmlFor="current-password">Current password</label>
        <input
          className="a-input"
          type="password"
          id="current-password"
          placeholder="Enter your current password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="a-field">
        <label htmlFor="new-password">New password</label>
        <input
          className="a-input"
          type="password"
          id="new-password"
          placeholder="Enter a new password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="a-field">
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          className="a-input"
          type="password"
          id="confirm-password"
          placeholder="Re-enter the new password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {message ? (
        <div className="a-field-hint" style={{ color: message.type === "error" ? "#B91C1C" : "var(--park-green)" }}>
          {message.text}
        </div>
      ) : null}

      <div className="a-settings-actions">
        <button type="submit" className="a-btn a-btn-primary" disabled={isPending}>
          {isPending ? "Updating…" : "Update password"}
        </button>
      </div>
    </form>
  );
}
