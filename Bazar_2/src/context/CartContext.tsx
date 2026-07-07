import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../types';

type CartItem = Product & { quantity: number };

interface CartContextProps {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (product: Product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) => p.id === product.id ? { ...p, quantity: Math.min((p.quantity + qty), product.stock) } : p);
      }
      return [{ ...product, quantity: Math.min(qty, product.stock) }, ...prev];
    });
  };

  const remove = (productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const clear = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, it) => s + (it.price * it.quantity), 0), [items]);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export type { CartItem };
