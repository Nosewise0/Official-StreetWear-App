"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, ChevronDown, Menu, X, Sun, Moon, User, Heart, Globe, HelpCircle } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="w-full flex flex-col z-50 sticky top-0 bg-background">
      <nav className="w-full bg-background border-b border-border transition-colors duration-300 relative">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">

          <div className="flex-1 flex md:hidden justify-start">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-foreground/50 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1} /> : <Menu className="w-6 h-6" strokeWidth={1} />}
            </button>
          </div>

          <div className="flex-1 flex justify-center md:justify-start">
            <Link
              href="/"
              className="text-4xl font-light tracking-[0.2em] text-foreground uppercase transition-colors duration-300"
            >
              OSW<span className="text-foreground/30">.</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-2 justify-center items-center space-x-12 text-[11px] font-medium tracking-[0.2em] text-foreground uppercase transition-colors duration-300 h-full">
            <Link href="/products" className="h-full flex items-center group relative">
              <span className="relative">
                New Arrivals
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </span>
            </Link>

            <div className="h-full flex items-center group">
              <button className="flex items-center gap-2 hover:text-foreground/60 transition-colors duration-300 uppercase cursor-pointer relative h-full">
                <span className="relative">
                  Collections
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </span>
                <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" strokeWidth={1.5} />
              </button>

              <div className="absolute top-20 left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-background border-b border-border shadow-lg flex justify-center z-50">
                <div className="max-w-5xl w-full flex py-10 px-6">
                  <div className="w-1/3 flex flex-col space-y-4 border-r border-border pr-8">
                    <span className="text-xs font-bold tracking-widest text-foreground/40 mb-2">Categories</span>
                    {["Menswear", "Womenswear", "Accessories", "Footwear"].map((item) => (
                      <Link key={item} href="/products" className="text-xs tracking-[0.2em] uppercase hover:translate-x-2 text-foreground transition-transform">
                        {item}
                      </Link>
                    ))}
                  </div>
                  <div className="w-2/3 pl-12 grid grid-cols-2 gap-8">
                    <div className="flex flex-col bg-muted relative overflow-hidden group/mega cursor-pointer h-48 p-6" onClick={() => window.location.href = '/products'}>
                      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
                      <div className="z-10 mt-auto">
                        <span className="bg-background text-foreground px-3 py-1 text-[10px] border border-border">Trending</span>
                        <h4 className="mt-4 text-lg font-light tracking-widest uppercase group-hover/mega:underline underline-offset-4">The Core Collection</h4>
                      </div>
                    </div>
                    <div className="flex flex-col bg-muted relative overflow-hidden group/mega cursor-pointer h-48 p-6" onClick={() => window.location.href = '/products'}>
                      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)" }}></div>
                      <div className="z-10 mt-auto">
                        <span className="bg-background text-foreground px-3 py-1 text-[10px] border border-border">New</span>
                        <h4 className="mt-4 text-lg font-light tracking-widest uppercase group-hover/mega:underline underline-offset-4">Urban Utilities</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/products" className="h-full flex items-center group italic">
              <span className="relative hover:text-foreground/60 transition-colors">
                Archive / Sale
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </span>
            </Link>

            <Link href="/about" className="h-full flex items-center group">
              <span className="relative hover:text-foreground/60 transition-colors">
                About
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-6">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground hover:text-foreground/50 transition-colors duration-300"
            >
              {isSearchOpen ? <X className="w-5 h-5" strokeWidth={1} /> : <Search className="w-5 h-5" strokeWidth={1} />}
            </button>

            <Link href="/login" className="text-foreground hover:text-foreground/50 transition-colors duration-300 hidden md:block">
              <User className="w-5 h-5" strokeWidth={1} />
            </Link>

            <Link href="/wishlist" className="text-foreground hover:text-foreground/50 transition-colors duration-300 hidden md:block">
              <Heart className="w-5 h-5" strokeWidth={1} />
            </Link>

            <button className="text-foreground hover:text-foreground/50 transition-colors duration-300 flex items-center gap-2 group">
              <ShoppingBag className="w-5 h-5" strokeWidth={1} />
              <span className="bg-foreground text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center transition-colors group-hover:bg-foreground/80">
                0
              </span>
            </button>
          </div>
        </div>

        <div className={`w-full bg-background border-b border-border overflow-hidden transition-all duration-300 ${isSearchOpen ? "max-h-24 opacity-100 py-6" : "max-h-0 opacity-0 py-0 border-transparent"}`}>
          <div className="container mx-auto px-6 max-w-2xl flex items-center">
            <Search className="w-5 h-5 text-foreground/40 mr-4" strokeWidth={1} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="WHAT ARE YOU LOOKING FOR?"
              className="w-full bg-transparent text-sm tracking-[0.2em] font-light uppercase text-foreground focus:outline-none placeholder:text-foreground/30"
              autoFocus={isSearchOpen}
            />
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[120px] bg-background px-6 py-10 flex flex-col space-y-10 transition-colors duration-300 overflow-y-auto z-40">
          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-widest text-foreground uppercase hover:text-foreground/50 transition-colors">New Arrivals</Link>

          <div className="flex flex-col space-y-6">
            <span className="text-xs font-medium tracking-[0.3em] text-foreground/40 uppercase">Collections</span>
            <div className="flex flex-col space-y-6 pl-6 border-l border-border">
              {["Menswear", "Womenswear", "Accessories", "Footwear"].map((item) => (
                <Link key={item} href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-light tracking-widest text-foreground uppercase hover:text-foreground/50 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-widest text-foreground uppercase hover:text-foreground/50 transition-colors italic">Archive / Sale</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-widest text-foreground uppercase hover:text-foreground/50 transition-colors">About</Link>

          <div className="mt-auto pt-8 border-t border-border grid grid-cols-2 gap-6">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-foreground uppercase hover:text-foreground/50 transition-colors">
              <User className="w-4 h-4" strokeWidth={1} /> Account
            </Link>
            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-foreground uppercase hover:text-foreground/50 transition-colors">
              <Heart className="w-4 h-4" strokeWidth={1} /> Wishlist
            </Link>
            <button onClick={toggleTheme} className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-foreground uppercase hover:text-foreground/50 transition-colors">
              {isDark ? <Sun className="w-4 h-4" strokeWidth={1} /> : <Moon className="w-4 h-4" strokeWidth={1} />} Theme
            </button>
            <Link href="/help" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-foreground uppercase hover:text-foreground/50 transition-colors">
              <HelpCircle className="w-4 h-4" strokeWidth={1} /> Help
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}