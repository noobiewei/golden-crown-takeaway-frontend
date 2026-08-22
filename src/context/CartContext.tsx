import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { MenuItem } from '../types';

export interface CartLine {
  item: MenuItem;
  quantity: number;
  note: string;
}

interface CartContextValue {
  lines: CartLine[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  updateNote: (itemId: number, note: string) => void;
  specialInstructions: string;
  setSpecialInstructions: (value: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'goldencrown-cart';

interface StoredCart {
  lines: CartLine[];
  specialInstructions: string;
}

function loadCartFromStorage(): StoredCart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lines: [], specialInstructions: '' };
    const parsed = JSON.parse(raw);
    // Older versions stored just an array of lines with no notes/instructions.
    if (Array.isArray(parsed)) {
      return {
        lines: parsed.map((line: CartLine) => ({ ...line, note: line.note ?? '' })),
        specialInstructions: '',
      };
    }
    return { lines: parsed.lines ?? [], specialInstructions: parsed.specialInstructions ?? '' };
  } catch {
    return { lines: [], specialInstructions: '' };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => loadCartFromStorage().lines);
  const [specialInstructions, setSpecialInstructions] = useState(() => loadCartFromStorage().specialInstructions);

  useEffect(() => {
    const toStore: StoredCart = { lines, specialInstructions };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [lines, specialInstructions]);

  function addToCart(item: MenuItem) {
    setLines((current) => {
      const existing = current.find((line) => line.item.id === item.id);
      if (existing) {
        return current.map((line) =>
          line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...current, { item, quantity: 1, note: '' }];
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

  function updateNote(itemId: number, note: string) {
    setLines((current) =>
      current.map((line) => (line.item.id === itemId ? { ...line, note } : line))
    );
  }

  function clearCart() {
    setLines([]);
    setSpecialInstructions('');
  }

  const totalPrice = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateNote,
        specialInstructions,
        setSpecialInstructions,
        clearCart,
        totalPrice,
        totalItems,
      }}
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
