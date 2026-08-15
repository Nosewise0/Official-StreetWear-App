"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Mail, Users, ArrowRight, TrendingUp } from "lucide-react";

interface Stats {
  products: number;
  contacts: number;
  users: number;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  created_at: string;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/contacts").then((r) => r.json()),
    ])
      .then(([statsData, contactsData]) => {
        setStats(statsData);
        setRecentContacts((contactsData.data ?? []).slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Products",
      value: stats?.products ?? 0,
      icon: Package,
      href: "/admin/products",
      description: "In your catalogue",
    },
    {
      label: "Contact Submissions",
      value: stats?.contacts ?? 0,
      icon: Mail,
      href: "/admin/contacts",
      description: "All time inquiries",
    },
    {
      label: "Registered Users",
      value: stats?.users ?? 0,
      icon: Users,
      href: "/admin",
      description: "Signed up accounts",
    },
    {
      label: "Store Status",
      value: "Live",
      icon: TrendingUp,
      href: "/products",
      description: "Currently active",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Admin</p>
        <h2 className="text-3xl font-light tracking-[0.1em] uppercase">Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-border">
        {statCards.map(({ label, value, icon: Icon, href, description }) => (
          <Link
            key={label}
            href={href}
            className="group bg-background p-8 flex flex-col justify-between gap-6 hover:bg-muted transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-muted group-hover:bg-background border border-border transition-colors">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <p className="text-4xl font-light text-foreground">{loading ? "—" : value}</p>
              <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/40 mt-1">{label}</p>
              <p className="text-xs text-foreground/40 font-light mt-1">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Inbox</p>
            <h3 className="text-lg font-light tracking-[0.1em] uppercase">Recent Contacts</h3>
          </div>
          <Link
            href="/admin/contacts"
            className="text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-foreground flex items-center gap-2 transition-colors"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-px bg-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background p-5 animate-pulse flex gap-4">
                <div className="h-3 bg-muted w-32 rounded" />
                <div className="h-3 bg-muted w-48 rounded" />
              </div>
            ))}
          </div>
        ) : recentContacts.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <Mail className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
            <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">No contact submissions yet</p>
          </div>
        ) : (
          <div className="border border-border divide-y divide-border">
            {recentContacts.map((c) => (
              <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-foreground/50">{c.email}</p>
                  <span className="text-[9px] tracking-[0.15em] uppercase border border-border px-2 py-1 self-start">
                    {c.type}
                  </span>
                </div>
                <p className="text-[10px] text-foreground/40 whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
