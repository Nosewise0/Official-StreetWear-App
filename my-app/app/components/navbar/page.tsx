"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, ShoppingBag, ChevronDown, Menu, X, Sun, Moon,
  User, Heart, HelpCircle, Home, Info, Phone, ShoppingCart,
  FileText, Lock, Package, LogIn, UserPlus, LayoutDashboard,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { getProducts, type Product } from "../../lib/api";

interface SitePage {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  keywords: string[];
}

const SITE_PAGES: SitePage[] = [
  {
    label: "Home",
    description: "Go back to the homepage",
    href: "/",
    icon: Home,
    keywords: ["start", "main", "landing", "osw"],
  },
  {
    label: "Shop / Products",
    description: "Browse the full collection",
    href: "/products",
    icon: Package,
    keywords: ["shop", "collection", "buy", "browse", "menswear", "womenswear", "clothing", "streetwear", "sale", "archive"],
  },
  {
    label: "Cart",
    description: "View your shopping cart",
    href: "/cart",
    icon: ShoppingCart,
    keywords: ["bag", "basket", "checkout", "order"],
  },
  {
    label: "Wishlist",
    description: "View your saved items",
    href: "/wishlist",
    icon: Heart,
    keywords: ["saved", "favourites", "favorites", "liked"],
  },
  {
    label: "Profile",
    description: "Manage your account",
    href: "/profile",
    icon: User,
    keywords: ["account", "settings", "me", "my account", "edit"],
  },
  {
    label: "Login",
    description: "Sign in to your account",
    href: "/login",
    icon: LogIn,
    keywords: ["sign in", "signin", "log in", "auth", "access"],
  },
  {
    label: "Register",
    description: "Create a new account",
    href: "/register",
    icon: UserPlus,
    keywords: ["sign up", "signup", "new account", "join", "create account"],
  },
  {
    label: "About",
    description: "Learn about OSW",
    href: "/about",
    icon: Info,
    keywords: ["brand", "story", "us", "who we are", "mission"],
  },
  {
    label: "Contact",
    description: "Get in touch with us",
    href: "/contact",
    icon: Phone,
    keywords: ["support", "help", "email", "message", "reach out"],
  },
  {
    label: "Help",
    description: "FAQs and support articles",
    href: "/help",
    icon: HelpCircle,
    keywords: ["faq", "questions", "support", "guide", "how to"],
  },
  {
    label: "Privacy Policy",
    description: "How we handle your data",
    href: "/privacy",
    icon: Lock,
    keywords: ["gdpr", "data", "cookies", "legal", "policy"],
  },
  {
    label: "Terms of Service",
    description: "Our terms and conditions",
    href: "/terms",
    icon: FileText,
    keywords: ["conditions", "legal", "agreement", "rules"],
  },
  {
    label: "Admin Dashboard",
    description: "Manage the store",
    href: "/admin",
    icon: LayoutDashboard,
    keywords: ["dashboard", "management", "backend", "panel"],
  },
];

