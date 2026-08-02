"use client";

import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import product1 from "../components/assets/images/product1.png";
import product2 from "../components/assets/images/product2.png";
import product3 from "../components/assets/images/product3.png";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full bg-background overflow-hidden">

      <div className="w-full bg-foreground text-background py-3 overflow-hidden relative flex">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap flex items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase">
          <span>Free Worldwide Shipping Over $150</span>
          <span>•</span>
          <span>New Collection Just Dropped</span>
          <span>•</span>
          <span>Limited Editions</span>
          <span>•</span>
          <span>Free Worldwide Shipping Over $150</span>
          <span>•</span>
          <span>New Collection Just Dropped</span>
          <span>•</span>
          <span>Limited Editions</span>
        </div>
      </div>

      <section className="relative w-full pb-24 pt-12 md:pt-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
            <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
              <div className="inline-flex items-center gap-2 border border-foreground/20 px-4 py-2">
                <Star className="w-4 h-4 fill-foreground" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Rated 4.9/5 by 10k+ Customers</span>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-light tracking-tighter text-foreground uppercase leading-[0.9]">
                Define <br/><span className="font-medium italic">Yourself</span>
              </h1>
              <p className="text-foreground/70 text-lg max-w-md font-light leading-relaxed">
                Elevate your everyday rotation with our premium streetwear essentials. Crafted for those who dictate the culture, not follow it.
              </p>
              <button
                onClick={() => router.push("/products")}
                className="group relative w-full sm:w-auto inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-sm font-medium tracking-[0.2em] uppercase transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-95"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </div>
            
            <div className="w-full lg:w-1/2 relative h-[500px] md:h-[600px] bg-muted group overflow-hidden cursor-pointer" onClick={() => router.push("/products")}>
              <Image
                src={product1}
                alt="Latest Collection"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-background p-4">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Featured Drop</span>
                <span className="text-xs font-light text-foreground underline underline-offset-4">View Details</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
             <h3 className="text-2xl font-light uppercase tracking-widest text-foreground">Trending Now</h3>
             <button onClick={() => router.push("/products")} className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[450px] overflow-hidden bg-muted group cursor-pointer" onClick={() => router.push("/products")}>
              <Image src={product2} alt="Look 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-white text-xl font-medium tracking-widest uppercase mb-2">Urban Utilities</h4>
                <p className="text-white/80 text-sm font-light">Explore Outerwear →</p>
              </div>
            </div>
            <div className="relative h-[450px] overflow-hidden bg-muted group cursor-pointer" onClick={() => router.push("/products")}>
              <Image src={product3} alt="Look 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-white text-xl font-medium tracking-widest uppercase mb-2">Core Basics</h4>
                <p className="text-white/80 text-sm font-light">Shop Essentials →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}