"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(email: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/reset-password`,
  });
  return { ok: !error };
}
