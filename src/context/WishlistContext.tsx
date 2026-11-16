'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Smartphone } from '@/types';

interface WishlistContextType {
  wishlist: Smartphone[];
  toggleWishlist: (phone: Smartphone) => void;
  isInWishlist: (phoneId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Smartphone[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phoneverse_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch (e) {
      console.warn('Error reading wishlist storage', e);
    }
  }, []);

  const saveWishlist = (items: Smartphone[]) => {
    setWishlist(items);
    localStorage.setItem('phoneverse_wishlist', JSON.stringify(items));
  };

  const toggleWishlist = (phone: Smartphone) => {
    const exists = wishlist.some(p => p.id === phone.id);
    if (exists) {
      saveWishlist(wishlist.filter(p => p.id !== phone.id));
    } else {
      saveWishlist([...wishlist, phone]);
    }
  };

  const isInWishlist = (phoneId: string) => {
    return wishlist.some(p => p.id === phoneId);
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
