import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/?newsletter=error", req.url));

  const { data, error } = await supabase
    .from("abonnes")
    .update({ confirmed: true, confirmation_token: null })
    .eq("confirmation_token", token)
    .select()
    .single();

  if (error || !data) return NextResponse.redirect(new URL("/?newsletter=error", req.url));

  return NextResponse.redirect(new URL("/?newsletter=confirmed", req.url));
}
