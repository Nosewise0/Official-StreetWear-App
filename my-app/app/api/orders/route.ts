import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase/supaBaseAdmin";

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
