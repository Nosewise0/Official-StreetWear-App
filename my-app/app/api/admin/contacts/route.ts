import { NextResponse } from "next/server";
import { ADMIN_EMAILS } from "../../../lib/admin";
import { supabaseAdmin } from "../../../lib/supabase/supaBaseAdmin";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
