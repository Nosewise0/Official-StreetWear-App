"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, ShoppingBag, ArrowRight, ArrowLeft, Truck, RotateCcw, ShieldCheck, LogIn, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const FREE_SHIPPING_THRESHOLD = 150;

const PATTERNS = [
  { img: "radial-gradient(circle, currentColor 1px, transparent 1px)", size: "16px 16px" },
  { img: "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)", size: "10px 10px" },
  { img: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)", size: "10px 10px" },
  { img: "repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)", size: "12px 12px" },
];

function ItemPlaceholder({ seed }: { seed: number }) {
  const p = PATTERNS[seed % PATTERNS.length];
  return (
    <div className="w-full h-full bg-muted relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: p.img, backgroundSize: p.size }}
      />
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [loginPrompt, setLoginPrompt] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      setLoginPrompt(true);
      setTimeout(() => {
        router.push("/login?redirect=/checkout");
      }, 1500);
      return;
    }
    router.push("/checkout");
  };


  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shippingProgress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : null;

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground flex flex-col">
        <div className="border-b border-border">
          <div className="container mx-auto px-6 max-w-7xl py-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/50">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Cart</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center space-y-8">
          <div className="relative">
            <ShoppingBag className="w-16 h-16 text-foreground/10" strokeWidth={0.8} />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground">
              Your Cart Is Empty
            </h1>
            <p className="text-sm font-light text-foreground/60 max-w-xs leading-relaxed">
              Looks like you haven&apos;t added anything yet. Explore our latest drops.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
          >
            <span>Shop the Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
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
          <span className="text-foreground">Cart</span>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-10 lg:py-16">
        {!authLoading && !user && (
          <div className="mb-8 p-4 border border-foreground/20 bg-muted/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-foreground shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  You are not logged in
                </p>
                <p className="text-xs text-foreground/70 font-light">
                  Please log in to save your cart and proceed to checkout.
                </p>
              </div>
            </div>
            <Link
              href="/login?redirect=/cart"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-foreground text-background text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login First</span>
            </Link>
          </div>
        )}

        <div className="flex items-baseline justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground">
            Shopping Cart
          </h1>
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-foreground/50">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

          <div className="space-y-0">
            <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto] gap-6 pb-4 border-b border-border text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
              <span className="w-24" />
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right min-w-[80px]">Total</span>
            </div>

            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_auto] gap-4 md:gap-6 py-8 border-b border-border group"
              >
                <Link href={`/products/${item.id}`} className="w-24 h-28 md:h-32 shrink-0 relative overflow-hidden block">
                  <ItemPlaceholder seed={item.id} />
                </Link>

                <div className="flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.id}`}
                        className="text-sm font-medium uppercase tracking-wider text-foreground hover:underline underline-offset-4 decoration-foreground/30 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="shrink-0 text-foreground/30 hover:text-foreground transition-colors md:hidden"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                      {item.category}
                    </p>
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[10px] font-medium tracking-[0.15em] uppercase border border-border px-2 py-1 text-foreground/60">
                        Size: {item.size}
                      </span>
                      <span className="text-[10px] font-medium tracking-[0.15em] uppercase border border-border px-2 py-1 text-foreground/60">
                        {item.color}
                      </span>
                    </div>
                    <p className="text-sm font-light text-foreground/70 md:hidden pt-1">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-4 md:hidden">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="px-2.5 py-2 hover:bg-muted transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                      <span className="w-8 text-center text-xs font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="px-2.5 py-2 hover:bg-muted transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                      className="px-3 py-3 hover:bg-muted transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                      className="px-3 py-3 hover:bg-muted transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-end gap-4 min-w-[80px]">
                  <span className="text-sm font-medium text-foreground tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="text-foreground/20 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-medium tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 space-y-0 border border-border">

            <div className="p-6 border-b border-border space-y-3">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">
                Free Shipping Progress
              </p>
              {toFreeShipping > 0 ? (
                <p className="text-xs font-light text-foreground/70 leading-relaxed">
                  Add{" "}
                  <span className="font-medium text-foreground">${toFreeShipping.toFixed(2)}</span>
                  {" "}more for free worldwide shipping
                </p>
              ) : (
                <p className="text-xs font-medium text-foreground tracking-[0.1em] uppercase">
                  ✓ You qualify for free shipping!
                </p>
              )}
              <div className="w-full h-[2px] bg-muted">
                <div
                  className="h-full bg-foreground transition-all duration-500 ease-out"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50 mb-2">
                Order Summary
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                  <span className="text-sm font-light text-foreground tabular-nums">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">
                    Shipping
                  </span>
                  <span className="text-sm font-light text-foreground">
                    {shipping === 0 ? (
                      <span className="font-medium">Free</span>
                    ) : (
                      <span className="text-foreground/50">Calculated at checkout</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">
                    Tax
                  </span>
                  <span className="text-xs text-foreground/50 italic">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-border">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">
                  Estimated Total
                </span>
                <span className="text-xl font-light text-foreground tabular-nums">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-3">
              {loginPrompt && !user && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium tracking-wide flex items-center justify-between animate-pulse">
                  <span>Please login first to proceed to checkout!</span>
                  <Link href="/login?redirect=/checkout" className="underline font-bold uppercase ml-2 text-[10px]">
                    Login Now
                  </Link>
                </div>
              )}

              <button
                id="proceed-to-checkout"
                onClick={handleCheckout}
                className={`group w-full inline-flex items-center justify-between px-6 py-5 text-xs font-medium tracking-[0.2em] uppercase transition-all ${loginPrompt && !user
                  ? "bg-red-600 text-white"
                  : "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.99]"
                  }`}
              >
                <span>
                  {loginPrompt && !user
                    ? "Please Login First"
                    : !user && !authLoading
                      ? "Proceed to Checkout"
                      : "Proceed to Checkout"}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </button>

              <div className="pt-4 border-t border-border grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, label: "Secure Checkout" },
                  { icon: RotateCcw, label: "Free Returns" },
                  { icon: Truck, label: "Fast Shipping" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 text-center">
                    <Icon className="w-4 h-4 text-foreground/40" strokeWidth={1.5} />
                    <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-foreground/50 leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted">
              <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-foreground/50 text-center">
                We accept Visa · Mastercard · Amex · PayPal · Apple Pay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
