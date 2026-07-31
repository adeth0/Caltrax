"use server";

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

export async function startFastAction(targetHours: number | null) {
  const userId = await requireUserId();

  // Safety net: close out any already-open session before starting a new
  // one, since only one fast should ever be active at a time. This
  // shouldn't normally happen given the UI only offers "start" when
  // there's no active session, but guards against, e.g., two tabs open.
  await db.fastingSession.updateMany({
    where: { userId, endedAt: null },
    data: { endedAt: new Date() },
  });

  await db.fastingSession.create({
    data: { userId, targetHours: targetHours ?? undefined },
  });

  revalidatePath("/dashboard");
}

export async function endFastAction(sessionId: string) {
  const userId = await requireUserId();
  await db.fastingSession.updateMany({
    where: { id: sessionId, userId, endedAt: null },
    data: { endedAt: new Date() },
  });
  revalidatePath("/dashboard");
}
