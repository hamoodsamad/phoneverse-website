'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { calculateDiscount } from '@/lib/currency';
import { Heart, Scale, ShoppingBag, Cpu, Camera, Battery, CheckCircle, AlertTriangle } from 'lucide-react';

interface PhoneCardProps {
  phone: Smartphone;
}

export function PhoneCard({ phone }: PhoneCardProps) {
  const { format } = useCurrency();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const isFavorited = isInWishlist(phone.id);
  const isCompared = isInCompare(phone.id);
  const discountPct = calculateDiscount(phone.base_price_pkr, phone.original_price_pkr);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (phone.variants && phone.variants.length > 0) {
      addToCart(phone, phone.variants[0], 1);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(phone);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCompare(phone);
  };

  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover p-4 flex flex-col justify-between overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          {phone.is_unconfirmed ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded-full backdrop-blur-md border border-purple-500/30">
              <AlertTriangle className="w-3 h-3" /> Rumored
            </span>
          ) : phone.pta_status === 'PTA Approved' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded-full backdrop-blur-md border border-emerald-500/30">
              <CheckCircle className="w-3 h-3" /> PTA Approved
            </span>
          ) : (
            <span className="text-[11px] font-semibold bg-amber-950/80 text-amber-400 px-2 py-0.5 rounded-full backdrop-blur-md border border-amber-500/30">
              {phone.pta_status}
            </span>
          )}

          {discountPct > 0 && (
            <span className="text-[11px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-sm w-fit">
              -{discountPct}% OFF
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={handleToggleCompare}
            title={isCompared ? 'In Comparison' : 'Add to Compare'}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
              isCompared
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-900/80 text-gray-400 hover:text-cyan-400 hover:bg-gray-800'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={handleToggleWishlist}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
              isFavorited
                ? 'bg-rose-500 text-white'
                : 'bg-gray-900/80 text-gray-400 hover:text-rose-400 hover:bg-gray-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image Link */}
      <Link href={`/smartphones/${phone.slug}`} className="block relative w-full h-52 mt-6 mb-3 rounded-xl overflow-hidden bg-gradient-to-b from-gray-800/40 to-transparent">
        <Image
          src={phone.primary_image_url}
          alt={phone.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          priority={phone.is_featured}
        />
      </Link>

      {/* Info Section */}
      <div>
        <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
          {phone.brand_name}
        </div>
        <Link href={`/smartphones/${phone.slug}`} className="block">
          <h3 className="font-bold text-gray-100 text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
            {phone.name}
          </h3>
        </Link>

        {/* Spec Highlights */}
        {phone.specs && (
          <div className="grid grid-cols-2 gap-1.5 my-3 text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5 truncate">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{phone.specs.chipset.split('(')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Camera className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{phone.specs.rear_camera_setup.split('+')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Battery className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{phone.specs.battery_capacity_mah} mAh</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300 font-medium truncate">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>{phone.specs.refresh_rate_hz}Hz Display</span>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Best Price (PKR)</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-white">
                {format(phone.base_price_pkr)}
              </span>
              {phone.original_price_pkr && phone.original_price_pkr > phone.base_price_pkr && (
                <span className="text-xs text-gray-500 line-through">
                  {format(phone.original_price_pkr)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold px-3 py-2 rounded-xl text-xs transition-colors shadow-glow"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
