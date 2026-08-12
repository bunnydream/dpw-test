"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function listMedia() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function uploadMedia(formData: FormData): Promise<{ ok: boolean; url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "No file provided." };

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(path);
  const url = publicUrlData.publicUrl;

  const { error: insertError } = await supabase.from("media").insert({
    path,
    url,
    size_bytes: file.size,
  });
  if (insertError) return { ok: false, error: insertError.message };

  revalidatePath("/admin/media");
  return { ok: true, url };
}

export async function deleteMedia(id: string, path: string) {
  const supabase = createAdminClient();
  await supabase.storage.from("media").remove([path]);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
}
