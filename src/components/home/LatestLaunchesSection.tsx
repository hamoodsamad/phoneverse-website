import React from 'react';
import Link from 'next/link';
import { Smartphone } from '@/types';
import { PhoneCard } from '@/components/common/PhoneCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export function LatestLaunchesSection({ phones }: { phones: Smartphone[] }) {
  const latest = phones.filter(p => p.status === 'available').slice(0, 4);

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800/60">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Newly Announced & Released
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Latest Smartphone Launches
          </h2>
        </div>

        <Link
          href="/smartphones/latest"
          className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <span>View All Launches</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {latest.map(phone => (
          <PhoneCard key={phone.id} phone={phone} />
        ))}
      </div>
    </section>
  );
}
