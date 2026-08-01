"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return user.id;
}

/**
 * Creates a new share link, replacing any existing one for this user --
 * the old token stops working immediately (upsert overwrites it), which
 * is the intended way to revoke access to whoever had the previous
 * link before handing out a new one.
 */
export async function generateDiaryShareAction(): Promise<{ token: string }> {
  const userId = await requireUserId();
  const token = randomBytes(24).toString("hex");

  await db.diaryShare.upsert({
    where: { userId },
    create: { userId, token },
    update: { token, createdAt: new Date() },
  });

  revalidatePath("/settings");
  return { token };
}

export async function revokeDiaryShareAction() {
  const userId = await requireUserId();
  await db.diaryShare.deleteMany({ where: { userId } });
  revalidatePath("/settings");
}
