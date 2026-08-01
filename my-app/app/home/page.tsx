"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import product1 from "../components/assets/images/product1.png";
import product2 from "../components/assets/images/product2.png";
import product3 from "../components/assets/images/product3.png";

export default function Home() {
  const router = useRouter();

  return (
    <section className="relative w-full bg-white dark:bg-black pb-24 pt-16 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-8 mb-20">
          <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-black tracking-tighter text-black dark:text-white uppercase leading-[0.85] transition-colors duration-300">
            Essential
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-lg font-medium transition-colors duration-300">
            The new standard of modern streetwear. Where uncompromising style meets everyday comfort.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="inline-flex items-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[300px]">
          <div className="md:col-span-1 md:row-span-2 relative overflow-hidden bg-gray-100 dark:bg-zinc-900 group transition-colors duration-300">
            <Image
              src={product1}
              alt="StreetWear Apparel"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="md:col-span-2 md:row-span-1 relative overflow-hidden bg-gray-100 dark:bg-zinc-900 group transition-colors duration-300">
            <Image
              src={product2}
              alt="StreetWear Apparel"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="md:col-span-2 md:row-span-1 relative overflow-hidden bg-gray-100 dark:bg-zinc-900 group transition-colors duration-300">
            <Image
              src={product3}
              alt="StreetWear Apparel"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
      
    </section>
  );
}