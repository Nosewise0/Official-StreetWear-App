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

export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string | null;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: number, size: string, color: string) => void;
  updateQuantity: (id: number, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

// Guest cart key (used when no user is logged in)
const GUEST_KEY = "osw-cart-guest";

function getStorageKey(userId: string | undefined) {
  return userId ? `osw-cart-${userId}` : GUEST_KEY;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // Track which storage key was last loaded so we can re-hydrate on user change
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  // Re-hydrate cart whenever auth resolves or the logged-in user changes
  useEffect(() => {
    if (authLoading) return; // wait for auth to settle before reading storage

    const key = getStorageKey(user?.id);

    if (key === currentKey) return; // already loaded for this user/guest

    try {
      const stored = localStorage.getItem(key);
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }

    setCurrentKey(key);
    setHydrated(true);
  }, [user?.id, authLoading, currentKey]);

  // Persist cart to the current user's key whenever items change
  useEffect(() => {
    if (!hydrated || !currentKey) return;
    localStorage.setItem(currentKey, JSON.stringify(items));
  }, [items, hydrated, currentKey]);

  const addItem = useCallback(
    (product: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) =>
            i.id === product.id &&
            i.size === product.size &&
            i.color === product.color
        );
        if (idx !== -1) {
          return prev.map((item, index) =>
            index === idx ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    },
    []
  );

  const removeItem = useCallback((id: number, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.id === id && i.size === size && i.color === color)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (id: number, size: string, color: string, qty: number) => {
      if (qty <= 0) {
        removeItem(id, size, color);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === id && i.size === size && i.color === color
            ? { ...i, quantity: qty }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
