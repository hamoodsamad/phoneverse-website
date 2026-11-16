'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockSmartphones } from '@/data/mockData';
import { useCurrency } from '@/context/CurrencyContext';
import { calculateDiscount } from '@/lib/currency';
import {
  TrendingDown,
  Clock,
  ShieldCheck,
  Search,
  Bell,
  ArrowRight,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

export default function PriceTrackerPage() {
  const { format } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const discountedPhones = mockSmartphones
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dropA = a.original_price_pkr ? a.original_price_pkr - a.base_price_pkr : 0;
      const dropB = b.original_price_pkr ? b.original_price_pkr - b.base_price_pkr : 0;
      return dropB - dropA;
    });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribedEmail) return;
    setAlertSuccess(true);
    setSubscribedEmail('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-950/30 via-dark-900 to-dark-800 mb-10">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <TrendingDown className="w-4 h-4" />
            Pakistan Retail Live Price Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Smartphone Price Tracker & Drop Alerts
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Monitor real-time retailer pricing across PriceOye, Daraz Mall, Telemart, and Brand Stores in Pakistan. Track historical high/low values in PKR and subscribe to instant price drop alerts.
          </p>
        </div>
      </div>

      {/* Search and Alert Subscription Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        <div className="md:col-span-7">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search phones to check price changes..."
              className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div className="md:col-span-5">
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={subscribedEmail}
              onChange={(e) => setSubscribedEmail(e.target.value)}
              placeholder="Enter email for daily price drop alerts..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold px-4 py-3 rounded-2xl text-xs flex items-center gap-1 shrink-0 transition-colors shadow-glow"
            >
              <Bell className="w-4 h-4" />
              <span>Get Alerts</span>
            </button>
          </form>
          {alertSuccess && (
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Subscribed! You will receive verified PKR price drop notifications.
            </div>
          )}
        </div>
      </div>

      {/* Main Prices Table */}
      <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <span>Tracking <strong className="text-white">{discountedPhones.length}</strong> devices in Pakistan</span>
          <span>Currency: <strong className="text-emerald-400">PKR (₨)</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-dark-900/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Smartphone</th>
                <th className="p-4">PTA Status</th>
                <th className="p-4">Best Retailer</th>
                <th className="p-4">Original (PKR)</th>
                <th className="p-4">Current (PKR)</th>
                <th className="p-4">Discount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {discountedPhones.map(phone => {
                const discount = calculateDiscount(phone.base_price_pkr, phone.original_price_pkr);
                const seller = phone.prices?.[0];

                return (
                  <tr key={phone.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-gray-800/60 rounded-xl p-1 shrink-0">
                          <Image
                            src={phone.primary_image_url}
                            alt={phone.name}
                            fill
                            sizes="60px"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-emerald-400">{phone.brand_name}</span>
                          <Link href={`/smartphones/${phone.slug}`} className="font-bold text-white hover:text-emerald-400 block text-sm">
                            {phone.name}
                          </Link>
                          <span className="text-[10px] text-gray-400">{phone.specs?.chipset}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" /> {phone.pta_status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-gray-200">{seller ? seller.seller_name : 'Authorized Retailer'}</span>
                    </td>

                    <td className="p-4 text-gray-400 line-through">
                      {phone.original_price_pkr ? format(phone.original_price_pkr) : '-'}
                    </td>

                    <td className="p-4 font-black text-white text-sm">
                      {format(phone.base_price_pkr)}
                    </td>

                    <td className="p-4">
                      {discount > 0 ? (
                        <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-black px-2 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/price-history/${phone.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs"
                      >
                        <Clock className="w-3 h-3" /> History
                      </Link>
                      <Link
                        href={`/smartphones/${phone.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold text-xs"
                      >
                        Buy
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
