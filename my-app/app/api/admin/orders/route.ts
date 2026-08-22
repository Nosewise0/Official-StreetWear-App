import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAILS } from "../../../lib/admin";
import { supabaseAdmin } from "../../../lib/supabase/supaBaseAdmin";
import { createSupabaseServerClient } from "../../../lib/supabaseServer";

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

  const ordersWithUrls = await Promise.all(
    (orders ?? []).map(async (order) => {
      let receiptUrl: string | null = null;
      if (order.receipt_path) {
        const { data: signedData } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(order.receipt_path, SIGNED_URL_EXPIRY);
        receiptUrl = signedData?.signedUrl ?? null;
      }

      return {
        ...order,
        items: parseJsonArray(order.items),
        shipping_address: parseShipping(order.shipping_address),
        subtotal: toNumber(order.subtotal),
        shipping_cost: toNumber(order.shipping_cost),
        tax: toNumber(order.tax),
        total: toNumber(order.total),
        receiptUrl,
      };
    })
  );

  return NextResponse.json({ data: ordersWithUrls });
}

function toNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseJsonArray(value: unknown) {
  const parsed = parseJsonValue(value);
  return Array.isArray(parsed) ? parsed : [];
}

function parseShipping(value: unknown) {
  const parsed = parseJsonValue(value);
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed;
  }
  return { address: "", city: "", state: "", zip: "", country: "" };
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
