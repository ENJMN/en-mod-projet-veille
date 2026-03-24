"use server";

import { createClient } from "@/lib/supabase/server";

export async function markLeconComplete(
  userId: string,
  leconId: string,
  formationId: string
) {
  const supabase = await createClient();

  await supabase.from("progression").upsert(
    {
      user_id: userId,
      lecon_id: leconId,
      formation_id: formationId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lecon_id" }
  );
}
