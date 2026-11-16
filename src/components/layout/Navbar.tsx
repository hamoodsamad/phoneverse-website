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
import { siteConfig } from '@/config/site';
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
  SlidersHorizontal,
  ArrowLeft
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
      {/* Top micro bar for market and live status (Hidden on mobile and tablets for ultra-clean header) */}
      <div className="hidden lg:flex bg-emerald-950/40 border-b border-emerald-900/20 py-1.5 px-4 text-[11px] text-gray-300 items-center justify-between gap-2 overflow-hidden w-full max-w-full">
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={siteConfig.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 text-emerald-300 hover:text-white hover:border-emerald-400 font-extrabold transition-all shadow-sm text-[11px] whitespace-nowrap"
          >
            <ArrowLeft className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Back to Portfolio</span>
          </a>

          <div className="hidden lg:flex items-center gap-2 text-gray-400 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="truncate">🇵🇰 <strong>Pakistan Market Official:</strong> PTA Approved & Retail Verified Smartphone Index</span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <Link href="/news" className="hover:text-emerald-400 transition-colors hidden lg:inline">
            Tech News 2026
          </Link>
          <Link href="/reviews" className="hover:text-emerald-400 transition-colors">
            Verified Reviews
          </Link>
          <Link href="/price-tracker" className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold whitespace-nowrap">
            <TrendingDown className="w-3 h-3 shrink-0" />
            <span>Price Drops</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo - Only element on the left on all devices */}
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

        {/* Global Live Search Bar (Desktop only, >= 1024px) */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden lg:block">
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

        {/* Center / Navigation Links (Desktop only, >= 1024px) */}
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

        {/* Right side controls - Hidden on all screens < 1024px, only hamburger remains on mobile */}
        <div className="flex items-center gap-2.5">
          {/* Currency Switcher (Hidden on mobile/tablet -> in menu) */}
          <div ref={currencyRef} className="relative hidden lg:block">
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

          {/* Compare Badge (Hidden on mobile/tablet -> in menu) */}
          <Link
            href="/compare"
            title="Comparison Tray"
            className="hidden lg:flex relative p-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
          >
            <Scale className="w-4 h-4" />
            {compareCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-dark-900 font-bold text-[10px] flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Wishlist Badge (Hidden on mobile/tablet -> in menu) */}
          <Link
            href="/wishlist"
            title="Wishlist"
            className="hidden lg:flex relative p-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-rose-400 hover:border-rose-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart Badge (Hidden on mobile/tablet -> in menu) */}
          <Link
            href="/cart"
            title="Shopping Cart"
            className="hidden lg:flex relative p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold transition-colors shadow-glow"
          >
            <ShoppingCart className="w-4 h-4 fill-current" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Account / Sign In (Hidden on mobile/tablet -> in menu) */}
          {user ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/account"
                className="p-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-white"
                title={user.full_name}
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <Link
              href="/account"
              className="hidden lg:inline-flex text-xs font-bold text-gray-300 hover:text-white px-3 py-2 rounded-xl border border-gray-700 bg-gray-900 hover:border-gray-500 transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile & Tablet hamburger menu toggle - ONLY item on right for all screens < 1024px */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 lg:hidden hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu - Opens right below header when clicked */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-gray-800 p-4 space-y-4 bg-dark-900/98 backdrop-blur-2xl animate-fade-in shadow-2xl">
          {/* Back to Portfolio Button */}
          <a
            href={siteConfig.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 border border-emerald-500/50 text-emerald-300 hover:text-white font-black flex items-center justify-between text-xs transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Portfolio</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">Official</span>
          </a>

          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search smartphone models..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </form>

          {/* User Sign In / Account Card */}
          {user ? (
            <div className="p-3.5 bg-gray-900/90 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{user.full_name}</div>
                  <div className="text-[10px] text-gray-400">{user.email}</div>
                </div>
              </div>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-1.5 bg-emerald-500 text-dark-900 rounded-xl text-xs font-extrabold"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="p-3.5 bg-gray-900/90 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Customer Account</div>
                <div className="text-[10px] text-gray-400">Sign in to track orders & prices</div>
              </div>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-dark-900 rounded-xl text-xs font-black transition-colors shadow-glow"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Quick Badges Row (Shopping Cart, Saved Wishlist, Compare Tray) */}
          <div className="grid grid-cols-3 gap-2">
            {/* Cart */}
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col items-center justify-center relative hover:border-emerald-500/50 transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-rose-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-200 mt-1.5">Cart</span>
            </Link>

            {/* Wishlist (Heart Shape) */}
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col items-center justify-center relative hover:border-rose-500/50 transition-colors"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-rose-400" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-200 mt-1.5">Wishlist</span>
            </Link>

            {/* Compare */}
            <Link
              href="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col items-center justify-center relative hover:border-cyan-500/50 transition-colors"
            >
              <div className="relative">
                <Scale className="w-5 h-5 text-cyan-400" />
                {compareCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-cyan-500 text-dark-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-200 mt-1.5">Compare</span>
            </Link>
          </div>

          {/* Currency Switcher Row (PKR and others) */}
          <div className="p-3 bg-gray-900/90 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Currency:</span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {availableCurrencies.map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                    currency === c
                      ? 'bg-emerald-500 text-dark-900 shadow-sm'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Main 5 Navigation Links & Menu Options */}
          <div className="pt-2 border-t border-gray-800 space-y-1 text-sm font-medium text-gray-300">
            <div className="text-[10px] uppercase font-bold text-gray-500 px-2 pb-1">
              Main Navigation
            </div>
            <Link
              href="/smartphones"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-gray-800 flex items-center gap-2.5 transition-colors"
            >
              <PhoneIcon className="w-4 h-4 text-emerald-400" />
              <span>1. All Smartphones</span>
            </Link>

            <Link
              href="/brands"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-gray-800 flex items-center gap-2.5 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>2. Popular Brands</span>
            </Link>

            <Link
              href="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-gray-800 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>3. Smartphone Comparison</span>
              </div>
              {compareCount > 0 && (
                <span className="bg-cyan-500 text-dark-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link
              href="/price-tracker"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-gray-800 flex items-center gap-2.5 transition-colors"
            >
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>4. Price Drop Tracker (PKR)</span>
            </Link>

            <Link
              href="/ai-recommendations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-gray-800 flex items-center gap-2.5 text-purple-300 font-bold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>5. AI Recommendation Wizard</span>
            </Link>

            <div className="text-[10px] uppercase font-bold text-gray-500 px-2 pt-2 pb-1">
              Community & Updates
            </div>
            <Link
              href="/news"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-800 flex items-center gap-2 text-xs transition-colors"
            >
              <span>📰 Technology News 2026</span>
            </Link>
            <Link
              href="/reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-800 flex items-center gap-2 text-xs transition-colors"
            >
              <span>⭐ Customer Reviews</span>
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-800 flex items-center gap-2 text-xs transition-colors"
            >
              <span>📦 Track Orders</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
