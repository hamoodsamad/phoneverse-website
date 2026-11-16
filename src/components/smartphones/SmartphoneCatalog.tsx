'use client';

import React, { useState, useMemo } from 'react';
import { Smartphone, Brand } from '@/types';
import { PhoneCard } from '@/components/common/PhoneCard';
import { useCurrency } from '@/context/CurrencyContext';
import { Search, SlidersHorizontal, ArrowUpDown, X, Check, Filter } from 'lucide-react';

interface SmartphoneCatalogProps {
  initialPhones: Smartphone[];
  brands: Brand[];
  initialSearch?: string;
  initialBrand?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

export function SmartphoneCatalog({
  initialPhones,
  brands,
  initialSearch = '',
  initialBrand = '',
  pageTitle = 'All Smartphones',
  pageSubtitle = 'Search, filter, and discover certified smartphones available in Pakistan and globally.'
}: SmartphoneCatalogProps) {
  const { format } = useCurrency();

  const [search, setSearch] = useState(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedPta, setSelectedPta] = useState<string>('all');
  const [maxPricePkr, setMaxPricePkr] = useState<number>(650000);
  const [selectedRefreshRate, setSelectedRefreshRate] = useState<number | 'all'>('all');
  const [needs5g, setNeeds5g] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest' | 'discount'>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtered & Sorted phones
  const filteredPhones = useMemo(() => {
    return initialPhones
      .filter(phone => {
        // Search query
        if (search) {
          const q = search.toLowerCase();
          const matchName = phone.name.toLowerCase().includes(q);
          const matchBrand = phone.brand_name.toLowerCase().includes(q);
          const matchChip = phone.specs?.chipset.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchChip) return false;
        }

        // Brand
        if (selectedBrand && phone.brand_slug !== selectedBrand && phone.brand_name.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }

        // PTA Status
        if (selectedPta !== 'all') {
          if (selectedPta === 'pta' && phone.pta_status !== 'PTA Approved') return false;
          if (selectedPta === 'non-pta' && phone.pta_status === 'PTA Approved') return false;
        }

        // Max price
        if (phone.base_price_pkr > maxPricePkr) return false;

        // Refresh rate
        if (selectedRefreshRate !== 'all' && phone.specs?.refresh_rate_hz !== selectedRefreshRate) {
          return false;
        }

        // 5G
        if (needs5g && !phone.specs?.supports_5g) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.base_price_pkr - b.base_price_pkr;
        if (sortBy === 'price_desc') return b.base_price_pkr - a.base_price_pkr;
        if (sortBy === 'newest') return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
        if (sortBy === 'discount') {
          const discA = a.original_price_pkr ? (a.original_price_pkr - a.base_price_pkr) : 0;
          const discB = b.original_price_pkr ? (b.original_price_pkr - b.base_price_pkr) : 0;
          return discB - discA;
        }
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [initialPhones, search, selectedBrand, selectedPta, maxPricePkr, selectedRefreshRate, needs5g, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedPta('all');
    setMaxPricePkr(650000);
    setSelectedRefreshRate('all');
    setNeeds5g(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{pageTitle}</h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">{pageSubtitle}</p>
        </div>

        {/* Sort selector & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-200"
          >
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-3 py-2 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-400 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
            >
              <option value="featured" className="bg-dark-900">Featured & Trending</option>
              <option value="price_asc" className="bg-dark-900">Price: Low to High</option>
              <option value="price_desc" className="bg-dark-900">Price: High to Low</option>
              <option value="newest" className="bg-dark-900">Newest Releases</option>
              <option value="discount" className="bg-dark-900">Highest Price Drops</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block md:col-span-3 space-y-6 glass-panel p-5 rounded-2xl border border-gray-800 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              Advanced Filters
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] text-gray-400 hover:text-emerald-400"
            >
              Reset All
            </button>
          </div>

          {/* Search in sidebar */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Model, chip, camera..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Brands */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Brand</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedBrand === '' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                All Brands ({initialPhones.length})
              </button>
              {brands.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedBrand === b.slug ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider">Max Price</span>
              <span className="text-emerald-400 font-extrabold">{format(maxPricePkr)}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={650000}
              step={10000}
              value={maxPricePkr}
              onChange={(e) => setMaxPricePkr(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>₨ 50K</span>
              <span>₨ 650K+</span>
            </div>
          </div>

          {/* PTA Status */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">PTA Approval Status</label>
            <div className="grid grid-cols-3 gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800 text-[11px]">
              <button
                onClick={() => setSelectedPta('all')}
                className={`py-1.5 rounded-lg font-semibold ${selectedPta === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedPta('pta')}
                className={`py-1.5 rounded-lg font-semibold ${selectedPta === 'pta' ? 'bg-emerald-950 text-emerald-400' : 'text-gray-400'}`}
              >
                PTA Only
              </button>
              <button
                onClick={() => setSelectedPta('non-pta')}
                className={`py-1.5 rounded-lg font-semibold ${selectedPta === 'non-pta' ? 'bg-amber-950 text-amber-400' : 'text-gray-400'}`}
              >
                Non-PTA
              </button>
            </div>
          </div>

          {/* Refresh rate */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Display Refresh Rate</label>
            <div className="flex gap-2">
              {[
                { label: 'Any', val: 'all' },
                { label: '120Hz', val: 120 },
                { label: '144Hz', val: 144 }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedRefreshRate(opt.val as any)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border ${
                    selectedRefreshRate === opt.val
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5G Switch */}
          <div className="pt-2 border-t border-gray-800">
            <label className="flex items-center justify-between cursor-pointer text-xs">
              <span className="text-gray-300 font-semibold">5G Network Ready</span>
              <input
                type="checkbox"
                checked={needs5g}
                onChange={(e) => setNeeds5g(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
            </label>
          </div>
        </aside>

        {/* Main Products Grid */}
        <div className="md:col-span-9">
          {/* Active filter pills */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-gray-400">
              Showing <strong className="text-white">{filteredPhones.length}</strong> smartphones
            </div>
          </div>

          {filteredPhones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhones.map(phone => (
                <PhoneCard key={phone.id} phone={phone} />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center border border-gray-800 my-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-800/80 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No smartphones matched your criteria</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                Try widening your price range, clearing brand filters, or searching for broader terms.
              </p>
              <button
                onClick={resetFilters}
                className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs h-full bg-dark-900 p-6 overflow-y-auto space-y-6 border-l border-gray-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h3 className="font-bold text-white text-base">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick reset */}
            <button
              onClick={() => { resetFilters(); setShowMobileFilters(false); }}
              className="w-full py-2 bg-gray-800 rounded-xl text-xs text-gray-300 font-semibold"
            >
              Reset Filters
            </button>

            {/* Mobile Brand selection */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b.id} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Max price slider */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400">Max Budget</span>
                <span className="text-emerald-400 font-bold">{format(maxPricePkr)}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={650000}
                step={10000}
                value={maxPricePkr}
                onChange={(e) => setMaxPricePkr(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-emerald-500 text-dark-900 font-bold py-3 rounded-xl text-xs"
            >
              Apply ({filteredPhones.length} Phones)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
