"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type Status = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  formName: string;
  action: string;
  submitLabel: string;
  successMessage: string;
  children: ReactNode;
};

export default function ContactForm({ formName, action, submitLabel, successMessage, children }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-status form-status--success" role="status">
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form name={formName} method="POST" noValidate onSubmit={handleSubmit}>
      <div className="form-stack">
        {children}
        {status === "error" && (
          <p className="form-status form-status--error" role="alert">
            Something went wrong sending your message. Please try again or email us directly.
          </p>
        )}
        <button
          type="submit"
          className="btn btn-forge"
          style={{ alignSelf: "flex-start", marginTop: "4px" }}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
