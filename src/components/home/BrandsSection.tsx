import React from 'react';
import Link from 'next/link';
import { Brand } from '@/types';
import { ArrowRight, Layers } from 'lucide-react';

export function BrandsSection({ brands }: { brands: Brand[] }) {
  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800/60">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            Official Brand Directories
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Popular Smartphone Brands
          </h2>
        </div>

        <Link
          href="/brands"
          className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>All Brands</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map(brand => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col items-center text-center group border border-gray-800"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-800/80 flex items-center justify-center font-black text-lg text-white mb-2 group-hover:scale-110 group-hover:text-emerald-400 transition-all">
              {brand.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="font-bold text-sm text-gray-200 group-hover:text-emerald-400 transition-colors">
              {brand.name}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {brand.phone_count || 10}+ Models
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
