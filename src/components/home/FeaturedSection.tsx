import React from 'react';
import Link from 'next/link';
import { Smartphone } from '@/types';
import { PhoneCard } from '@/components/common/PhoneCard';
import { Flame, ArrowRight } from 'lucide-react';

export function FeaturedSection({ phones }: { phones: Smartphone[] }) {
  const featured = phones.filter(p => p.is_featured).slice(0, 4);

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 fill-current" />
            Top Trending in Pakistan
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Featured 2026 Flagships
          </h2>
        </div>

        <Link
          href="/smartphones/popular"
          className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>View All Trending</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map(phone => (
          <PhoneCard key={phone.id} phone={phone} />
        ))}
      </div>
    </section>
  );
}
