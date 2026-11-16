'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Smartphone, SmartphoneVariant, Coupon } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (smartphone: Smartphone, variant: SmartphoneVariant, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotalPkr: number;
  discountPkr: number;
  shippingFeePkr: number;
  totalPkr: number;
  itemCount: number;
}

const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'WELCOME2026', discount_type: 'percentage', discount_value: 5, min_order_pkr: 50000, max_discount_pkr: 15000 },
  { code: 'PAKISTAN5000', discount_type: 'fixed_pkr', discount_value: 5000, min_order_pkr: 100000 }
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phoneverse_cart');
      if (saved) setItems(JSON.parse(saved));
      const savedCoupon = localStorage.getItem('phoneverse_coupon');
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.warn('Failed to parse cart storage', e);
    }
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('phoneverse_cart', JSON.stringify(newItems));
  };

  const addToCart = (smartphone: Smartphone, variant: SmartphoneVariant, quantity: number = 1) => {
    const itemKey = `${smartphone.id}_${variant.id}`;
    const existingIndex = items.findIndex(i => i.id === itemKey);

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += quantity;
      saveItems(updated);
    } else {
      const newItem: CartItem = {
        id: itemKey,
        smartphone,
        variant,
        quantity
      };
      saveItems([...items, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    saveItems(items.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const updated = items.map(i => (i.id === itemId ? { ...i, quantity } : i));
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
    removeCoupon();
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code === cleanCode);

    if (!coupon) {
      return { success: false, message: 'Invalid promotional code.' };
    }

    if (subtotalPkr < coupon.min_order_pkr) {
      return {
        success: false,
        message: `Coupon requires minimum order of ₨ ${coupon.min_order_pkr.toLocaleString()}.`
      };
    }

    setAppliedCoupon(coupon);
    localStorage.setItem('phoneverse_coupon', JSON.stringify(coupon));
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('phoneverse_coupon');
  };

  // Calculations
  const subtotalPkr = items.reduce((sum, item) => sum + item.variant.price_pkr * item.quantity, 0);

  let discountPkr = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountPkr = (subtotalPkr * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount_pkr) {
        discountPkr = Math.min(discountPkr, appliedCoupon.max_discount_pkr);
      }
    } else {
      discountPkr = appliedCoupon.discount_value;
    }
  }

  // Free shipping in Pakistan over ₨ 50,000
  const shippingFeePkr = subtotalPkr > 50000 || items.length === 0 ? 0 : 500;
  const totalPkr = Math.max(0, subtotalPkr - discountPkr + shippingFeePkr);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotalPkr,
        discountPkr,
        shippingFeePkr,
        totalPkr,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
