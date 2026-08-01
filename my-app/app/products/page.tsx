"use client";

import { useEffect, useState } from "react";
import { getProducts, getCategories, type Product } from "../lib/api";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts({ category: activeCategory })
      .then(setProducts)
      .catch(() => setError("Failed to load products. Is the server running?"))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section className="w-full bg-white dark:bg-black py-24 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 dark:border-white/10 pb-8 gap-6 transition-colors duration-300">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white uppercase transition-colors duration-300">
            Featured
          </h2>
          <div className="flex space-x-8 overflow-x-auto no-scrollbar w-full md:w-auto pb-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-bold tracking-widest uppercase pb-1 border-b-2 transition-colors duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? "border-black dark:border-white text-black dark:text-white"
                    : "border-transparent text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-red-500 font-medium py-12">{error}</p>
        )}

        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-zinc-900 mb-6" />
                <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-zinc-900 mb-6 transition-colors duration-300">
                  <div className="w-full h-full bg-gray-50 dark:bg-zinc-800 transition-all duration-700 group-hover:scale-105 flex items-center justify-center text-gray-300 dark:text-zinc-600 font-medium text-sm">
                    {product.name}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider transition-colors duration-300">
                      {product.category}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-black dark:text-white transition-colors duration-300">
                    ${product.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}