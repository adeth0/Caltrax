import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Single public bucket for all user-uploaded images (meal photos, profile photos).
 * Must exist in Supabase (Storage → New bucket, name exactly "user-uploads", public)
 * with a storage policy allowing authenticated users to insert into their own
 * `${auth.uid()}/...` path — see README setup steps.
 */
const BUCKET = "user-uploads";

/**
 * Uploads a base64-encoded image (no `data:` prefix) to Supabase Storage
 * under the current user's own path, and returns its public URL. Runs
 * with the caller's own session (not the admin client) so Storage's RLS
 * policy — authenticated users can only write under their own user ID —
 * is what actually enforces "you can only upload your own images", not
 * application code alone.
 */
export async function uploadBase64Image(params: {
  userId: string;
  base64: string;
  mediaType: string;
  /** Path segment after the user ID, e.g. "meal-photos/<uuid>.jpg" or "profile.jpg". */
  path: string;
}): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const bytes = Buffer.from(params.base64, "base64");
  const fullPath = `${params.userId}/${params.path}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fullPath, bytes, {
    contentType: params.mediaType,
    upsert: true,
  });
  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fullPath);
  return data.publicUrl;
}
