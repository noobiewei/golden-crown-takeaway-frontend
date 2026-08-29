import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DishExtra, MenuItem } from '../types';

export interface CartLine {
  lineId: string;
  item: MenuItem;
  quantity: number;
  note: string;
  extras: DishExtra[];
}

interface CartContextValue {
  lines: CartLine[];
  addToCart: (item: MenuItem) => void;
  addCustomizedToCart: (item: MenuItem, quantity: number, note: string, extras: DishExtra[]) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateNote: (lineId: string, note: string) => void;
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

function makeLineId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadCartFromStorage(): StoredCart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lines: [], specialInstructions: '' };
    const parsed = JSON.parse(raw);
    // Older versions stored just an array of lines with no notes/extras/lineId.
    if (Array.isArray(parsed)) {
      return {
        lines: parsed.map((line: CartLine) => ({
          ...line,
          lineId: line.lineId ?? makeLineId(),
          note: line.note ?? '',
          extras: line.extras ?? [],
        })),
        specialInstructions: '',
      };
    }
    return {
      lines: (parsed.lines ?? []).map((line: CartLine) => ({
        ...line,
        lineId: line.lineId ?? makeLineId(),
        extras: line.extras ?? [],
      })),
      specialInstructions: parsed.specialInstructions ?? '',
    };
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
      const existing = current.find(
        (line) => line.item.id === item.id && line.note === '' && line.extras.length === 0
      );
      if (existing) {
        return current.map((line) =>
          line.lineId === existing.lineId ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...current, { lineId: makeLineId(), item, quantity: 1, note: '', extras: [] }];
    });
  }

  function addCustomizedToCart(item: MenuItem, quantity: number, note: string, extras: DishExtra[]) {
    setLines((current) => [...current, { lineId: makeLineId(), item, quantity, note, extras }]);
  }

  function removeFromCart(lineId: string) {
    setLines((current) => current.filter((line) => line.lineId !== lineId));
  }

  function updateQuantity(lineId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setLines((current) =>
      current.map((line) => (line.lineId === lineId ? { ...line, quantity } : line))
    );
  }

  function updateNote(lineId: string, note: string) {
    setLines((current) =>
      current.map((line) => (line.lineId === lineId ? { ...line, note } : line))
    );
  }

  function clearCart() {
    setLines([]);
    setSpecialInstructions('');
  }

  const totalPrice = lines.reduce((sum, line) => {
    const extrasPrice = line.extras.reduce((extrasSum, extra) => extrasSum + extra.price, 0);
    return sum + (line.item.price + extrasPrice) * line.quantity;
  }, 0);
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        addToCart,
        addCustomizedToCart,
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
