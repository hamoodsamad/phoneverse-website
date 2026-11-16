'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, ShieldCheck, LogOut, Package, Heart, Sparkles, Key, Mail } from 'lucide-react';

export default function AccountPage() {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, email.includes('admin') ? 'admin' : 'customer');
  };

  const handleQuickDemoLogin = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      login('admin@phoneverse.com', 'admin');
    } else {
      login('customer@phoneverse.com', 'customer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {isAuthenticated && user ? (
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="glass-panel p-8 rounded-3xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-dark-900 font-black text-2xl flex items-center justify-center shadow-glow">
                {user.full_name.slice(0, 1).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">{user.full_name}</h1>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    isAdmin ? 'bg-purple-900 text-purple-300 border border-purple-600' : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-lg flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Admin Dashboard</span>
                </Link>
              )}

              <button
                onClick={logout}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* User Quick Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/orders"
              className="glass-panel glass-panel-hover p-6 rounded-3xl border border-gray-800 space-y-2 block"
            >
              <Package className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-white text-base">My Orders</h3>
              <p className="text-xs text-gray-400">Track shipments across Pakistan, view invoices and delivery statuses.</p>
            </Link>

            <Link
              href="/wishlist"
              className="glass-panel glass-panel-hover p-6 rounded-3xl border border-gray-800 space-y-2 block"
            >
              <Heart className="w-6 h-6 text-rose-400" />
              <h3 className="font-bold text-white text-base">Saved Wishlist</h3>
              <p className="text-xs text-gray-400">Review your saved smartphones and monitor future retail price drops.</p>
            </Link>

            <Link
              href="/ai-recommendations"
              className="glass-panel glass-panel-hover p-6 rounded-3xl border border-gray-800 space-y-2 block"
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className="font-bold text-white text-base">AI Recommendations</h3>
              <p className="text-xs text-gray-400">Re-run the personalized hardware advisor tailored to your budget.</p>
            </Link>
          </div>
        </div>
      ) : (
        /* Sign In / Register Card */
        <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-white">
              {isRegisterMode ? 'Create PhoneVerse Account' : 'Sign in to PhoneVerse'}
            </h1>
            <p className="text-xs text-gray-400">
              Access order tracking, price drop notifications, and personalized AI recommendations.
            </p>
          </div>

          {/* Quick Demo Login Shortcut Buttons */}
          <div className="p-3 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">
              Quick 1-Click Testing Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="bg-purple-950 hover:bg-purple-900 border border-purple-700/50 text-purple-300 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Demo Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-400 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Demo Customer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleManualAuth} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                />
                <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                />
                <Key className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold py-3 rounded-xl text-xs transition-colors shadow-glow"
            >
              {isRegisterMode ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-800 text-xs">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-cyan-400 hover:underline"
            >
              {isRegisterMode ? 'Already have an account? Sign In' : 'Need an account? Register free'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
