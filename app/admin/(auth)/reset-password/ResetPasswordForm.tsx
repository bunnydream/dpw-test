"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setError("Passwords don't match.");
      return;
    }
    setStatus("saving");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setStatus("error");
      setError(updateError.message);
      return;
    }
    setStatus("done");
    setTimeout(() => router.push("/admin"), 1500);
  }

  if (status === "done") {
    return <p>Password updated — redirecting you to the dashboard…</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="a-field">
        <label htmlFor="new-password">New password</label>
        <input
          className="a-input"
          type="password"
          id="new-password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="a-field">
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          className="a-input"
          type="password"
          id="confirm-password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      {status === "error" ? (
        <p style={{ color: "var(--copper)", fontSize: "13.5px", marginBottom: "12px" }}>{error}</p>
      ) : null}
      <button type="submit" className="a-btn a-btn-primary a-login-submit" disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
