"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProducts, getCategories, type Product } from "../lib/api";
import { ArrowRight, X } from "lucide-react";

export default function Products() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [loading, setLoading] = useState(true);

  // Sync search state when URL param changes (e.g. navigated from navbar)
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => { });
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ category: activeCategory, search: searchQuery || undefined })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    // Remove ?search= from the URL without a full navigation
    window.history.replaceState(null, "", "/products");
  };

  const isEmpty = !loading && products.length === 0;

  return (
    <section className="w-full bg-background py-16 min-h-[calc(100vh-5rem)]" id="products">
      <div className="container mx-auto px-6 max-w-7xl">

        <div className="flex flex-col space-y-8 mb-16">
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-foreground uppercase text-center">
            {searchQuery
              ? <>Results for <span className="font-medium italic">&ldquo;{searchQuery}&rdquo;</span></>
              : <>Shop The <span className="font-medium italic">Collection</span></>
            }
          </h2>

          {/* Active search pill */}
          {searchQuery && (
            <div className="flex justify-center">
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 px-4 py-1.5 border border-foreground/20 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground hover:border-foreground transition-colors"
              >
                <X className="w-3 h-3" strokeWidth={2} />
                Clear search: {searchQuery}
              </button>
            </div>
          )}

          <div className="flex justify-center space-x-2 md:space-x-8 overflow-x-auto no-scrollbar w-full pb-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase px-4 py-2 border transition-colors duration-300 whitespace-nowrap ${activeCategory === cat
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground/60 border-transparent hover:border-foreground/20 hover:text-foreground"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse flex flex-col">
                <div className="aspect-[3/4] bg-muted mb-4" />
                <div className="h-4 bg-muted w-2/3 mb-2" />
                <div className="h-4 bg-muted w-1/3" />
              </div>
            ))}
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-24 space-y-0">

            <div className="relative w-full max-w-2xl mb-16">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative text-center py-20 px-8 border border-border">
                <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/40 mb-6">
                  OSW — Official StreetWear
                </p>
                {searchQuery ? (
                  <>
                    <h3 className="text-5xl md:text-7xl font-light tracking-[0.15em] uppercase text-foreground mb-4">
                      No Results
                    </h3>
                    <h3 className="text-5xl md:text-7xl font-medium italic tracking-[0.1em] uppercase text-foreground">
                      Found.
                    </h3>
                    <div className="w-12 h-px bg-foreground/30 mx-auto my-8" />
                    <p className="text-sm font-light text-foreground/50 tracking-widest uppercase max-w-xs mx-auto leading-relaxed">
                      No products matched &ldquo;{searchQuery}&rdquo;. Try a different term or browse the full collection.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-5xl md:text-7xl font-light tracking-[0.15em] uppercase text-foreground mb-4">
                      Coming
                    </h3>
                    <h3 className="text-5xl md:text-7xl font-medium italic tracking-[0.1em] uppercase text-foreground">
                      Soon.
                    </h3>
                    <div className="w-12 h-px bg-foreground/30 mx-auto my-8" />
                    <p className="text-sm font-light text-foreground/50 tracking-widest uppercase max-w-xs mx-auto leading-relaxed">
                      The collection is being prepared. Something worth waiting for.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border w-full max-w-2xl">
              {["Drop 001", "Drop 002", "Drop 003"].map((drop, i) => (
                <div
                  key={i}
                  className="bg-background px-8 py-10 flex flex-col items-center space-y-3 opacity-40"
                >
                  <div className="aspect-[3/4] w-16 bg-muted" />
                  <div className="h-2 w-20 bg-muted rounded-sm" />
                  <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40">{drop}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
              {searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="group inline-flex items-center gap-3 bg-foreground text-background text-[10px] font-medium tracking-[0.25em] uppercase px-8 py-4 hover:bg-foreground/90 transition-colors"
                >
                  Browse All Products
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 bg-foreground text-background text-[10px] font-medium tracking-[0.25em] uppercase px-8 py-4 hover:bg-foreground/90 transition-colors"
                >
                  Get Notified
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
              <Link
                href="/"
                className="text-[10px] font-medium tracking-[0.25em] uppercase text-foreground/50 hover:text-foreground transition-colors underline underline-offset-4"
              >
                Back to Home
              </Link>
            </div>

          </div>
        )}

        {!loading && !isEmpty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product, idx) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group flex flex-col relative">
                <div className="aspect-[3/4] bg-muted relative overflow-hidden mb-4 cursor-pointer">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-foreground font-light text-xl uppercase tracking-widest relative transition-transform duration-700 group-hover:scale-105">
                      <span className="z-10 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm border border-foreground/10">
                        {product.name.split(" ")[0]}
                      </span>
                      <div
                        className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                      />
                    </div>
                  )}
                  {idx === 0 && (
                    <div className="absolute top-4 left-4 bg-foreground text-background text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                      New Arrival
                    </div>
                  )}
                  {idx === 1 && (
                    <div className="absolute top-4 left-4 bg-background text-foreground border border-border text-[10px] font-bold tracking-widest uppercase px-3 py-1">
                      Best Seller
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-1 px-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-foreground leading-snug cursor-pointer group-hover:underline underline-offset-4 decoration-foreground/30">
                      {product.name}
                    </h3>
                    <span className="text-sm font-light text-foreground whitespace-nowrap">
                      ${product.price}
                    </span>
                  </div>
                  <p className="text-foreground/50 text-[10px] font-medium uppercase tracking-[0.2em]">
                    {product.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}