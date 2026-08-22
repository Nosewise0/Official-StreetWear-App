import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase/supaBaseAdmin";
import { createSupabaseServerClient } from "../../lib/supabaseServer";

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  gcashNumber: string;
  receiptPath: string;
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

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, created_at, items, total, status, shipping_address, admin_notes")
    .ilike("customer_email", user.email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch customer orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }

  const data = (orders ?? []).map((order) => ({
    id: order.id,
    created_at: order.created_at,
    status: order.status,
    total: toNumber(order.total),
    items: parseJsonArray(order.items),
    shipping_address: parseShipping(order.shipping_address),
    admin_notes: order.admin_notes ?? null,
  }));

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      shippingCost,
      tax,
      total,
      gcashNumber,
      receiptPath,
    } = body;

    // Basic validation
    if (!customerName || !customerEmail || !gcashNumber || !receiptPath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone ?? null,
        shipping_address: shippingAddress,
        items,
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        gcash_number: gcashNumber,
        receipt_path: receiptPath,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Order insert error:", error);
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
    }

    return NextResponse.json({ orderId: data.id }, { status: 201 });
  } catch (err) {
    console.error("Orders route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
