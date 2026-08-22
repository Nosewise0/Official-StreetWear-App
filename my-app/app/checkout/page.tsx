"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  RotateCcw,
  Truck,
  Upload,
  X,
  Smartphone,
  Loader2,
  Copy,
  CheckCheck,
  ClipboardList,
} from "lucide-react";
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
const STORE_GCASH_NUMBER = "0917-123-4567"; // ← Change to your actual GCash number

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [step, setStep] = useState<Step>("shipping");

  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", apartment: "", city: "", state: "", zip: "", country: "Philippines",
  });

  const [gcashNumber, setGcashNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 12;
  const tax = totalPrice * 0.12; // 12% VAT (Philippines)
  const orderTotal = totalPrice + shippingCost + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setReceiptError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setReceiptError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setReceiptError("File size must be under 5MB.");
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyGcashNumber = () => {
    navigator.clipboard.writeText(STORE_GCASH_NUMBER.replace(/-/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      setReceiptError("Please upload your payment receipt.");
      return;
    }
    if (!gcashNumber.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. Upload receipt
      const formData = new FormData();
      formData.append("receipt", receiptFile);
      const uploadRes = await fetch("/api/orders/upload-receipt", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      // 2. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${shipping.firstName} ${shipping.lastName}`.trim(),
          customerEmail: shipping.email,
          customerPhone: shipping.phone || undefined,
          shippingAddress: {
            address: shipping.address,
            apartment: shipping.apartment || undefined,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
            country: shipping.country,
          },
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
          subtotal: totalPrice,
          shippingCost,
          tax,
          total: orderTotal,
          gcashNumber: gcashNumber.trim(),
          receiptPath: uploadData.path,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error ?? "Order creation failed");

      setOrderId(orderData.orderId);
      clearCart();
      setStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Empty cart ──────────────────────────────────────────────────────────────
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

  // ── Order Confirmed ─────────────────────────────────────────────────────────
  if (step === "confirmed") {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground flex flex-col items-center justify-center px-6 py-24 text-center space-y-10">
        <div className="w-16 h-16 bg-foreground flex items-center justify-center">
          <Check className="w-8 h-8 text-background" strokeWidth={1.5} />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Order Submitted</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground">Thank You, {shipping.firstName || "Friend"}!</h1>
          <p className="text-sm font-light text-foreground/60 max-w-sm leading-relaxed">
            Your order has been received and is <span className="text-foreground font-medium">pending payment verification</span>. We&apos;ll confirm once the admin reviews your GCash receipt.
          </p>
        </div>

        {orderId && (
          <div className="border border-border p-6 max-w-sm w-full space-y-2 text-left bg-muted/30">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Order Reference</p>
            <p className="text-xs font-mono text-foreground/70 break-all">{orderId}</p>
          </div>
        )}

        <div className="border border-border p-8 max-w-sm w-full space-y-4 text-left">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Shipping To</p>
          <p className="text-sm font-light text-foreground/80 leading-relaxed">
            {shipping.firstName} {shipping.lastName}<br />
            {shipping.address}{shipping.apartment ? `, ${shipping.apartment}` : ""}<br />
            {shipping.city}, {shipping.state} {shipping.zip}<br />
            {shipping.country}
          </p>
        </div>

        <div className="border border-border p-6 max-w-sm w-full text-left space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">
            <ClipboardList className="w-3 h-3" /> What&apos;s Next
          </div>
          <ul className="text-xs font-light text-foreground/70 leading-loose space-y-1">
            <li>✓ Your receipt has been uploaded</li>
            <li>○ Admin will verify your GCash payment</li>
            <li>○ You&apos;ll be notified once verified</li>
            <li>○ Order will be prepared for shipping</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="group inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
          <Link href="/help" className="inline-flex items-center justify-center px-8 py-5 border border-border text-xs font-medium tracking-[0.2em] uppercase hover:border-foreground transition-colors">
            Help &amp; FAQs
          </Link>
        </div>
      </div>
    );
  }

  // ── Main Checkout Layout ────────────────────────────────────────────────────
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

            {/* SHIPPING FORM */}
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-10">
                <div className="space-y-6">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Contact Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">First Name</label>
                      <input required value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="Juan" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Last Name</label>
                      <input required value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="dela Cruz" />
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
                        placeholder="+63 917 123 4567" />
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
                        placeholder="123 Rizal Street" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Apartment, unit, etc. (optional)</label>
                      <input value={shipping.apartment} onChange={e => setShipping({ ...shipping, apartment: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="Unit 4B" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">City</label>
                      <input required value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="Manila" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Province</label>
                      <input required value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="Metro Manila" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">ZIP Code</label>
                      <input required value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="1000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Country</label>
                      <input required value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}
                        className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                        placeholder="Philippines" />
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

            {/* GCASH PAYMENT FORM */}
            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-10">

                {/* Shipping summary */}
                <div className="p-4 border border-border bg-muted flex items-start gap-3">
                  <Check className="w-4 h-4 text-foreground/50 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div className="text-xs font-light text-foreground/70 leading-relaxed">
                    <span className="font-medium text-foreground uppercase tracking-wider">{shipping.firstName} {shipping.lastName}</span>
                    <span className="mx-2 text-foreground/30">·</span>
                    {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}
                    <button type="button" onClick={() => setStep("shipping")} className="ml-3 underline underline-offset-4 hover:text-foreground transition-colors">Edit</button>
                  </div>
                </div>

                {/* GCash instructions card */}
                <div className="space-y-6">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">GCash Payment</p>

                  <div className="border border-border overflow-hidden">
                    {/* Header banner */}
                    <div className="bg-foreground text-background px-6 py-4 flex items-center gap-3">
                      <Smartphone className="w-5 h-5" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs font-bold tracking-[0.2em] uppercase">Pay via GCash</p>
                        <p className="text-[10px] text-background/60 font-light mt-0.5">Send payment then upload your receipt</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Step-by-step instructions */}
                      <div className="space-y-3">
                        {[
                          { n: "1", text: "Open your GCash app" },
                          { n: "2", text: `Send ₱${orderTotal.toFixed(2)} to the number below` },
                          { n: "3", text: "Screenshot your receipt" },
                          { n: "4", text: "Upload the screenshot below" },
                        ].map(({ n, text }) => (
                          <div key={n} className="flex items-center gap-4">
                            <span className="w-6 h-6 shrink-0 bg-foreground text-background text-[10px] font-bold flex items-center justify-center">{n}</span>
                            <span className="text-xs font-light text-foreground/80">{text}</span>
                          </div>
                        ))}
                      </div>

                      {/* GCash number display */}
                      <div className="border border-border p-4 flex items-center justify-between gap-4 bg-muted/40">
                        <div>
                          <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 mb-1">GCash Number</p>
                          <p className="text-2xl font-light tracking-[0.15em] text-foreground">{STORE_GCASH_NUMBER}</p>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-foreground/40 mt-1">Official StreetWear</p>
                        </div>
                        <button
                          type="button"
                          onClick={copyGcashNumber}
                          className="flex items-center gap-2 text-[10px] font-medium tracking-[0.15em] uppercase border border-border px-4 py-2.5 hover:bg-foreground hover:text-background hover:border-foreground transition-all shrink-0"
                        >
                          {copied ? <><CheckCheck className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                        </button>
                      </div>

                      {/* Amount to send */}
                      <div className="border border-dashed border-border p-4 text-center space-y-1">
                        <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40">Amount to Send</p>
                        <p className="text-3xl font-light tracking-tight text-foreground">₱{orderTotal.toFixed(2)}</p>
                        <p className="text-[9px] text-foreground/40 font-light">Including shipping &amp; VAT</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer GCash number input */}
                <div className="space-y-6 border-t border-border pt-8">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Your GCash Details</p>
                  <div className="space-y-2">
                    <label htmlFor="gcash-number" className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">
                      Your GCash Number
                    </label>
                    <input
                      id="gcash-number"
                      required
                      type="tel"
                      value={gcashNumber}
                      onChange={e => setGcashNumber(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light tracking-widest"
                      placeholder="09XX-XXX-XXXX"
                      pattern="[0-9\-\+\s]{10,13}"
                      title="Enter a valid Philippine mobile number"
                    />
                    <p className="text-[10px] text-foreground/40 font-light">The GCash number you sent the payment from</p>
                  </div>
                </div>

                {/* Receipt upload */}
                <div className="space-y-4 border-t border-border pt-8">
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">Upload Payment Receipt</p>
                  <p className="text-xs font-light text-foreground/60">
                    Upload a screenshot of your GCash payment confirmation. JPG, PNG, or WEBP — max 5MB.
                  </p>

                  {/* Drop zone / preview */}
                  {receiptPreview ? (
                    <div className="relative border border-border overflow-hidden">
                      <Image
                        src={receiptPreview}
                        alt="Receipt preview"
                        width={600}
                        height={400}
                        className="w-full max-h-72 object-contain bg-muted/30"
                      />
                      <button
                        type="button"
                        onClick={removeReceipt}
                        className="absolute top-3 right-3 w-8 h-8 bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="px-4 py-2 bg-muted/50 border-t border-border">
                        <p className="text-[10px] text-foreground/50 font-light truncate">{receiptFile?.name}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-border hover:border-foreground/50 transition-colors p-10 flex flex-col items-center gap-4 group"
                    >
                      <div className="w-12 h-12 border border-border group-hover:border-foreground/50 flex items-center justify-center transition-colors">
                        <Upload className="w-5 h-5 text-foreground/30 group-hover:text-foreground/60 transition-colors" strokeWidth={1.5} />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/60 group-hover:text-foreground transition-colors">
                          Click to Upload Receipt
                        </p>
                        <p className="text-[10px] text-foreground/30 font-light">JPG, PNG, WEBP up to 5MB</p>
                      </div>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {receiptError && (
                    <p className="text-xs text-red-500 font-light">{receiptError}</p>
                  )}
                </div>

                {submitError && (
                  <div className="border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4">
                    <p className="text-xs text-red-600 dark:text-red-400 font-light">{submitError}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <button type="button" onClick={() => setStep("shipping")}
                    className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors"
                    disabled={isSubmitting}>
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                  <button
                    type="submit"
                    id="place-order"
                    disabled={isSubmitting || !receiptFile}
                    className="group inline-flex items-center justify-between gap-6 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Order · ₱{orderTotal.toFixed(2)}</span>
                        <Check className="w-4 h-4" strokeWidth={1.5} />
                      </>
                    )}
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
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">Subtotal</span>
                <span className="text-sm font-light text-foreground tabular-nums">₱{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">Shipping</span>
                <span className="text-sm font-light text-foreground">
                  {shippingCost === 0 ? <span className="font-medium">Free</span> : `₱${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">VAT (12%)</span>
                <span className="text-sm font-light text-foreground tabular-nums">₱{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-border">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">Total</span>
                <span className="text-xl font-light text-foreground tabular-nums">₱{orderTotal.toFixed(2)}</span>
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
