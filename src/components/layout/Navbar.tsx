'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { mockSmartphones } from '@/data/mockData';
import { Smartphone, CurrencyCode } from '@/types';
import {
  Smartphone as PhoneIcon,
  Search,
  ShoppingCart,
  Heart,
  Scale,
  Sparkles,
  TrendingDown,
  Menu,
  X,
  User,
  ShieldCheck,
  Globe,
  SlidersHorizontal
} from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { currency, setCurrency, availableCurrencies, format } = useCurrency();
  const { user, isAdmin, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Smartphone[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Search autocomplete
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const matches = mockSmartphones.filter(
        p => p.name.toLowerCase().includes(q) || p.brand_name.toLowerCase().includes(q) || p.specs?.chipset.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchResults(matches);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/smartphones?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80 bg-dark-900/85 backdrop-blur-xl">
      {/* Top micro bar for market and live status */}
      <div className="bg-emerald-950/40 border-b border-emerald-900/20 py-1 px-4 text-[11px] text-gray-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>🇵🇰 <strong>Pakistan Market Official:</strong> PTA Approved & Retail Verified Smartphone Index</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/news" className="hover:text-emerald-400 transition-colors hidden sm:inline">
            Tech News 2026
          </Link>
          <Link href="/reviews" className="hover:text-emerald-400 transition-colors hidden sm:inline">
            Verified Reviews
          </Link>
          <Link href="/price-tracker" className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
            <TrendingDown className="w-3 h-3" /> Live Price Drops
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-dark-900 shadow-glow font-black text-xl">
            <PhoneIcon className="w-5 h-5 text-dark-900 fill-current" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              PHONE<span className="text-emerald-400">VERSE</span>
            </span>
            <span className="hidden sm:inline-block ml-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800">
              2026
            </span>
          </div>
        </Link>

        {/* Global Live Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phones, Snapdragon 8 Elite, 200MP camera..."
              className="w-full bg-gray-900/90 border border-gray-700/80 rounded-xl pl-10 pr-10 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass-panel bg-dark-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                Matched Smartphones
              </div>
              {searchResults.map(phone => (
                <Link
                  key={phone.id}
                  href={`/smartphones/${phone.slug}`}
                  onClick={() => setShowSearchDropdown(false)}
                  className="flex items-center justify-between p-3 hover:bg-gray-800/60 border-b border-gray-800/40 last:border-0 transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">{phone.name}</div>
                    <div className="text-xs text-gray-400">{phone.brand_name} • {phone.specs?.chipset}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">{format(phone.base_price_pkr)}</div>
                    <span className="text-[10px] text-gray-500">{phone.pta_status}</span>
                  </div>
                </Link>
              ))}
              <Link
                href={`/smartphones?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => setShowSearchDropdown(false)}
                className="block text-center text-xs font-semibold text-cyan-400 py-2.5 bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                View all results for &quot;{searchQuery}&quot; →
              </Link>
            </div>
          )}
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-300">
          <Link href="/smartphones" className="hover:text-emerald-400 transition-colors">
            All Phones
          </Link>
          <Link href="/brands" className="hover:text-emerald-400 transition-colors">
            Brands
          </Link>
          <Link href="/compare" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            Compare
          </Link>
          <Link href="/price-tracker" className="hover:text-emerald-400 transition-colors">
            Price Tracker
          </Link>
          <Link href="/ai-recommendations" className="hover:text-purple-400 transition-colors flex items-center gap-1 font-semibold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            AI Advisor
          </Link>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* Currency Switcher */}
          <div ref={currencyRef} className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-900 border border-gray-700 text-xs font-bold text-gray-200 hover:border-emerald-500 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currency}</span>
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-36 glass-panel bg-dark-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-2 text-[10px] uppercase font-bold text-gray-400 border-b border-gray-800">
                  Select Currency
                </div>
                {availableCurrencies.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-gray-800 transition-colors ${
                      currency === c ? 'text-emerald-400 bg-emerald-950/40' : 'text-gray-300'
                    }`}
                  >
                    <span>{c}</span>
                    {c === 'PKR' && <span className="text-[10px] text-emerald-400">Default</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Compare Badge */}
          <Link
            href="/compare"
            title="Comparison Tray"
            className="relative p-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
          >
            <Scale className="w-4 h-4" />
            {compareCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-dark-900 font-bold text-[10px] flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Wishlist Badge */}
          <Link
            href="/wishlist"
            title="Wishlist"
            className="relative p-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-rose-400 hover:border-rose-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart Badge */}
          <Link
            href="/cart"
            title="Shopping Cart"
            className="relative p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold transition-colors shadow-glow"
          >
            <ShoppingCart className="w-4 h-4 fill-current" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Account or Admin Link */}
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:flex items-center gap-1 bg-purple-600/30 border border-purple-500/50 text-purple-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-purple-600/50 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/account"
                className="p-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-white"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <Link
              href="/account"
              className="text-xs font-bold text-gray-300 hover:text-white px-3 py-2 rounded-xl border border-gray-700 bg-gray-900 hover:border-gray-500 transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 lg:hidden hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-gray-800 p-4 space-y-3 bg-dark-900">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phones..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </form>

          <div className="flex flex-col gap-2 font-medium text-gray-300 text-sm">
            <Link href="/smartphones" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-800">
              📱 All Smartphones
            </Link>
            <Link href="/brands" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-800">
              🏷️ Popular Brands
            </Link>
            <Link href="/compare" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-800 flex items-center justify-between">
              <span>⚖️ Smartphone Comparison</span>
              {compareCount > 0 && <span className="bg-cyan-500 text-dark-900 text-xs font-bold px-2 py-0.5 rounded-full">{compareCount}</span>}
            </Link>
            <Link href="/price-tracker" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-800">
              📉 Price Drop Tracker (PKR)
            </Link>
            <Link href="/ai-recommendations" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-800 text-purple-300 font-bold">
              ✨ AI Recommendation Engine
            </Link>
            <Link href="/news" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-800">
              📰 Technology News
            </Link>
            <Link href="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-800">
              ⭐ User Reviews
            </Link>
            <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-800">
              📦 Track Orders
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800 font-bold">
                🛡️ Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
