# Contact Form Handoff — Digital Public Works

> **Status: NOT being used for launch.** On 2026-08-12, decided to use **Formspree** instead — simpler, no backend code to build or maintain. See `summary.md`'s "Contact Form — Formspree Integration" section for the plan actually being implemented. This document is kept as a reference in case DPW wants to upgrade later to owning their own submission data instead of relying on a third party.

## Overview

The contact page has three independent forms. All submissions should be emailed to **info@digitalpublicworks.org** and saved to Supabase for recordkeeping.

**Stack:** Vercel (API routes) + Supabase (storage) + Resend (email delivery)

---

## The Three Forms

| Form name (HTML `name` attr) | Purpose | Fields |
|---|---|---|
| `state-partner-contact` | State agencies requesting a demo | first_name, last_name, email, organization, state, message |
| `funder-contact` | Funders / foundations | first_name, last_name, email, organization, message |
| `general-contact` | Press, general inquiries | first_name, last_name, email, subject, message |

---

## What to Build

### 1. Supabase table: `contact_submissions`

```sql
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  form_name text not null,          -- "state-partner-contact" | "funder-contact" | "general-contact"
  first_name text,
  last_name text,
  email text,
  organization text,
  state text,                        -- state-partner form only
  subject text,                      -- general form only
  message text,
  submitted_at timestamptz default now()
);
```

### 2. Vercel API route: `POST /api/contact`

Accepts JSON from the form, does three things:
1. Validates required fields (at minimum: email, first_name, form_name)
2. Inserts the row into `contact_submissions`
3. Sends an email via Resend to `info@digitalpublicworks.org`

**Request body:**
```json
{
  "form_name": "state-partner-contact",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@agency.gov",
  "organization": "State Dept. of Health",
  "state": "California",
  "message": "We're interested in piloting VMI for Medicaid."
}
```

**Email format** (to info@digitalpublicworks.org):
- Subject: `[DPW Contact] {form label} — {first_name} {last_name}`
  - Form labels: "State Partner Inquiry" / "Funder Inquiry" / "General Inquiry"
- Body: all submitted fields, plaintext is fine

**Response:**
- `200 { success: true }` on success
- `400 { error: "..." }` on validation failure
- `500 { error: "..." }` on server error

### 3. Update the HTML forms

Replace the current `<form method="POST" novalidate>` with JavaScript fetch submissions. Each form should:

1. Intercept submit with `preventDefault()`
2. POST JSON to `/api/contact` with the form's field values plus `form_name`
3. On success: hide the form, show a confirmation message (e.g. "Thanks — we'll be in touch soon.")
4. On error: show an inline error message without clearing the form

The submit button should show a loading state while the request is in flight.

---

## Environment Variables Needed

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=   # service role key, not anon — needed to insert server-side
RESEND_API_KEY=
```

---

## Resend Setup

- Domain: digitalpublicworks.org needs to be verified in Resend
- Send from: `no-reply@digitalpublicworks.org` (or similar)
- Send to: `info@digitalpublicworks.org`

---

## Notes

- No spam protection is specified yet — consider adding a honeypot field or Turnstile (Cloudflare, free) if spam becomes an issue
- The state dropdown in the state-partner form already has all 50 states + Washington D.C. as `<option>` values — pass the selected value as `state` in the payload
- The general form has a `subject` field; the other two do not