function matchPages(query: string): SitePage[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return SITE_PAGES.filter(
    (p) =>
      p.label.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.keywords.some((k) => k.includes(q))
  ).slice(0, 4);
}

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [pageResults, setPageResults] = useState<SitePage[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { user, loading: autLoading } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fullName, setFullName] = useState("");


  const userHref = user ? "/profile" : "/login";

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(String(user.user_metadata.full_name));
    }
  }, [user]);

  const userDisplayName = user
    ? (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Member"
    : "Guest";


  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setProductResults([]);
      setPageResults([]);
      setShowDropdown(false);
      return;
    }

    setPageResults(matchPages(value));
    setShowDropdown(true);

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await getProducts({ search: value.trim() });
        setProductResults(results.slice(0, 4));
      } catch {
        setProductResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!searchQuery.trim()) return;
      setShowDropdown(false);
      setIsSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    },
    [searchQuery, router]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setProductResults([]);
    setPageResults([]);
    setShowDropdown(false);
  };


  const hasResults = pageResults.length > 0 || productResults.length > 0;

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

            <Link href="/contact" className="h-full flex items-center group">
              <span className="relative hover:text-foreground/60 transition-colors">
                Contact
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-6">
            <button
              onClick={() => { isSearchOpen ? closeSearch() : setIsSearchOpen(true); }}
              className="text-foreground hover:text-foreground/50 transition-colors duration-300"
            >
              {isSearchOpen ? <X className="w-5 h-5" strokeWidth={1} /> : <Search className="w-5 h-5" strokeWidth={1} />}
            </button>
            <button onClick={toggleTheme} className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-foreground uppercase hover:text-foreground/50 transition-colors">
              {isDark ? <Sun className="w-4 h-4" strokeWidth={1} /> : <Moon className="w-4 h-4" strokeWidth={1} />}
            </button>
            <Link href={userHref} className="text-foreground hover:text-foreground/50 transition-colors duration-300 hidden md:block">
              <span className="relative text-xs font-medium tracking-[0.2em] text-foreground uppercase hover:text-foreground/50 transition-colors">
                {user ? userDisplayName : <User className="w-5 h-5" strokeWidth={1} />}
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </span>
            </Link>

            <Link href="/wishlist" className="text-foreground hover:text-foreground/50 transition-colors duration-300 hidden md:flex items-center gap-1.5 group">
              <Heart className="w-5 h-5" strokeWidth={1} />
              {wishlistItems > 0 && (
                <span className="bg-foreground text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center transition-colors group-hover:bg-foreground/80">
                  {wishlistItems}
                </span>
              )}
            </Link>

            <Link href="/cart" className="text-foreground hover:text-foreground/50 transition-colors duration-300 flex items-center gap-2 group">
              <ShoppingBag className="w-5 h-5" strokeWidth={1} />
              <span className="bg-foreground text-background text-[10px] font-bold w-5 h-5 flex items-center justify-center transition-colors group-hover:bg-foreground/80">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>


        <div
          ref={searchRef}
          className={`w-full bg-background border-b border-border overflow-visible transition-all duration-300 ${isSearchOpen ? "max-h-24 opacity-100 py-6" : "max-h-0 opacity-0 py-0 border-transparent pointer-events-none"}`}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="container mx-auto px-6 max-w-2xl flex items-center relative"
          >
            <Search className="w-5 h-5 text-foreground/40 mr-4 shrink-0" strokeWidth={1} />
            <input
              id="navbar-search-input"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Escape" && closeSearch()}
              placeholder="SEARCH PAGES, PRODUCTS..."
              className="w-full bg-transparent text-sm tracking-[0.2em] font-light uppercase text-foreground focus:outline-none placeholder:text-foreground/30"
              autoFocus={isSearchOpen}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setProductResults([]); setPageResults([]); setShowDropdown(false); }}
                className="shrink-0 text-foreground/30 hover:text-foreground transition-colors ml-3"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}


            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-background border border-border shadow-xl z-[100] max-h-[70vh] overflow-y-auto">


                {pageResults.length > 0 && (
                  <div>
                    <p className="px-5 pt-4 pb-2 text-[9px] font-bold tracking-[0.3em] uppercase text-foreground/35">
                      Pages
                    </p>
                    {pageResults.map((page) => {
                      const Icon = page.icon;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          onClick={closeSearch}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-muted transition-colors group border-t border-border/50 first:border-0"
                        >
                          <div className="w-8 h-8 border border-border flex items-center justify-center shrink-0 text-foreground/40 group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
                            <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wider text-foreground group-hover:underline underline-offset-2 decoration-foreground/30">
                              {page.label}
                            </p>
                            <p className="text-[10px] text-foreground/50 mt-0.5 font-light">
                              {page.description}
                            </p>
                          </div>
                          <span className="text-[10px] text-foreground/30 tracking-widest font-mono shrink-0">{page.href}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}


                {(productResults.length > 0 || searchLoading) && (
                  <div className={pageResults.length > 0 ? "border-t border-border" : ""}>
                    <p className="px-5 pt-4 pb-2 text-[9px] font-bold tracking-[0.3em] uppercase text-foreground/35">
                      Products
                    </p>
                    {searchLoading ? (
                      <div className="px-5 pb-4 text-[10px] tracking-[0.2em] uppercase text-foreground/40 animate-pulse">
                        Searching products...
                      </div>
                    ) : (
                      productResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={closeSearch}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-muted transition-colors group border-t border-border/50"
                        >
                          <div className="w-8 h-10 bg-muted shrink-0 relative overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[10px] text-foreground/20 font-light">{product.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wider text-foreground truncate group-hover:underline underline-offset-2 decoration-foreground/30">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-foreground/50 tracking-[0.15em] uppercase mt-0.5">
                              {product.category}
                            </p>
                          </div>
                          <span className="text-sm font-light text-foreground shrink-0">${product.price}</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}


                {!searchLoading && !hasResults && (
                  <div className="px-5 py-6 text-center">
                    <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">
                      No results for &ldquo;{searchQuery}&rdquo;
                    </p>
                  </div>
                )}


                <button
                  type="submit"
                  className="w-full px-5 py-3 text-[10px] font-medium tracking-[0.25em] uppercase text-foreground/40 hover:text-foreground hover:bg-muted transition-colors text-left border-t border-border"
                >
                  Search all products for &ldquo;{searchQuery}&rdquo; →
                </button>
              </div>
            )}
          </form>
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
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-widest text-foreground uppercase hover:text-foreground/50 transition-colors">Contact</Link>

          <div className="mt-auto pt-8 border-t border-border grid grid-cols-2 gap-6">
            <Link href={userHref} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-foreground uppercase hover:text-foreground/50 transition-colors">
              <User className="w-4 h-4" strokeWidth={1} /> {user ? "Profile" : "Account"}
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