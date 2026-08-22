"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Package,
  MapPin,
  Settings,
  LogOut,
  Check,
  Loader2,
  Shield,
  Heart,
  ShoppingBag,
  ArrowRight,
  Mail,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

type ProfileTab = "overview" | "orders" | "addresses" | "settings";

interface OrderItem {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface ShippingAddress {
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface CustomerOrder {
  id: string;
  created_at: string;
  status: "pending" | "verified" | "rejected";
  total: number;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  admin_notes: string | null;
}

const STATUS_STYLES: Record<CustomerOrder["status"], string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  verified: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

const STATUS_LABELS: Record<CustomerOrder["status"], string> = {
  pending: "Payment Pending",
  verified: "Verified",
  rejected: "Rejected",
};

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function shortOrderId(id: string) {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

function itemQty(item: OrderItem) {
  return item.quantity ?? 0;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut, updateProfile, resetPassword } = useAuth();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [fullName, setFullName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [resetSending, setResetSending] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const [marketingEmail, setMarketingEmail] = useState(true);
  const [dropAlerts, setDropAlerts] = useState(true);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(String(user.user_metadata.full_name));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setOrdersLoading(true);
    setOrdersError(null);

    fetch("/api/orders")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load orders.");
        return json.data as CustomerOrder[];
      })
      .then((data) => {
        if (!cancelled) setOrders(data ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          setOrders([]);
          setOrdersError(err instanceof Error ? err.message : "Failed to load orders.");
        }
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground flex items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-foreground/50" />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/60">
            Loading Account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full border border-border p-10 space-y-6">
          <div className="w-16 h-16 bg-muted flex items-center justify-center mx-auto border border-border">
            <UserIcon className="w-8 h-8 text-foreground/60" strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-light tracking-widest uppercase">Members Only</h1>
            <p className="text-xs font-light text-foreground/70 leading-relaxed">
              Please sign in to access your OSW profile, order history, and exclusive member perks.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/login"
              className="w-full bg-foreground text-background py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="w-full border border-border py-4 text-xs font-medium tracking-[0.2em] uppercase hover:border-foreground transition-colors text-foreground"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userDisplayName =
    (user.user_metadata?.full_name as string) ||
    user.email.split("@")[0] ||
    "Member";

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    const { error } = await updateProfile(fullName);
    setSavingProfile(false);

    if (error) {
      setProfileError(error);
    } else {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handlePasswordReset = async () => {
    setResetSending(true);
    setResetMessage(null);

    const { error } = await resetPassword(user.email);
    setResetSending(false);

    if (error) {
      setResetMessage(`Error: ${error}`);
    } else {
      setResetMessage("Password reset email dispatched to your inbox.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const latestOrder = orders[0];
  const latestAddress = latestOrder?.shipping_address;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground">

      <div className="border-b border-border">
        <div className="container mx-auto px-6 max-w-7xl py-4 flex items-center justify-between text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/50">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">My Account</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="w-full bg-foreground text-background py-16 md:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 12px)",
          }}
        />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-background text-foreground flex items-center justify-center text-2xl font-light tracking-widest border border-background/20 shrink-0 select-none">
                {getInitials(userDisplayName)}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-light tracking-tight uppercase leading-tight">
                  {userDisplayName}
                </h1>
                <div className="flex items-center gap-4 text-xs font-light text-background/60 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 opacity-60" /> {user.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 opacity-60" /> Joined{" "}
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-PH", { month: "short", year: "numeric" })
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-background/20 pt-6 md:pt-0 md:pl-8">
              <div className="text-left space-y-1">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-background/50">Status</p>
                <p className="text-xs font-medium tracking-[0.1em] uppercase text-background flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Active Member
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16 items-start">

          <nav className="flex flex-row lg:flex-col border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-8 gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: UserIcon },
              { id: "orders", label: "Order History", icon: Package, badge: orders.length },
              { id: "addresses", label: "Addresses", icon: MapPin },
              { id: "settings", label: "Settings", icon: Settings },
            ].map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as ProfileTab)}
                className={`flex items-center justify-between px-4 py-3.5 text-xs font-medium tracking-[0.2em] uppercase transition-colors text-left whitespace-nowrap ${
                  activeTab === id
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  {label}
                </span>
                {badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 font-bold ${
                    activeTab === id ? "bg-background text-foreground" : "bg-muted border border-border"
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}

            <div className="hidden lg:block pt-8 mt-8 border-t border-border">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium tracking-[0.2em] uppercase text-red-500 hover:bg-red-500/10 transition-colors text-left border border-red-500/20"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </nav>

          <div className="min-w-0">

            {activeTab === "overview" && (
              <div className="space-y-12">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase">Dashboard Overview</h2>
                  <p className="text-xs font-light text-foreground/60">
                    Welcome back. Here is an overview of your member profile and activity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 border border-border bg-muted space-y-3">
                    <div className="flex items-center justify-between text-foreground/50">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Total Orders</span>
                      <Package className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <p className="text-3xl font-light tracking-tight">{ordersLoading ? "—" : orders.length}</p>
                    <button onClick={() => setActiveTab("orders")} className="text-[10px] font-medium tracking-[0.2em] uppercase underline underline-offset-4 hover:text-foreground/60 transition-colors">
                      View History →
                    </button>
                  </div>

                  <div className="p-6 border border-border bg-muted space-y-3">
                    <div className="flex items-center justify-between text-foreground/50">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Wishlist Items</span>
                      <Heart className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <p className="text-3xl font-light tracking-tight">{wishlistCount}</p>
                    <Link href="/wishlist" className="text-[10px] font-medium tracking-[0.2em] uppercase underline underline-offset-4 hover:text-foreground/60 transition-colors">
                      View Wishlist →
                    </Link>
                  </div>

                  <div className="p-6 border border-border bg-muted space-y-3">
                    <div className="flex items-center justify-between text-foreground/50">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Cart Items</span>
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <p className="text-3xl font-light tracking-tight">{cartCount}</p>
                    <Link href="/cart" className="text-[10px] font-medium tracking-[0.2em] uppercase underline underline-offset-4 hover:text-foreground/60 transition-colors">
                      View Cart →
                    </Link>
                  </div>
                </div>

                <div className="border border-border space-y-0">
                  {ordersLoading ? (
                    <div className="p-10 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
                    </div>
                  ) : ordersError ? (
                    <div className="p-10 text-center">
                      <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">{ordersError}</p>
                    </div>
                  ) : !latestOrder ? (
                    <div className="p-10 text-center space-y-4">
                      <Package className="w-8 h-8 text-foreground/20 mx-auto" />
                      <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">No orders yet</p>
                      <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase underline underline-offset-4">
                        Shop the collection <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold tracking-[0.2em] uppercase">Recent Order</h3>
                          <p className="text-[10px] font-light text-foreground/60">Order #{shortOrderId(latestOrder.id)}</p>
                        </div>
                        <span className={`px-3 py-1 border text-[10px] font-bold tracking-widest uppercase ${STATUS_STYLES[latestOrder.status] ?? STATUS_STYLES.pending}`}>
                          {STATUS_LABELS[latestOrder.status] ?? latestOrder.status}
                        </span>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs font-light text-foreground/70">
                          <span>Date: {formatOrderDate(latestOrder.created_at)}</span>
                          <span className="font-medium text-foreground">₱{latestOrder.total.toFixed(2)}</span>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-border">
                          {latestOrder.items.length === 0 ? (
                            <p className="text-xs text-foreground/40">No products on this order</p>
                          ) : (
                            latestOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="font-medium uppercase">{item.name} ({item.size} / {item.color})</span>
                                <span className="text-foreground/60">x{itemQty(item)}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="px-6 py-4 bg-muted border-t border-border flex justify-end">
                        <button
                          onClick={() => setActiveTab("orders")}
                          className="text-xs font-medium tracking-[0.2em] uppercase flex items-center gap-2 hover:text-foreground/60 transition-colors"
                        >
                          View All Orders <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase">Order History</h2>
                  <p className="text-xs font-light text-foreground/60">
                    Track current shipments and view details of past purchases.
                  </p>
                </div>

                {ordersLoading ? (
                  <div className="border border-border p-16 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-foreground/40" />
                  </div>
                ) : ordersError ? (
                  <div className="border border-border p-16 text-center">
                    <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">{ordersError}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="border border-border p-16 text-center space-y-4">
                    <Package className="w-10 h-10 text-foreground/20 mx-auto" />
                    <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">No orders yet</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase underline underline-offset-4"
                    >
                      Shop the collection <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border">
                        <div className="p-6 border-b border-border bg-muted flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold tracking-widest uppercase">Order #{shortOrderId(order.id)}</span>
                              <span className={`px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase border ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending}`}>
                                {STATUS_LABELS[order.status] ?? order.status}
                              </span>
                            </div>
                            <p className="text-[10px] font-light text-foreground/60">Placed on {formatOrderDate(order.created_at)}</p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-xs font-bold tracking-wider uppercase">Total</p>
                            <p className="text-lg font-light text-foreground">₱{order.total.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="p-6 space-y-4">
                          <div className="space-y-3">
                            {order.items.length === 0 ? (
                              <p className="text-xs text-foreground/40">No products on this order</p>
                            ) : (
                              order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs pb-3 border-b border-border last:border-0 last:pb-0">
                                  <div>
                                    <p className="font-medium uppercase tracking-wider">{item.name}</p>
                                    <p className="text-[10px] font-light text-foreground/60 uppercase">Size: {item.size} · Color: {item.color}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-light">₱{Number(item.price).toFixed(2)}</p>
                                    <p className="text-[10px] text-foreground/50">Qty: {itemQty(item)}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="px-6 py-4 border-t border-border space-y-2 text-xs">
                          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">Ship to</p>
                          <p className="text-foreground/70 font-light leading-relaxed">
                            {order.shipping_address?.address}
                            {order.shipping_address?.apartment ? `, ${order.shipping_address.apartment}` : ""}
                            {order.shipping_address?.city ? `, ${order.shipping_address.city}` : ""}
                            {order.shipping_address?.state ? `, ${order.shipping_address.state}` : ""}{" "}
                            {order.shipping_address?.zip} {order.shipping_address?.country}
                          </p>
                          {order.admin_notes && (
                            <p className="text-[10px] text-foreground/50 pt-1">Note: {order.admin_notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-8">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase">Saved Addresses</h2>
                  <p className="text-xs font-light text-foreground/60">
                    Shipping address from your most recent order.
                  </p>
                </div>

                {!latestAddress?.address ? (
                  <div className="border border-border p-12 text-center space-y-3">
                    <MapPin className="w-8 h-8 text-foreground/20 mx-auto" />
                    <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">No shipping address yet</p>
                    <p className="text-[10px] font-light text-foreground/50">Place an order to save your shipping details here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-foreground p-6 space-y-4 relative">
                      <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase bg-foreground text-background px-2 py-1">
                        Latest Order
                      </span>
                      <div className="space-y-1">
                        <p className="text-xs font-bold tracking-wider uppercase">{userDisplayName}</p>
                        <p className="text-xs font-light text-foreground/70 leading-relaxed">
                          {latestAddress.address}{latestAddress.apartment ? `, ${latestAddress.apartment}` : ""}<br />
                          {latestAddress.city}{latestAddress.state ? `, ${latestAddress.state}` : ""} {latestAddress.zip}<br />
                          {latestAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-12">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase">Account Settings</h2>
                  <p className="text-xs font-light text-foreground/60">
                    Update personal profile info and communication preferences.
                  </p>
                </div>

                <form onSubmit={handleUpdateProfile} className="border border-border p-8 space-y-8">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-border pb-4">
                    Personal Information
                  </h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors font-light"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full bg-muted border-b border-border py-3 text-sm text-foreground/60 cursor-not-allowed font-light"
                      />
                      <p className="text-[10px] text-foreground/40 font-light">Email cannot be changed directly.</p>
                    </div>
                  </div>

                  {profileError && (
                    <p className="text-xs font-medium tracking-widest uppercase text-red-500 border border-red-500/20 bg-red-500/5 px-4 py-3">
                      {profileError}
                    </p>
                  )}

                  {profileSuccess && (
                    <p className="text-xs font-medium tracking-widest uppercase text-emerald-600 border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 flex items-center gap-2">
                      <Check className="w-4 h-4" /> Profile updated successfully!
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-foreground text-background px-8 py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Profile"
                    )}
                  </button>
                </form>

                <div className="border border-border p-8 space-y-6">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-border pb-4">
                    Communication Preferences
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-xs font-bold tracking-wider uppercase">Exclusive Drop Alerts</p>
                        <p className="text-[10px] font-light text-foreground/60">Receive instant email notifications when limited collections drop.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={dropAlerts}
                        onChange={(e) => setDropAlerts(e.target.checked)}
                        className="w-4 h-4 accent-foreground"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer pt-4 border-t border-border">
                      <div>
                        <p className="text-xs font-bold tracking-wider uppercase">Marketing Newsletter</p>
                        <p className="text-[10px] font-light text-foreground/60">Weekly newsletter with brand stories and curated looks.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={marketingEmail}
                        onChange={(e) => setMarketingEmail(e.target.checked)}
                        className="w-4 h-4 accent-foreground"
                      />
                    </label>
                  </div>
                </div>

                <div className="border border-border p-8 space-y-6">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-border pb-4 flex items-center justify-between">
                    <span>Account Security</span>
                    <Shield className="w-4 h-4" />
                  </h3>
                  <p className="text-xs font-light text-foreground/70 leading-relaxed">
                    Need to change your password? Click below to send a secure password reset link to your email ({user.email}).
                  </p>

                  {resetMessage && (
                    <p className="text-xs font-medium tracking-widest uppercase text-foreground border border-border p-4 bg-muted">
                      {resetMessage}
                    </p>
                  )}

                  <button
                    onClick={handlePasswordReset}
                    disabled={resetSending}
                    className="border border-border px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase hover:border-foreground transition-colors disabled:opacity-60 flex items-center gap-2"
                  >
                    {resetSending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Password Reset"}
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
