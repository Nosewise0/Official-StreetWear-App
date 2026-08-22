import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase/supaBaseAdmin";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

const ADMIN_EMAILS = ["admin1@gmail.com", "nonsaker021@gmail.com"];
const BUCKET = "receipts";
const SIGNED_URL_EXPIRY = 60 * 60; // 1 hour

async function assertAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !ADMIN_EMAILS.includes(user.email)) return null;
  return user;
}

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }

  // Generate signed URLs for each receipt
  const ordersWithUrls = await Promise.all(
    (orders ?? []).map(async (order) => {
      if (!order.receipt_path) return { ...order, receiptUrl: null };
      const { data: signedData } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(order.receipt_path, SIGNED_URL_EXPIRY);
      return { ...order, receiptUrl: signedData?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ data: ordersWithUrls });
}

export async function PATCH(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, adminNotes } = await req.json();

  if (!id || !["verified", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status, admin_notes: adminNotes ?? null })
    .eq("id", id);

  if (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
