'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  resetSession: () => void; // Added for Access Key switch
  subtotal: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getCartStorageKey = () => {
  if (typeof window === 'undefined') return 'kult_cart_default';
  
  let sessionId = localStorage.getItem('kult_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem('kult_session_id', sessionId);
  }
  return `kult_cart_${sessionId}`;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore cart on load
  useEffect(() => {
    try {
      const key = getCartStorageKey();
      const savedCart = localStorage.getItem(key);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        const key = getCartStorageKey();
        localStorage.setItem(key, JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    }
  }, [cartItems, isHydrated]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.id === item.id && ci.size === item.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, size?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && (size ? item.size === size : true))
      )
    );
  };

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      const key = getCartStorageKey();
      localStorage.removeItem(key);
    }
  };

  // Nayi Access Key enter hone par Purana Cart Clear karke New Session Banana
  const resetSession = () => {
    if (typeof window !== 'undefined') {
      const oldKey = getCartStorageKey();
      localStorage.removeItem(oldKey);
      
      // Force new session key creation
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('kult_session_id', newSessionId);
    }
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        resetSession,
        subtotal,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a global CartProvider');
  }
  return context;
};