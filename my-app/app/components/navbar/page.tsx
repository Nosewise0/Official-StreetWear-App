"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, ChevronDown, Menu, X, Sun, Moon, User } from "lucide-react";

export default function Navbar({ setPage }: { setPage?: (page: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">

        <div className="flex-1 flex md:hidden justify-start">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
          </button>
        </div>

        <div className="flex-1 flex justify-center md:justify-start">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage && setPage("home");
            }}
            className="text-2xl font-bold tracking-tighter text-black dark:text-white uppercase transition-colors duration-300"
          >
            Streetwear<span className="text-gray-400 dark:text-gray-500">.</span>
          </a>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center space-x-10 text-xs font-semibold tracking-widest text-black dark:text-white uppercase transition-colors duration-300">
          <a href="#" className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300">New Arrivals</a>

          <div className="group relative">
            <button className="flex items-center gap-1 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300 uppercase cursor-pointer">
              Collections
              <ChevronDown className="w-3 h-3" strokeWidth={3} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl flex flex-col py-2 transition-colors duration-300">
                <a href="#" className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors duration-200">Menswear</a>
                <a href="#" className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors duration-200">Womenswear</a>
                <a href="#" className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors duration-200">Accessories</a>
                <a href="#" className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors duration-200">Footwear</a>
              </div>
            </div>
          </div>

          <a href="#" className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300">About</a>
        </div>

        <div className="flex-1 flex justify-end items-center space-x-4 md:space-x-6">
          <button
            onClick={toggleTheme}
            className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300"
          >
            {isDark ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
          </button>

          <div className="flex items-center">
            {isSearchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-24 md:w-40 mr-2 bg-transparent text-xs text-black dark:text-white border-b border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white transition-all duration-300"
                autoFocus
              />
            )}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          <button className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300 relative">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1.5 bg-black dark:bg-white text-white dark:text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300">
              0
            </span>
          </button>

          <Link href="/login">
            <button className="text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </Link>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-white/10 shadow-lg px-6 py-4 flex flex-col space-y-4 transition-colors duration-300">
          <a href="#" className="text-sm font-semibold tracking-widest text-black dark:text-white uppercase hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300">New Arrivals</a>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-semibold tracking-widest text-black dark:text-white uppercase">Collections</span>
            <div className="pl-4 flex flex-col space-y-2">
              <a href="#" className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase hover:text-black dark:hover:text-white transition-colors duration-300">Menswear</a>
              <a href="#" className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase hover:text-black dark:hover:text-white transition-colors duration-300">Womenswear</a>
              <a href="#" className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase hover:text-black dark:hover:text-white transition-colors duration-300">Accessories</a>
              <a href="#" className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase hover:text-black dark:hover:text-white transition-colors duration-300">Footwear</a>
            </div>
          </div>
          <a href="#" className="text-sm font-semibold tracking-widest text-black dark:text-white uppercase hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300">About</a>
        </div>
      )}
    </nav>
  );
}