'use client';

import React from 'react';
import { CurrencyProvider } from './CurrencyContext';
import { CartProvider } from './CartContext';
import { WishlistProvider } from './WishlistContext';
import { CompareProvider } from './CompareContext';
import { AuthProvider } from './AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
