"use client";

import { useEffect, useState } from "react";
import { Mail, Search } from "lucide-react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((d) => setContacts(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Admin</p>
          <h2 className="text-3xl font-light tracking-[0.1em] uppercase">Contacts</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent border border-border pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/30 w-56"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-px bg-border">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-background p-5 animate-pulse flex gap-6">
              <div className="h-3 bg-muted w-32 rounded" />
              <div className="h-3 bg-muted w-48 rounded" />
              <div className="h-3 bg-muted w-24 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-16 text-center">
          <Mail className="w-10 h-10 text-foreground/20 mx-auto mb-4" />
          <p className="text-xs tracking-[0.2em] uppercase text-foreground/40">
            {search ? "No results found" : "No contact submissions yet"}
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                {["Name", "Email", "Type", "Date", ""].map((h) => (
                  <th key={h} className="text-left text-[9px] tracking-[0.2em] uppercase text-foreground/50 px-5 py-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelected(c)}
                >
                  <td className="px-5 py-4 font-medium">{c.name}</td>
                  <td className="px-5 py-4 text-foreground/60">{c.email}</td>
                  <td className="px-5 py-4">
                    <span className="text-[9px] tracking-[0.15em] uppercase border border-border px-2 py-1">
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-foreground/40 whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <a
                      href={`mailto:${c.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] tracking-[0.2em] uppercase border border-border px-3 py-1.5 hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                    >
                      Reply
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-sm tracking-[0.2em] uppercase font-medium">Submission Detail</h3>
              <button onClick={() => setSelected(null)}>
                <span className="text-foreground/40 hover:text-foreground transition-colors text-lg leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 mb-1">Name</p>
                  <p className="text-sm">{selected.name}</p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 mb-1">Inquiry Type</p>
                  <p className="text-sm">{selected.type}</p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 mb-1">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-sm hover:underline">{selected.email}</a>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 mb-1">Date</p>
                  <p className="text-sm">
                    {new Date(selected.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase text-foreground/40 mb-2">Message</p>
                <p className="text-sm text-foreground/70 font-light leading-relaxed whitespace-pre-wrap border border-border p-4 bg-muted">
                  {selected.message}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button
                onClick={() => setSelected(null)}
                className="text-[10px] tracking-[0.2em] uppercase px-5 py-3 border border-border hover:bg-muted transition-colors"
              >
                Close
              </button>
              <a
                href={`mailto:${selected.email}`}
                className="text-[10px] tracking-[0.2em] uppercase px-5 py-3 bg-foreground text-background hover:bg-foreground/80 transition-colors"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
