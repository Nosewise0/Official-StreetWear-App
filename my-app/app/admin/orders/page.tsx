"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface ShippingAddress {
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  gcash_number: string;
  receipt_path: string | null;
  receiptUrl: string | null;
  status: "pending" | "verified" | "rejected";
  admin_notes?: string | null;
}

type StatusFilter = "all" | "pending" | "verified" | "rejected";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  },
};

function StatusBadge({ status }: { status: Order["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.15em] uppercase border px-2.5 py-1 ${cfg.classes}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ReceiptModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-lg w-full bg-background border border-border shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Payment Receipt</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <Image
            src={url}
            alt="Payment receipt"
            width={600}
            height={800}
            className="w-full max-h-[70vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(order.admin_notes ?? "");
  const [updating, setUpdating] = useState(false);
  const [receiptModalUrl, setReceiptModalUrl] = useState<string | null>(null);

  const updateStatus = async (status: "verified" | "rejected" | "pending") => {
    setUpdating(true);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status, adminNotes: notes }),
      });
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const date = new Date(order.created_at).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      {receiptModalUrl && <ReceiptModal url={receiptModalUrl} onClose={() => setReceiptModalUrl(null)} />}

      <div className="border border-border bg-background hover:bg-muted/20 transition-colors">
        {/* Row header */}
        <button
          type="button"
          className="w-full text-left px-6 py-5 flex items-center gap-4"
          onClick={() => setExpanded(p => !p)}
        >
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-6 items-center min-w-0">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{order.customer_name}</p>
              <p className="text-[10px] text-foreground/40 font-light truncate">{order.customer_email}</p>
            </div>
            <p className="text-xs text-foreground/50 font-light whitespace-nowrap hidden sm:block">{date}</p>
            <p className="text-sm font-light tabular-nums whitespace-nowrap hidden sm:block">₱{order.total.toFixed(2)}</p>
            <StatusBadge status={order.status} />
          </div>
          <div className="shrink-0 text-foreground/30">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t border-border px-6 py-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Customer info */}
              <div className="space-y-2">
                <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Customer</p>
                <p className="text-sm font-light">{order.customer_name}</p>
                <p className="text-xs text-foreground/50 font-light">{order.customer_email}</p>
                {order.customer_phone && <p className="text-xs text-foreground/50 font-light">{order.customer_phone}</p>}
              </div>

              {/* Shipping address */}
              <div className="space-y-2">
                <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Shipping Address</p>
                <p className="text-xs font-light leading-relaxed text-foreground/80">
                  {order.shipping_address.address}
                  {order.shipping_address.apartment ? `, ${order.shipping_address.apartment}` : ""}<br />
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br />
                  {order.shipping_address.country}
                </p>
              </div>

              {/* GCash info */}
              <div className="space-y-2">
                <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 font-medium">GCash Details</p>
                <p className="text-xs font-light">Sender: <span className="font-medium text-foreground">{order.gcash_number}</span></p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-light text-foreground/60">
                    <span>Subtotal</span><span>₱{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-light text-foreground/60">
                    <span>Shipping</span><span>₱{order.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-light text-foreground/60">
                    <span>VAT</span><span>₱{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-foreground pt-1 border-t border-border">
                    <span>Total</span><span>₱{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Order Items</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider">{item.name}</p>
                      <p className="text-[10px] text-foreground/40 mt-0.5">{item.size} · {item.color} · Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-light tabular-nums">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Receipt */}
            <div className="space-y-3">
              <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Payment Receipt</p>
              {order.receiptUrl ? (
                <div className="flex items-center gap-4">
                  <div
                    className="w-24 h-24 border border-border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative"
                    onClick={() => setReceiptModalUrl(order.receiptUrl)}
                  >
                    <Image
                      src={order.receiptUrl}
                      alt="Receipt thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setReceiptModalUrl(order.receiptUrl)}
                    className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase border border-border px-4 py-2.5 hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Full Receipt
                  </button>
                </div>
              ) : (
                <p className="text-xs text-foreground/40 font-light">No receipt uploaded</p>
              )}
            </div>

            {/* Admin notes + action buttons */}
            <div className="space-y-4 border-t border-border pt-6">
              <div className="space-y-2">
                <label className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 font-medium">Admin Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Add a note about this order..."
                  className="w-full bg-transparent border border-border p-3 text-xs font-light focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={updating || order.status === "verified"}
                  onClick={() => updateStatus("verified")}
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase bg-emerald-600 text-white px-6 py-3 hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Verify Payment
                </button>
                <button
                  type="button"
                  disabled={updating || order.status === "rejected"}
                  onClick={() => updateStatus("rejected")}
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                  Reject
                </button>
                {order.status !== "pending" && (
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus("pending")}
                    className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase border border-border px-6 py-3 hover:bg-muted transition-colors disabled:opacity-40"
                  >
                    <Clock className="w-3.5 h-3.5" /> Reset to Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      setOrders(json.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    verified: orders.filter(o => o.status === "verified").length,
    rejected: orders.filter(o => o.status === "rejected").length,
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Admin</p>
          <h2 className="text-3xl font-light tracking-[0.1em] uppercase">Orders</h2>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase border border-border px-4 py-2.5 hover:bg-muted transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
        {(["all", "pending", "verified", "rejected"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`bg-background px-6 py-5 text-left transition-colors hover:bg-muted ${filter === s ? "bg-muted" : ""}`}
          >
            <p className="text-2xl font-light">{loading ? "—" : counts[s]}</p>
            <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/40 mt-1 capitalize">{s === "all" ? "Total Orders" : s}</p>
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {(["all", "pending", "verified", "rejected"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-3 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
              filter === s
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground/40 hover:text-foreground"
            }`}
          >
            {s === "all" ? "All" : s} {!loading && <span className="ml-1 opacity-60">({counts[s]})</span>}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-px">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-background border border-border p-6 animate-pulse">
              <div className="flex gap-6 items-center">
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted w-40 rounded" />
                  <div className="h-2.5 bg-muted w-56 rounded" />
                </div>
                <div className="h-3 bg-muted w-20 rounded hidden sm:block" />
                <div className="h-3 bg-muted w-16 rounded hidden sm:block" />
                <div className="h-5 bg-muted w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-16 text-center space-y-4">
          <ShoppingBag className="w-10 h-10 text-foreground/20 mx-auto" />
          <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">
            {filter === "all" ? "No orders yet" : `No ${filter} orders`}
          </p>
        </div>
      ) : (
        <div className="space-y-px">
          {filtered.map(order => (
            <OrderRow key={order.id} order={order} onUpdate={() => fetchOrders(true)} />
          ))}
        </div>
      )}
    </div>
  );
}
