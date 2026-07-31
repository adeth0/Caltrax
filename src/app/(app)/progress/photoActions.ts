"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { uploadBase64Image } from "@/lib/storage";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export async function addProgressPhotoAction(
  imageBase64: string,
  imageMediaType: string,
  note: string | null
) {
  const userId = await requireUserId();

  const imageUrl = await uploadBase64Image({
    userId,
    base64: imageBase64,
    mediaType: imageMediaType,
    path: `progress-photos/${crypto.randomUUID()}.jpg`,
  });

  await db.progressPhoto.create({
    data: { userId, imageUrl, note: note?.trim() || undefined },
  });

  revalidatePath("/progress");
}

export async function deleteProgressPhotoAction(id: string) {
  const userId = await requireUserId();
  await db.progressPhoto.deleteMany({ where: { id, userId } });
  revalidatePath("/progress");
}
