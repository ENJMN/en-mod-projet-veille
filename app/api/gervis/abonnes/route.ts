import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminKey } from "@/lib/admin-auth";
import { Database } from "@/lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { data } = await supabase
    .from("abonnes")
    .select("id, email, nom, confirmed, subscribed_at, unsubscribed_at")
    .order("subscribed_at", { ascending: false });

  return NextResponse.json({ abonnes: data ?? [] });
}
