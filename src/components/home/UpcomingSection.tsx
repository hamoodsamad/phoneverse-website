import React from 'react';
import Link from 'next/link';
import { Smartphone } from '@/types';
import { PhoneCard } from '@/components/common/PhoneCard';
import { Eye, ArrowRight, AlertTriangle } from 'lucide-react';

export function UpcomingSection({ phones }: { phones: Smartphone[] }) {
  const upcoming = phones.filter(p => p.status === 'upcoming' || p.is_unconfirmed);

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800/60">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Eye className="w-4 h-4" />
            Anticipated Next-Gen Devices
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Upcoming & Rumored Smartphones
          </h2>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
            Unconfirmed specifications are clearly identified and sourced from verified supply chain leaks.
          </p>
        </div>

        <Link
          href="/smartphones/upcoming"
          className="text-xs sm:text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          <span>All Upcoming</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {upcoming.map(phone => (
          <PhoneCard key={phone.id} phone={phone} />
        ))}
      </div>
    </section>
  );
}
