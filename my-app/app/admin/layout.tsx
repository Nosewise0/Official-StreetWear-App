"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Mail,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  ShoppingBag,
} from "lucide-react";

const ADMIN_EMAILS = ["admin1@gmail.com", "nonsaker021@gmail.com", "bilat2@gmail.com"];

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs tracking-[0.2em] uppercase text-foreground/50">Loading</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm px-8">
          <ShieldAlert className="w-12 h-12 text-foreground/30 mx-auto" />
          <div>
            <h1 className="text-2xl font-light tracking-[0.15em] uppercase">Access Denied</h1>
            <p className="text-sm text-foreground/50 mt-2 font-light">
              You don&apos;t have permission to view this page.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block text-[10px] tracking-[0.25em] uppercase border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-30 flex flex-col transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        <div className="p-8 border-b border-border">
          <p className="text-[9px] tracking-[0.35em] uppercase text-foreground/40 mb-1">Official StreetWear</p>
          <h1 className="text-xl font-light tracking-[0.2em] uppercase">OSW.</h1>
          <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/40 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-6 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-xs tracking-[0.15em] uppercase transition-colors
                  ${active
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border">
          <div className="mb-4">
            <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/40">Signed in as</p>
            <p className="text-xs text-foreground/70 mt-1 truncate">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-background">
          <div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/40">OSW.</p>
            <p className="text-xs tracking-[0.2em] uppercase">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
