"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProducts, getCategories, type Product } from "../lib/api";
import { ShoppingBag } from "lucide-react";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => { });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts({ category: activeCategory })
      .then(setProducts)
      .catch(() => setError("Products are currently out of stock. Please check back later."))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section className="w-full bg-background py-16" id="products">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col space-y-8 mb-16">
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-foreground uppercase text-center">
            Shop The <span className="font-medium italic">Collection</span>
          </h2>
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

        {error && (
          <div className="p-12 border border-border bg-muted flex flex-col items-center justify-center space-y-4">
            <span className="text-3xl">⚠️</span>
            <p className="text-sm text-foreground/80 tracking-widest uppercase font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs underline underline-offset-4 cursor-pointer">Comeback Soon</button>
          </div>
        )}

        {loading && !error && (
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

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product, idx) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group flex flex-col relative">

                <div className="aspect-[3/4] bg-muted relative overflow-hidden mb-4 cursor-pointer">

                  <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-foreground font-light text-xl uppercase tracking-widest relative transition-transform duration-700 group-hover:scale-105">
                    <span className="z-10 bg-background/50 backdrop-blur-sm px-3 py-1 text-sm border border-foreground/10">{product.name.split(' ')[0]}</span>
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                  </div>


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


                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex gap-2">
                    <button
                      onClick={(e) => { e.preventDefault(); router.push(`/products/${product.id}`); }}
                      className="flex-1 bg-background text-foreground font-medium text-xs tracking-widest uppercase py-3 border border-border hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Quick Add
                    </button>
                  </div>
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