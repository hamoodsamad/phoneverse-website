'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Zap, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="glass-panel border-t border-gray-800/80 bg-dark-900/95 mt-20 text-gray-400">
      {/* Newsletter / Price Alert Banner */}
      <div className="border-b border-gray-800/80 py-10 bg-gradient-to-r from-emerald-950/30 via-dark-900 to-cyan-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1 uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              Never Miss a Price Drop in Pakistan
            </div>
            <h3 className="text-2xl font-black text-white">
              Instant Price Drop & New Launch Alerts (PKR)
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Receive verified official PTA updates, merchant flash discounts, and 2026 flagship announcements.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex items-center w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 w-full"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold px-5 py-2.5 rounded-xl text-sm shrink-0 transition-colors shadow-glow"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand & Market Note */}
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-dark-900 font-black">
              <Phone className="w-5 h-5 text-dark-900 fill-current" />
            </div>
            <span className="text-xl font-black text-white">
              PHONE<span className="text-emerald-400">VERSE</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Pakistan’s premier AI-powered smartphone intelligence, technical comparison, price tracker, and e-commerce platform. Designed for tech enthusiasts and buyers seeking verified specifications and authentic Pakistani retail market rates.
          </p>
          <div className="flex flex-col gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified PTA Approved Status & Mercantile Official Warranties</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Next-Generation AI Comparative Silicon & Optics Analytics</span>
            </div>
          </div>
        </div>

        {/* Discovery & Tools */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Discovery</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/smartphones" className="hover:text-emerald-400 transition-colors">All Smartphones</Link></li>
            <li><Link href="/smartphones/latest" className="hover:text-emerald-400 transition-colors">Latest Smartphones</Link></li>
            <li><Link href="/smartphones/upcoming" className="hover:text-emerald-400 transition-colors">Upcoming & Rumors</Link></li>
            <li><Link href="/smartphones/popular" className="hover:text-emerald-400 transition-colors">Popular Flagships</Link></li>
            <li><Link href="/brands" className="hover:text-emerald-400 transition-colors">All Brands</Link></li>
          </ul>
        </div>

        {/* AI & Analytics */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Intelligence</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/compare" className="hover:text-cyan-400 transition-colors">Side-by-Side Compare</Link></li>
            <li><Link href="/price-tracker" className="hover:text-emerald-400 transition-colors">Live Price Tracker</Link></li>
            <li><Link href="/ai-recommendations" className="hover:text-purple-400 transition-colors">AI Smartphone Advisor</Link></li>
            <li><Link href="/news" className="hover:text-emerald-400 transition-colors">Technology News</Link></li>
            <li><Link href="/reviews" className="hover:text-emerald-400 transition-colors">Customer Reviews</Link></li>
          </ul>
        </div>

        {/* E-Commerce & Legal */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/cart" className="hover:text-emerald-400 transition-colors">Shopping Cart</Link></li>
            <li><Link href="/wishlist" className="hover:text-emerald-400 transition-colors">Wishlist</Link></li>
            <li><Link href="/orders" className="hover:text-emerald-400 transition-colors">Order Tracking</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/80 py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © 2026 PhoneVerse Platform. All rights reserved. Primary Market: Pakistan (PKR).
          </div>
          <div className="flex items-center gap-6">
            <span>Primary Currency: <strong>PKR (₨)</strong></span>
            <span>Data Sources: GSMArena, PriceOye, Daraz Official, Official Brand Stores</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
