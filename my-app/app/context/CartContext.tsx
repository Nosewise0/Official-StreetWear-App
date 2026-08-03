"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

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

const STORAGE_KEY = "osw-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

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
