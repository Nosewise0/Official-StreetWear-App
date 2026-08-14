// All API calls now go through Next.js route handlers (no external Express server needed)
const BASE_URL = "";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  sizes: string[];
  colors: string[];
  image: string | null;
}

export interface User {
  id: number;
  user: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== "All") params.set("category", filters.category);
  if (filters?.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters?.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters?.search) params.set("search", filters.search);

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await apiFetch<ApiResponse<Product[]>>(`/api/products${query}`);
  return res.data;
}

export async function getProductById(id: number): Promise<Product> {
  const res = await apiFetch<ApiResponse<Product>>(`/api/products/${id}`);
  return res.data;
}

export async function getCategories(): Promise<string[]> {
  const res = await apiFetch<ApiResponse<string[]>>("/api/categories");
  return res.data;
}
