import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ShoppingListClient, type ShoppingItem } from "./ShoppingListClient";

export default async function ShoppingListPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const items = user
    ? await db.shoppingListItem.findMany({
        where: { userId: user.id },
        orderBy: [{ checked: "asc" }, { createdAt: "desc" }],
      })
    : [];

  const shoppingItems: ShoppingItem[] = items.map((item: (typeof items)[number]) => ({
    id: item.id,
    label: item.label,
    checked: item.checked,
    recipeName: item.recipeName,
  }));

  return <ShoppingListClient items={shoppingItems} />;
}
