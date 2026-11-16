'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCompare } from '@/context/CompareContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export function CompareFloatingBar() {
  const { selectedPhones, removeFromCompare, clearCompare } = useCompare();

  if (selectedPhones.length === 0) return null;

  return (
    <aside aria-label="Smartphone Comparison Dock" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl glass-panel bg-dark-900/90 border border-cyan-500/30 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-fade-in-up">
      <div className="flex items-center justify-between gap-3">
        {/* Left header */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Compare Dock</div>
            <div className="text-[11px] text-gray-400">{selectedPhones.length} of 4 selected</div>
          </div>
        </div>

        {/* Center thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {selectedPhones.map(phone => (
            <div key={phone.id} className="relative group shrink-0 w-12 h-12 rounded-lg bg-gray-800/80 border border-gray-700 p-1 flex items-center justify-center">
              <Image
                src={phone.primary_image_url}
                alt={phone.name}
                width={36}
                height={36}
                className="object-contain max-h-full"
              />
              <button
                onClick={() => removeFromCompare(phone.id)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] hover:bg-rose-500"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-gray-400 hover:text-white px-2 py-1.5 transition-colors"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-glow-cyan"
          >
            <span>Compare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
