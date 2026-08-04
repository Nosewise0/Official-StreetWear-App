"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, ShieldCheck, RotateCcw, Truck, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";

const PATTERNS = [
  { img: "radial-gradient(circle, currentColor 1px, transparent 1px)", size: "16px 16px" },
  { img: "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)", size: "10px 10px" },
  { img: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)", size: "10px 10px" },
  { img: "repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)", size: "12px 12px" },
];

function ItemPlaceholder({ seed }: { seed: number }) {
  const p = PATTERNS[seed % PATTERNS.length];
  return (
    <div className="w-full h-full bg-muted relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: p.img, backgroundSize: p.size }} />
    </div>
  );
}

type Step = "shipping" | "payment" | "confirmed";

const FREE_SHIPPING_THRESHOLD = 150;

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [step, setStep] = useState<Step>("shipping");

  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", apartment: "", city: "", state: "", zip: "", country: "United States",
  });

  const [payment, setPayment] = useState({
    cardNumber: "", expiry: "", cvv: "", nameOnCard: "",
  });

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 12;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmed");
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground flex flex-col">
        <div className="border-b border-border">
          <div className="container mx-auto px-6 max-w-7xl py-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/50">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center space-y-8">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground">Your Cart Is Empty</h1>
          <p className="text-sm font-light text-foreground/60 max-w-xs leading-relaxed">Add items to your cart before checking out.</p>
          <Link href="/products" className="group inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors">
            <span>Shop the Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground flex flex-col items-center justify-center px-6 py-24 text-center space-y-10">
        <div className="w-16 h-16 bg-foreground flex items-center justify-center">
          <Check className="w-8 h-8 text-background" strokeWidth={1.5} />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Order Confirmed</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground">Thank You, {shipping.firstName || "Friend"}!</h1>
          <p className="text-sm font-light text-foreground/60 max-w-sm leading-relaxed">
            Your order has been placed. A confirmation email will be sent to <span className="text-foreground font-medium">{shipping.email || "your inbox"}</span>.
          </p>
        </div>
        <div className="border border-border p-8 max-w-sm w-full space-y-4 text-left">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Shipping To</p>
          <p className="text-sm font-light text-foreground/80 leading-relaxed">
            {shipping.firstName} {shipping.lastName}<br />
            {shipping.address}{shipping.apartment ? `, ${shipping.apartment}` : ""}<br />
            {shipping.city}, {shipping.state} {shipping.zip}<br />
            {shipping.country}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="group inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
          <Link href="/help" className="inline-flex items-center justify-center px-8 py-5 border border-border text-xs font-medium tracking-[0.2em] uppercase hover:border-foreground transition-colors">
            Help & FAQs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground">
      <div className="border-b border-border">
        <div className="container mx-auto px-6 max-w-7xl py-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/50">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
          <span>/</span>
          <span className="text-foreground">Checkout</span>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-10 lg:py-16">
        <div className="flex items-baseline justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground">Checkout</h1>
          <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span className={step === "shipping" ? "text-foreground" : "text-foreground/40"}>Shipping</span>
            <span className="text-foreground/20">—</span>
            <span className={step === "payment" ? "text-foreground" : "text-foreground/40"}>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-start">

          {/* ── Left: Forms ── */}
          <div>
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-10">
                <div className="space-y-6">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Contact Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">First Name</label>
                      <input required value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Last Name</label>
                      <input required value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="Doe" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Email</label>
                      <input required type="email" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Phone (optional)</label>
                      <input type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t border-border pt-8">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Shipping Address</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Address</label>
                      <input required value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="123 Street Ave" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Apartment, suite, etc. (optional)</label>
                      <input value={shipping.apartment} onChange={e => setShipping({ ...shipping, apartment: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="Apt 4B" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">City</label>
                      <input required value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="Los Angeles" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">State / Province</label>
                      <input required value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="CA" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">ZIP / Postal Code</label>
                      <input required value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="90015" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Country</label>
                      <input required value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="United States" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Back to Cart
                  </Link>
                  <button type="submit" id="continue-to-payment"
                    className="group inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 active:scale-[0.99] transition-all">
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            )}

            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-10">
                <div className="p-4 border border-border bg-muted flex items-start gap-3">
                  <Check className="w-4 h-4 text-foreground/50 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div className="text-xs font-light text-foreground/70 leading-relaxed">
                    <span className="font-medium text-foreground uppercase tracking-wider">{shipping.firstName} {shipping.lastName}</span>
                    <span className="mx-2 text-foreground/30">·</span>
                    {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}
                    <button type="button" onClick={() => setStep("shipping")} className="ml-3 underline underline-offset-4 hover:text-foreground transition-colors">Edit</button>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Payment Details</p>
                  <div className="flex items-center gap-2 text-[10px] font-medium tracking-[0.15em] uppercase text-foreground/40">
                    <Lock className="w-3 h-3" /> Secured with 256-bit encryption
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Name on Card</label>
                      <input required value={payment.nameOnCard} onChange={e => setPayment({ ...payment, nameOnCard: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Card Number</label>
                      <input required value={payment.cardNumber}
                        onChange={e => setPayment({ ...payment, cardNumber: formatCard(e.target.value) })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light tracking-widest"
                        placeholder="0000 0000 0000 0000" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Expiry</label>
                        <input required value={payment.expiry}
                          onChange={e => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                          className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                          placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">CVV</label>
                        <input required value={payment.cvv}
                          onChange={e => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                          placeholder="•••" maxLength={4} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button type="button" onClick={() => setStep("shipping")}
                    className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                  <button type="submit" id="place-order"
                    className="group inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 active:scale-[0.99] transition-all">
                    <span>Place Order · ${orderTotal.toFixed(2)}</span>
                    <Lock className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:sticky lg:top-24 border border-border space-y-0">
            <div className="p-6 border-b border-border">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50 mb-4">
                Order Summary · {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                    <div className="w-14 h-16 shrink-0 relative overflow-hidden">
                      <ItemPlaceholder seed={item.id} />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-[9px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/50 mt-0.5">
                        {item.size} · {item.color}
                      </p>
                    </div>
                    <span className="text-sm font-light text-foreground tabular-nums shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">Subtotal</span>
                <span className="text-sm font-light text-foreground tabular-nums">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">Shipping</span>
                <span className="text-sm font-light text-foreground">
                  {shippingCost === 0 ? <span className="font-medium">Free</span> : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">Tax (est. 8%)</span>
                <span className="text-sm font-light text-foreground tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-border">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">Total</span>
                <span className="text-xl font-light text-foreground tabular-nums">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted grid grid-cols-3 gap-2">
              {[
                { icon: ShieldCheck, label: "Secure" },
                { icon: RotateCcw, label: "Free Returns" },
                { icon: Truck, label: "Fast Ship" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-4 h-4 text-foreground/40" strokeWidth={1.5} />
                  <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-foreground/50">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
