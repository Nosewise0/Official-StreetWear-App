"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string | null;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (id: number) => void;
  toggleItem: (product: WishlistItem) => void;
  isWishlisted: (id: number) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const GUEST_STORAGE_KEY = "osw-wishlist-guest";

function getStorageKey(userId: string | undefined) {
  return userId ? `osw-wishlist-${userId}` : GUEST_STORAGE_KEY;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);


  useEffect(() => {
    if (authLoading) return;

    const key = getStorageKey(user?.id);

    if (key === currentKey) return;

    try {
      const stored = localStorage.getItem(key);
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }

    setCurrentKey(key);
    setHydrated(true);
  }, [user?.id, authLoading, currentKey]);


  useEffect(() => {
    if (!hydrated || !currentKey) return;
    localStorage.setItem(currentKey, JSON.stringify(items));
  }, [items, hydrated, currentKey]);

  const addItem = useCallback((product: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleItem = useCallback((product: WishlistItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) {
        return prev.filter((i) => i.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items]
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isWishlisted,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
