'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { PhoneCard } from '@/components/common/PhoneCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, clearWishlist, wishlistCount } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-current" />
            Saved Devices
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            My Wishlist ({wishlistCount})
          </h1>
        </div>

        {wishlistCount > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-gray-400 hover:text-rose-400 font-semibold"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistCount > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(phone => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl border border-gray-800 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-800/80 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Browse our smartphone catalog and tap the heart icon on any device to save it for future price drops and comparison.
          </p>
          <Link
            href="/smartphones"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Discover Smartphones</span>
          </Link>
        </div>
      )}
    </div>
  );
}
