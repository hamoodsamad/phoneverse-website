'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { calculateDiscount } from '@/lib/currency';
import { TrendingDown, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

export function PriceDropsSection({ phones }: { phones: Smartphone[] }) {
  const { format } = useCurrency();

  const priceDrops = phones.filter(p => p.original_price_pkr && p.original_price_pkr > p.base_price_pkr).slice(0, 3);

  if (priceDrops.length === 0) return null;

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800/60">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingDown className="w-4 h-4" />
            Verified Pakistan Retail Discounts
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Latest Price Drops in Pakistan (PKR)
          </h2>
        </div>

        <Link
          href="/price-tracker"
          className="text-xs sm:text-sm font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
        >
          <span>View All Price Drops</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {priceDrops.map(phone => {
          const discountPct = calculateDiscount(phone.base_price_pkr, phone.original_price_pkr);
          const dropAmount = (phone.original_price_pkr || phone.base_price_pkr) - phone.base_price_pkr;
          const topSeller = phone.prices?.[0];

          return (
            <div
              key={phone.id}
              className="glass-panel p-5 rounded-2xl border border-rose-500/20 hover:border-rose-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black px-2.5 py-1 rounded-full">
                    Save {discountPct}% ({format(dropAmount)})
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {phone.pta_status}
                  </span>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <div className="relative w-20 h-24 shrink-0 bg-gray-800/40 rounded-xl p-2">
                    <Image
                      src={phone.primary_image_url}
                      alt={phone.name}
                      fill
                      sizes="100px"
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-emerald-400">{phone.brand_name}</span>
                    <Link href={`/smartphones/${phone.slug}`} className="block font-bold text-white hover:text-rose-400 transition-colors">
                      {phone.name}
                    </Link>
                    {topSeller && (
                      <div className="text-xs text-gray-400 mt-1">
                        Seller: <strong className="text-gray-300">{topSeller.seller_name}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-between mt-3">
                <div>
                  <div className="text-xs text-gray-400">Current Deal</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-rose-400">
                      {format(phone.base_price_pkr)}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      {format(phone.original_price_pkr!)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/smartphones/${phone.slug}`}
                  className="bg-rose-500 hover:bg-rose-400 text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors flex items-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Grab Deal</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
