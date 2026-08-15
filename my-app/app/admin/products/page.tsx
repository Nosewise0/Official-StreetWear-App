"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Package, Check } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  sizes: string[];
  colors: string[];
  image?: string | null;
}

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  description: "",
  stock: "",
  sizes: "",
  colors: "",
  image: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setSelected(null);
    setModal("add");
  };

  const openEdit = (p: Product) => {
    setSelected(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      description: p.description ?? "",
      stock: String(p.stock ?? 0),
      sizes: (p.sizes ?? []).join(", "),
      colors: (p.colors ?? []).join(", "),
      image: p.image ?? "",
    });
    setModal("edit");
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      description: form.description,
      stock: parseInt(form.stock) || 0,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      image: form.image || null,
    };

    const url = modal === "edit" && selected ? `/api/admin/products/${selected.id}` : "/api/admin/products";
    const method = modal === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setModal(null);
      fetchProducts();
      showToast(modal === "edit" ? "Product updated." : "Product created.");
    } else {
      const d = await res.json();
      alert(d.error ?? "Something went wrong");
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteId(null);
      fetchProducts();
      showToast("Product deleted.");
    } else {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="space-y-8">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-6 py-3 text-xs tracking-[0.2em] uppercase flex items-center gap-3 shadow-lg">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/40 mb-1">Admin</p>
          <h2 className="text-3xl font-light tracking-[0.1em] uppercase">Products</h2>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-foreground text-background text-[10px] tracking-[0.2em] uppercase px-5 py-3 hover:bg-foreground/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-px bg-border">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-background p-5 animate-pulse flex gap-6">
              <div className="h-3 bg-muted w-48 rounded" />
              <div className="h-3 bg-muted w-24 rounded" />
              <div className="h-3 bg-muted w-16 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="border border-border p-16 text-center">
          <Package className="w-10 h-10 text-foreground/20 mx-auto mb-4" />
          <p className="text-xs tracking-[0.2em] uppercase text-foreground/40 mb-6">No products yet</p>
          <button
            onClick={openAdd}
            className="text-[10px] tracking-[0.2em] uppercase border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                {["Image", "Name", "Category", "Price", "Stock", "Sizes", ""].map((h) => (
                  <th key={h} className="text-left text-[9px] tracking-[0.2em] uppercase text-foreground/50 px-5 py-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-4">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover border border-border" />
                    ) : (
                      <div className="w-10 h-10 bg-muted flex items-center justify-center text-[10px] text-foreground/40 font-bold border border-border">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-medium">{p.name}</td>
                  <td className="px-5 py-4 text-foreground/60 text-xs tracking-widest uppercase">{p.category}</td>
                  <td className="px-5 py-4">${p.price}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 ${p.stock > 0 ? "bg-muted text-foreground" : "bg-foreground text-background"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-foreground/50">{(p.sizes ?? []).join(", ") || "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 hover:bg-muted border border-transparent hover:border-border transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-2 hover:bg-muted border border-transparent hover:border-border transition-colors text-foreground/60 hover:text-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-sm tracking-[0.2em] uppercase font-medium">
                {modal === "add" ? "Add Product" : "Edit Product"}
              </h3>
              <button onClick={() => setModal(null)}>
                <X className="w-5 h-5 text-foreground/50 hover:text-foreground transition-colors" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {(
                [
                  { key: "name", label: "Name", placeholder: "e.g. OSW Oversized Tee" },
                  { key: "category", label: "Category", placeholder: "e.g. T-Shirts" },
                  { key: "price", label: "Price (USD)", placeholder: "e.g. 49.99", type: "number" },
                  { key: "stock", label: "Stock", placeholder: "e.g. 100", type: "number" },
                  { key: "image", label: "Image URL", placeholder: "e.g. https://images.unsplash.com/..." },
                  { key: "sizes", label: "Sizes (comma-separated)", placeholder: "S, M, L, XL" },
                  { key: "colors", label: "Colors (comma-separated)", placeholder: "Black, White" },
                ] as { key: string; label: string; placeholder: string; type?: string }[]
              ).map(({ key, label, placeholder, type }) => (
                <div key={key} className="space-y-2">
                  <label className="text-[9px] tracking-[0.25em] uppercase text-foreground/50">{label}</label>
                  <input
                    type={type ?? "text"}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20"
                  />
                  {key === "image" && form.image && (
                    <div className="mt-2 w-20 h-20 border border-border overflow-hidden">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                  )}
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-[9px] tracking-[0.25em] uppercase text-foreground/50">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..."
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button
                onClick={() => setModal(null)}
                className="text-[10px] tracking-[0.2em] uppercase px-5 py-3 border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-[10px] tracking-[0.2em] uppercase px-5 py-3 bg-foreground text-background hover:bg-foreground/80 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border w-full max-w-sm p-8 text-center space-y-6">
            <Trash2 className="w-8 h-8 text-foreground/40 mx-auto" />
            <div>
              <h3 className="text-sm tracking-[0.15em] uppercase font-medium">Delete Product?</h3>
              <p className="text-xs text-foreground/50 mt-2 font-light">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 text-[10px] tracking-[0.2em] uppercase py-3 border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 text-[10px] tracking-[0.2em] uppercase py-3 bg-foreground text-background hover:bg-foreground/80 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
