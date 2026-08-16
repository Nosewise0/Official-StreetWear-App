"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  ChevronDown,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  AlertCircle,
  LogIn,
  Lock,
} from "lucide-react";
import { getProductById, getProducts, type Product } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const COLOR_CSS: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f0f0f0",
  navy: "#1e2d5a",
  grey: "#9ca3af",
  gray: "#9ca3af",
  red: "#dc2626",
  blue: "#3b82f6",
  green: "#16a34a",
  cream: "#f5f0e1",
  beige: "#e8dcc8",
  brown: "#92400e",
  orange: "#f97316",
  yellow: "#eab308",
  pink: "#ec4899",
  purple: "#8b5cf6",
  olive: "#6b7048",
  tan: "#c4a882",
  charcoal: "#374151",
  khaki: "#b5a17a",
  sand: "#d4b483",
  rust: "#b45309",
  teal: "#0d9488",
};

function getColorCss(name: string): string {
  return COLOR_CSS[name.toLowerCase().trim()] ?? "#888888";
}

const PATTERNS = [
  { img: "radial-gradient(circle, currentColor 1px, transparent 1px)", size: "20px 20px" },
  { img: "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 12px)", size: "12px 12px" },
  { img: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 12px)", size: "12px 12px" },
  { img: "repeating-linear-gradient(0deg, currentColor 0, currentColor 1px, transparent 1px, transparent 16px)", size: "16px 16px" },
];

