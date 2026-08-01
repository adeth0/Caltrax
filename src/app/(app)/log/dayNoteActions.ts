"use server";

import { startOfDay } from "date-fns";
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

export async function saveDayNoteAction(note: string) {
  const userId = await requireUserId();
  const trimmed = note.trim();
  const date = startOfDay(new Date());

  if (!trimmed) {
    // An empty save is treated as "clear the note" -- simpler than
    // requiring a separate delete action for the common case of
    // someone just clearing the textbox and hitting save.
    await db.dayNote.deleteMany({ where: { userId, date } });
    revalidatePath("/log");
    return;
  }

  await db.dayNote.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, note: trimmed },
    update: { note: trimmed },
  });
  revalidatePath("/log");
}
