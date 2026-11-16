'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/context/CurrencyContext';
import { Smartphone } from '@/types';
import { siteConfig } from '@/config/site';
import { Sparkles, ArrowRight, Scale, ShieldCheck, Zap, Cpu, Camera, Battery, ArrowLeft } from 'lucide-react';

interface HeroSectionProps {
  flagships: Smartphone[];
}

export function HeroSection({ flagships }: HeroSectionProps) {
  const { format } = useCurrency();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activePhone = flagships[selectedIndex] || flagships[0];

  if (!activePhone) return null;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-gradient-to-b from-dark-900 via-dark-800/60 to-dark-900 border-b border-gray-800/80">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Value Props & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pills row */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={siteConfig.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-emerald-400/60 hover:border-emerald-300 text-white text-xs font-black transition-all shadow-glow hover:scale-105"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>← Back to Portfolio</span>
              </a>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen 2026 Smartphone Intelligence • Pakistan Market</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Discover, Compare & Track <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
                Flagship Smartphones
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
              Real-time Pakistani retail prices in PKR, verified PTA Approved status, deep silicon comparisons, and instant AI-tailored recommendations.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/smartphones"
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-glow"
              >
                <span>Browse All Phones</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/ai-recommendations"
                className="flex items-center gap-2 glass-panel hover:border-purple-500/50 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Recommendation Wizard</span>
              </Link>

              <Link
                href="/compare"
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold px-4 py-3.5 text-sm"
              >
                <Scale className="w-4 h-4" />
                <span>Side-by-Side Compare</span>
              </Link>
            </div>

            {/* Market Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800/80 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>100% Verified PTA & Official Warranties</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Daily Pakistani Retailer Price Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                <span>Unbiased Silicon Architecture Evals</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Product Interactive Showcase */}
          <div className="lg:col-span-5">
            <div className="relative glass-panel rounded-3xl p-6 border border-gray-700/60 shadow-2xl overflow-hidden bg-gradient-to-b from-gray-900/90 to-dark-900">
              {/* Device Selector Tabs */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {flagships.map((phone, idx) => (
                  <button
                    key={phone.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedIndex === idx
                        ? 'bg-emerald-500 text-dark-900 shadow-glow'
                        : 'bg-gray-800/80 text-gray-400 hover:text-white'
                    }`}
                  >
                    {phone.name.split(' ')[0]} {phone.name.split(' ')[1]}
                  </button>
                ))}
              </div>

              {/* Showcase Image with Floating Badges */}
              <div className="relative w-full h-72 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-gray-800/40 to-transparent">
                <Image
                  src={activePhone.primary_image_url}
                  alt={activePhone.name}
                  fill
                  sizes="500px"
                  className="object-contain p-4 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                  priority
                />

                <div className="absolute bottom-3 left-3 bg-dark-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-gray-700 text-xs font-bold text-white">
                  {activePhone.pta_status}
                </div>
              </div>

              {/* Showcase Specs Details */}
              <div className="mt-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-emerald-400">{activePhone.brand_name}</span>
                    <h3 className="text-xl font-black text-white">{activePhone.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Best Retail PKR</span>
                    <div className="text-xl font-extrabold text-emerald-400">
                      {format(activePhone.base_price_pkr)}
                    </div>
                  </div>
                </div>

                {activePhone.specs && (
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800 text-xs">
                    <div className="bg-gray-800/50 p-2 rounded-xl">
                      <div className="flex items-center gap-1 text-cyan-400 mb-1">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[10px]">Chipset</span>
                      </div>
                      <div className="text-white font-medium truncate text-[11px]">
                        {activePhone.specs.chipset.split('(')[0]}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 p-2 rounded-xl">
                      <div className="flex items-center gap-1 text-purple-400 mb-1">
                        <Camera className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[10px]">Optics</span>
                      </div>
                      <div className="text-white font-medium truncate text-[11px]">
                        {activePhone.specs.rear_camera_setup.split('+')[0]}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 p-2 rounded-xl">
                      <div className="flex items-center gap-1 text-emerald-400 mb-1">
                        <Battery className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[10px]">Power</span>
                      </div>
                      <div className="text-white font-medium text-[11px]">
                        {activePhone.specs.battery_capacity_mah} mAh
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href={`/smartphones/${activePhone.slug}`}
                    className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    View Full Technical Specs
                  </Link>
                  <Link
                    href={`/price-history/${activePhone.slug}`}
                    className="text-center px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Price History
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
