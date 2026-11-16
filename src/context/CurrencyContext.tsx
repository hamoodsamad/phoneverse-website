'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode } from '@/types';
import { EXCHANGE_RATES, formatPrice } from '@/lib/currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  format: (pricePkr: number) => string;
  availableCurrencies: CurrencyCode[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('PKR');

  useEffect(() => {
    const saved = localStorage.getItem('phoneverse_currency') as CurrencyCode;
    if (saved && EXCHANGE_RATES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('phoneverse_currency', c);
  };

  const format = (pricePkr: number) => {
    return formatPrice(pricePkr, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format,
        availableCurrencies: Object.keys(EXCHANGE_RATES) as CurrencyCode[]
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
