"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Heart, ArrowRight, ArrowLeft, ShoppingBag, Sparkles, AlertCircle, LogIn } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

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

export default function WishlistPage() {
  const router = useRouter();
  const { items, removeItem, clearWishlist, totalItems } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [loginPrompt, setLoginPrompt] = useState(false);

  function moveToCart(item: typeof items[0]) {
    if (!user) {
      setLoginPrompt(true);
      setTimeout(() => setLoginPrompt(false), 3000);
      return;
    }
    addItem(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image,
        size: "M",
        color: "Default",
      },
      1
    );
    removeItem(item.id);
  }

  function moveAllToCart() {
    if (!user) {
      setLoginPrompt(true);
      setTimeout(() => setLoginPrompt(false), 3000);
      return;
    }
    items.forEach((item) => moveToCart(item));
  }

  const totalValue = items.reduce((sum, i) => sum + i.price, 0);

  /* ── Empty state ─────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground flex flex-col">
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="container mx-auto px-6 max-w-7xl py-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/50">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Wishlist</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center space-y-8">
          <div className="relative">
            <Heart className="w-16 h-16 text-foreground/10" strokeWidth={0.8} />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground">
              Your Wishlist Is Empty
            </h1>
            <p className="text-sm font-light text-foreground/60 max-w-xs leading-relaxed">
              Save pieces you love and come back to them anytime.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
          >
            <span>Explore the Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Populated wishlist ───────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-6 max-w-7xl py-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/50">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Wishlist</span>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-10 lg:py-16">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground">
            Wishlist
          </h1>
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-foreground/50">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

          {/* ── Item list ── */}
          <div className="space-y-0">
            {/* Column headers (desktop) */}
            <div className="hidden md:grid grid-cols-[auto_1fr_auto] gap-6 pb-4 border-b border-border text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
              <span className="w-24" />
              <span>Product</span>
              <span className="text-right min-w-[120px]">Actions</span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 py-8 border-b border-border group"
              >
                {/* Thumbnail */}
                <Link href={`/products/${item.id}`} className="w-24 h-28 md:h-32 shrink-0 relative overflow-hidden block">
                  <ItemPlaceholder seed={item.id} />
                </Link>

                {/* Info */}
                <div className="flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.id}`}
                        className="text-sm font-medium uppercase tracking-wider text-foreground hover:underline underline-offset-4 decoration-foreground/30 leading-snug"
                      >
                        {item.name}
                      </Link>
                      {/* Mobile remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-foreground/30 hover:text-foreground transition-colors md:hidden"
                        aria-label="Remove from wishlist"
                      >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                      {item.category}
                    </p>
                    <p className="text-sm font-light text-foreground pt-1">
                      ₱{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Mobile CTA */}
                  <div className="flex items-center gap-3 mt-4 md:hidden">
                    <button
                      onClick={() => moveToCart(item)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background text-[10px] font-medium tracking-[0.2em] uppercase px-4 py-3 hover:bg-foreground/90 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Move to Cart
                    </button>
                  </div>
                </div>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center justify-end gap-3 min-w-[120px]">
                  <button
                    onClick={() => moveToCart(item)}
                    className="inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-medium tracking-[0.2em] uppercase px-4 py-2.5 hover:bg-foreground/90 transition-colors"
                    aria-label="Move to cart"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-foreground/20 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove from wishlist"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}

            {/* Footer row */}
            <div className="flex items-center justify-between pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Continue Shopping
              </Link>
              <button
                onClick={clearWishlist}
                className="text-xs font-medium tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors"
              >
                Clear Wishlist
              </button>
            </div>
          </div>

          {/* ── Summary sidebar ── */}
          <div className="lg:sticky lg:top-24 space-y-0 border border-border">

            {/* Wishlist summary header */}
            <div className="p-6 border-b border-border space-y-2">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">
                Saved Items
              </p>
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/70">
                  {totalItems} {totalItems === 1 ? "piece" : "pieces"}
                </span>
                <span className="text-xl font-light text-foreground tabular-nums">
                  ₱{totalValue.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] font-light text-foreground/50 leading-relaxed">
                Total estimated value of your wishlist. Prices may change.
              </p>
            </div>

            {/* Item list preview */}
            <div className="p-6 space-y-4 border-b border-border">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50 mb-2">
                Summary
              </p>
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-foreground/80 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs font-light text-foreground tabular-nums shrink-0">
                    ₱{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-baseline pt-3 border-t border-border">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">
                  Total Value
                </span>
                <span className="text-xl font-light text-foreground tabular-nums">
                  ₱{totalValue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="px-6 pb-6 pt-6 space-y-3">
              <button
                id="move-all-to-cart"
                onClick={moveAllToCart}
                className="group w-full inline-flex items-center justify-between px-6 py-5 bg-foreground text-background text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 active:scale-[0.99] transition-all"
              >
                <span>Move All to Cart</span>
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              </button>

              <Link
                href="/products"
                id="keep-shopping"
                className="group w-full inline-flex items-center justify-between px-6 py-4 border border-border text-background bg-foreground/0 text-foreground text-xs font-medium tracking-[0.2em] uppercase hover:bg-muted transition-colors"
              >
                <span>Keep Shopping</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Hint */}
            <div className="px-6 py-4 border-t border-border bg-muted">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 text-foreground/40 mt-0.5 shrink-0" />
                <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-foreground/50 leading-relaxed">
                  Items in your wishlist are not reserved. Add to cart to secure yours.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
