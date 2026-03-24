import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.redirect(new URL("/?newsletter=error", req.url));

  await supabase
    .from("abonnes")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", email.toLowerCase());

  return NextResponse.redirect(new URL("/?newsletter=unsubscribed", req.url));
}
