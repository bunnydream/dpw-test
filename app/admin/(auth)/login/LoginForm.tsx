"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "./actions";
import { requestPasswordReset } from "./reset-actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, undefined);
  const [email, setEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault();
    if (!email) {
      setResetStatus("error");
      return;
    }
    setResetStatus("sending");
    const result = await requestPasswordReset(email);
    setResetStatus(result.ok ? "sent" : "error");
  }

  return (
    <>
      <form action={formAction}>
        <div className="a-field">
          <label htmlFor="email">Email address</label>
          <input
            className="a-input"
            type="email"
            id="email"
            name="email"
            placeholder="you@digitalpublicworks.org"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="a-field">
          <label htmlFor="password">Password</label>
          <input
            className="a-input"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>

        {state?.error ? (
          <p style={{ color: "var(--copper)", fontSize: "13.5px", marginBottom: "12px" }}>{state.error}</p>
        ) : null}

        <button type="submit" className="a-btn a-btn-primary a-login-submit" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="a-login-links">
        {resetStatus === "sent" ? (
          <span>Check your email for a password reset link.</span>
        ) : (
          <a href="#" onClick={handleForgotPassword}>
            {resetStatus === "sending" ? "Sending…" : "Forgot your password?"}
          </a>
        )}
        {resetStatus === "error" ? (
          <div style={{ color: "var(--copper)", fontSize: "13px", marginTop: "6px" }}>
            Enter your email address above first.
          </div>
        ) : null}
      </div>
    </>
  );
}
