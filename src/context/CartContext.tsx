import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { MenuItem } from '../types';

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'goldencrown-cart';

function loadCartFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  function addToCart(item: MenuItem) {
    setLines((current) => {
      const existing = current.find((line) => line.item.id === item.id);
      if (existing) {
        return current.map((line) =>
          line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...current, { item, quantity: 1 }];
    });
  }

  function removeFromCart(itemId: number) {
    setLines((current) => current.filter((line) => line.item.id !== itemId));
  }

  function updateQuantity(itemId: number, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setLines((current) =>
      current.map((line) => (line.item.id === itemId ? { ...line, quantity } : line))
    );
  }

  function clearCart() {
    setLines([]);
  }

  const totalPrice = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <CartContext.Provider
      value={{ lines, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
