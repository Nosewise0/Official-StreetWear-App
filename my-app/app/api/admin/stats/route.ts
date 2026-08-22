import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase/supaBaseAdmin";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

const ADMIN_EMAILS = ["admin1@gmail.com", "nonsaker021@gmail.com", "bilat2@gmail.com"];

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, contacts, users, orders] = await Promise.all([
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabaseAdmin.auth.admin.listUsers(),
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    products: products.count ?? 0,
    contacts: contacts.count ?? 0,
    users: users.data?.users?.length ?? 0,
    orders: orders.count ?? 0,
  });
}