function Placeholder({ seed, large, label }: { seed: number; large?: boolean; label?: string }) {
  const p = PATTERNS[seed % PATTERNS.length];
  return (
    <div className="w-full h-full bg-muted relative overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: p.img, backgroundSize: p.size }}
      />
      {large && label && (
        <div className="z-10 flex flex-col items-center gap-4 select-none">
          <span className="text-[8rem] font-light text-foreground/5 leading-none">
            {label.charAt(0).toUpperCase()}
          </span>
          <span className="bg-background/60 backdrop-blur-sm px-4 py-2 text-xs font-medium tracking-[0.3em] uppercase text-foreground/50 border border-foreground/10">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

function DetailAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-foreground group-hover:text-foreground/60 transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-foreground/40 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${open ? "max-h-72 opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
      >
        <div className="text-sm font-light text-foreground/70 leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedState, setAddedState] = useState<"idle" | "needsSize" | "added" | "needsLogin">("idle");
  const [activeThumb, setActiveThumb] = useState(0);
  const [wishlistState, setWishlistState] = useState<"idle" | "added" | "needsLogin">("idle");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSelectedSize("");
    setQuantity(1);
    setActiveThumb(0);
    setAddedState("idle");

    getProductById(id)
      .then((p) => {
        setProduct(p);
        setSelectedColor(p.colors[0] ?? "");
        return getProducts({ category: p.category });
      })
      .then((all) => setRelated(all.filter((p) => p.id !== id).slice(0, 4)))
      .catch(() => setError("Failed to load product. Is the server running?"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToWishlist = () => {
    if (!product) return;
    if (!user) {
      if (wishlistState === "needsLogin") {
        router.push(`/login?redirect=/products/${product.id}`);
        return;
      }
      setWishlistState("needsLogin");
      setTimeout(() => setWishlistState("idle"), 3500);
      return;
    }
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    });
  }

  const handleAddToCart = () => {
    if (!product) return;
    if (!user) {
      if (addedState === "needsLogin") {
        router.push(`/login?redirect=/products/${product.id}`);
        return;
      }
      setAddedState("needsLogin");
      setTimeout(() => setAddedState("idle"), 3500);
      return;
    }
    if (!selectedSize) {
      setAddedState("needsSize");
      setTimeout(() => setAddedState("idle"), 2500);
      return;
    }
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
      },
      quantity
    );
    setAddedState("added");
    setTimeout(() => setAddedState("idle"), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background">
        <div className="border-b border-border">
          <div className="container mx-auto px-6 max-w-7xl py-4">
            <div className="h-3 bg-muted w-56 animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-6 max-w-7xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12">
            <div className="flex flex-col gap-3">
              <div className="aspect-[3/4] bg-muted animate-pulse" />
              <div className="grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => <div key={i} className="aspect-square bg-muted animate-pulse" />)}
              </div>
            </div>
            <div className="space-y-6 pt-4">
              <div className="h-3 bg-muted w-24 animate-pulse" />
              <div className="h-8 bg-muted w-3/4 animate-pulse" />
              <div className="h-6 bg-muted w-20 animate-pulse" />
              <div className="h-20 bg-muted animate-pulse" />
              <div className="h-10 bg-muted animate-pulse" />
              <div className="h-10 bg-muted animate-pulse" />
              <div className="h-14 bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
        <div className="text-center space-y-6 p-12 border border-border max-w-sm">
          <span className="text-4xl block">⚠️</span>
          <p className="text-sm text-foreground/80 tracking-widest uppercase font-medium">
            {error ?? "Product not found"}
          </p>
          <button
            onClick={() => router.push("/products")}
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase hover:text-foreground/60 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-[calc(100vh-5rem)]">

      <div className="border-b border-border">
        <div className="container mx-auto px-6 max-w-7xl py-4 flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/50">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground/40">{product.category}</span>
          <span>/</span>
          <span className="text-foreground truncate max-w-[180px]">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-20">

          <div className="flex flex-col gap-3">
            <div className="aspect-[3/4] w-full relative overflow-hidden bg-muted">
              {product.image && activeThumb === 0 ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Placeholder seed={id + activeThumb} large label={product.category} />
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`aspect-square relative overflow-hidden border-2 transition-colors ${activeThumb === i ? "border-foreground" : "border-transparent hover:border-border"
                    }`}
                >
                  {product.image && i === 0 ? (
                    <img
                      src={product.image}
                      alt={`${product.name} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Placeholder seed={id + i} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start space-y-8">

            <div className="space-y-3">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/50">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight uppercase text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-light text-foreground">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-sm font-light text-foreground/70 leading-relaxed border-t border-border pt-6">
              {product.description || "A premium streetwear essential crafted for those who define the culture, not follow it."}
            </p>

            {product.colors.length > 0 && (
              <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">
                    Color
                  </p>
                  <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-foreground/50">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{ backgroundColor: getColorCss(color) }}
                      className={`w-8 h-8 border-2 transition-all duration-150 ${selectedColor === color
                        ? "border-foreground ring-2 ring-offset-2 ring-foreground/30"
                        : "border-transparent hover:border-border"
                        }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">
                    Size
                  </p>
                  {addedState === "needsSize" && (
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-red-500 animate-pulse">
                      Please select a size
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 text-xs font-medium tracking-[0.15em] uppercase border transition-all duration-150 ${selectedSize === size
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground/70 border-border hover:border-foreground hover:text-foreground"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-3 hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-3 hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-foreground/50">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>
              </div>

              {addedState === "needsLogin" && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium tracking-wide flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please login first to add to cart</span>
                  </div>
                  <Link
                    href={`/login?redirect=/products/${product.id}`}
                    className="underline font-bold uppercase ml-2 text-[10px]"
                  >
                    Login Now
                  </Link>
                </div>
              )}
              {wishlistState === "needsLogin" && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium tracking-wide flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please login first to add to wishlist</span>
                  </div>
                  <Link
                    href={`/login?redirect=/products/${product.id}`}
                    className="underline font-bold uppercase ml-2 text-[10px]"
                  >
                    Login Now
                  </Link>
                </div>
              )}

              <button
                id={`add-to-cart-${product.id}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`group w-full inline-flex items-center justify-between px-6 py-5 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-200 ${addedState === "added"
                  ? "bg-foreground text-background"
                  : addedState === "needsSize"
                    ? "bg-foreground/80 text-background"
                    : addedState === "needsLogin"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : product.stock === 0
                        ? "bg-muted text-foreground/30 cursor-not-allowed"
                        : "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.99]"
                  }`}
              >
                <span>
                  {addedState === "added"
                    ? "Added to Cart!"
                    : addedState === "needsSize"
                      ? "Select a Size First"
                      : addedState === "needsLogin"
                        ? "Please Login First"
                        : product.stock === 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                </span>
                {addedState === "added" ? (
                  <Check className="w-4 h-4" strokeWidth={2} />
                ) : addedState === "needsLogin" ? (
                  <LogIn className="w-4 h-4" strokeWidth={2} />
                ) : (
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1} />
                )}
              </button>

              <button
                id={`add-to-wishlist-${product.id}`}
                onClick={handleAddToWishlist}
                className={`group w-full inline-flex items-center justify-between px-6 py-4 text-xs font-medium tracking-[0.2em] uppercase border transition-colors ${isWishlisted(product.id)
                  ? "border-foreground bg-muted"
                  : "border-border hover:border-foreground"
                  }`}
              >
                <span>{isWishlisted(product.id) ? "Wishlisted" : "Add to Wishlist"}</span>
                <Heart
                  className={`w-4 h-4 transition-all duration-200 ${isWishlisted(product.id) ? "fill-foreground" : "group-hover:fill-foreground"
                    }`}
                  strokeWidth={1}
                />
              </button>
            </div>

            <div className="border-t border-border pt-2">
              <DetailAccordion title="Product Details">
                <p>{product.description || "Premium quality streetwear essential."}</p>
                <ul className="mt-2 space-y-1">
                  <li>• Category: {product.category}</li>
                  <li>• Available Sizes: {product.sizes.join(", ") || "One Size"}</li>
                  <li>• Available Colors: {product.colors.join(", ") || "As Shown"}</li>
                </ul>
              </DetailAccordion>

              <DetailAccordion title="Size & Fit">
                <p>
                  This piece runs true to size. For an oversized fit, we recommend sizing up one.
                  Model is 6&apos;1&quot; and wears a size M. Refer to our full size chart for exact measurements.
                </p>
              </DetailAccordion>

              <DetailAccordion title="Shipping & Returns">
                <p>
                  Free standard shipping on all orders over $150. Express available at checkout.
                  Domestic orders arrive in 2–5 business days. International in 5–14 business days.
                </p>
                <p>
                  Free returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging.{" "}
                  <Link href="/help" className="underline underline-offset-2 hover:text-foreground transition-colors">
                    Full return policy →
                  </Link>
                </p>
              </DetailAccordion>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase text-foreground">
                You May Also Like
              </h2>
              <Link
                href="/products"
                className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {related.map((rel) => (
                <Link key={rel.id} href={`/products/${rel.id}`} className="group flex flex-col">
                  <div className="aspect-[3/4] bg-muted relative overflow-hidden mb-4">
                    <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                      {rel.image ? (
                        <img
                          src={rel.image}
                          alt={rel.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Placeholder seed={rel.id} />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-medium uppercase tracking-wider text-foreground leading-snug group-hover:underline underline-offset-4 decoration-foreground/30">
                        {rel.name}
                      </h3>
                      <span className="text-sm font-light text-foreground whitespace-nowrap">
                        ${rel.price}
                      </span>
                    </div>
                    <p className="text-foreground/50 text-[10px] font-medium uppercase tracking-[0.2em]">
                      {rel.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
