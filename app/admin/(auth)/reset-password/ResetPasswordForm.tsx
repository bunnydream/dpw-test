"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (type !== "recovery" || !accessToken || !refreshToken) {
      setStatus("error");
      setError("This password reset link is invalid or has expired. Please request a new one.");
      return;
    }

    const supabase = createClient();
    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error: sessionError }) => {
      if (sessionError) {
        setStatus("error");
        setError(sessionError.message);
        return;
      }
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      setSessionReady(true);
    });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!sessionReady) {
      setStatus("error");
      setError("This password reset link is invalid or has expired. Please request a new one.");
      return;
    }
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

  if (status === "error" && !sessionReady) {
    return <p style={{ color: "var(--copper)", fontSize: "13.5px" }}>{error}</p>;
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
      <button type="submit" className="a-btn a-btn-primary a-login-submit" disabled={status === "saving" || !sessionReady}>
        {status === "saving" ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
