import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Adds an email address to the Brevo ("Stay in the loop") mailing list.
// Requires BREVO_API_KEY and BREVO_LIST_ID to be set in the environment
// (see .env.local). Keeping the Brevo API key server-side, behind this
// route, is what keeps it out of the client bundle.
export async function POST(request: Request) {
  let email: string | undefined;

  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim() : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    console.error("Brevo is not configured: missing BREVO_API_KEY or BREVO_LIST_ID.");
    return NextResponse.json({ error: "Subscriptions are temporarily unavailable." }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [Number(listId)],
        // Adds an existing contact to the list instead of erroring out
        // when someone who's already subscribed submits again.
        updateEnabled: true,
      }),
    });

    // Brevo returns 201 for a brand-new contact and 204 when an existing
    // contact was updated (e.g. added to the list). Anything else is an error.
    if (res.ok || res.status === 204) {
      return NextResponse.json({ ok: true });
    }

    const errorBody = await res.json().catch(() => null);
    console.error("Brevo subscribe error:", res.status, errorBody);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  } catch (err) {
    console.error("Brevo subscribe request failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
