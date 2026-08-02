"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, ChevronDown, Menu, X, Sun, Moon, User } from "lucide-react";

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
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between max-w-7xl">

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
            className="text-3xl font-light tracking-[0.2em] text-foreground uppercase transition-colors duration-300"
          >
            OSW<span className="text-foreground/30">.</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center space-x-12 text-[10px] font-medium tracking-[0.2em] text-foreground uppercase transition-colors duration-300">
          <Link href="/products" className="relative group">
            <span className="hover:text-foreground/60 transition-colors">New Arrivals</span>
            <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </Link>

          <div className="group relative">
            <button className="flex items-center gap-2 hover:text-foreground/60 transition-colors duration-300 uppercase cursor-pointer">
              Collections
              <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" strokeWidth={1.5} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="w-56 bg-background border border-border shadow-2xl flex flex-col py-4">
                {["Menswear", "Womenswear", "Accessories", "Footwear"].map((item) => (
                  <Link key={item} href="/products" className="px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-muted text-foreground transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/about" className="relative group">
            <span className="hover:text-foreground/60 transition-colors">About</span>
            <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center space-x-6">
          <button
            onClick={toggleTheme}
            className="text-foreground hover:text-foreground/50 transition-colors duration-300"
          >
            {isDark ? <Sun className="w-5 h-5" strokeWidth={1} /> : <Moon className="w-5 h-5" strokeWidth={1} />}
          </button>

          <div className="flex items-center">
            {isSearchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH..."
                className="w-32 md:w-48 mr-4 bg-transparent text-[10px] tracking-[0.2em] font-medium uppercase text-foreground border-b border-border focus:outline-none focus:border-foreground transition-all duration-300"
                autoFocus
              />
            )}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground hover:text-foreground/50 transition-colors duration-300"
            >
              <Search className="w-5 h-5" strokeWidth={1} />
            </button>
          </div>

          <Link href="/login" className="text-foreground hover:text-foreground/50 transition-colors duration-300 hidden md:block">
            <User className="w-5 h-5" strokeWidth={1} />
          </Link>

          <button className="text-foreground hover:text-foreground/50 transition-colors duration-300 relative flex items-center gap-2 group">
            <ShoppingBag className="w-5 h-5" strokeWidth={1} />
            <span className="bg-foreground text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center transition-colors group-hover:bg-foreground/80">
              0
            </span>
          </button>
        </div>
      </div>


      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-6rem)] bg-background border-t border-border px-6 py-10 flex flex-col space-y-10 transition-colors duration-300">
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
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-widest text-foreground uppercase hover:text-foreground/50 transition-colors">About</Link>
          
          <div className="mt-auto pt-8 border-t border-border flex items-center justify-between">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-foreground uppercase hover:text-foreground/50 transition-colors">
              <User className="w-4 h-4" strokeWidth={1} /> Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}