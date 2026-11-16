import { CurrencyCode } from '@/types';

// Exchange rates relative to 1 PKR (2026 indicative rates)
export const EXCHANGE_RATES: Record<CurrencyCode, { symbol: string; rate: number; name: string }> = {
  PKR: { symbol: '₨', rate: 1, name: 'Pakistani Rupee' },
  USD: { symbol: '$', rate: 0.0036, name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.0033, name: 'Euro' },
  AED: { symbol: 'AED', rate: 0.0132, name: 'UAE Dirham' },
  GBP: { symbol: '£', rate: 0.0028, name: 'British Pound' },
  SAR: { symbol: 'SAR', rate: 0.0135, name: 'Saudi Riyal' },
};

/**
 * Formats a price (base PKR) into the requested currency string.
 * Example: formatPrice(494999, 'PKR') -> "₨ 494,999"
 * Example: formatPrice(494999, 'USD') -> "$1,781.99"
 */
export function formatPrice(pricePkr: number, currency: CurrencyCode = 'PKR'): string {
  if (pricePkr == null || isNaN(pricePkr)) return 'N/A';
  
  const curr = EXCHANGE_RATES[currency] || EXCHANGE_RATES.PKR;
  const converted = pricePkr * curr.rate;

  if (currency === 'PKR') {
    return `${curr.symbol} ${Math.round(converted).toLocaleString('en-PK')}`;
  }

  return `${curr.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculates percentage price discount/drop
 */
export function calculateDiscount(currentPkr: number, originalPkr?: number): number {
  if (!originalPkr || originalPkr <= currentPkr) return 0;
  return Math.round(((originalPkr - currentPkr) / originalPkr) * 100);
}
