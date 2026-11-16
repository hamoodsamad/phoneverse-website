'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, ShieldCheck, LogOut, Package, Heart, Sparkles, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function AccountPage() {
  const { user, customerLogin, customerRegister, logout, isAuthenticated, isAdmin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isRegisterMode) {
      const res = customerRegister(fullName, email, password);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg('Account created successfully!');
      }
    } else {
      const res = customerLogin(email, password);
      if (!res.success) {
        setErrorMsg(res.message);
      }
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
                {user.full_name?.slice(0, 1).toUpperCase() || 'U'}
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
                  <span>Admin Panel</span>
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
        /* Sign In / Register Card - Clean Customer Form */
        <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">
              {isRegisterMode ? 'Create Customer Account' : 'Customer Sign In'}
            </h1>
            <p className="text-xs text-gray-400">
              {isRegisterMode
                ? 'Join PhoneVerse Pakistan for price drop alerts, orders, and warranty tracking.'
                : 'Sign in to access your orders, wishlist, and customized recommendations.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Usman Ali"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold rounded-xl text-xs transition-colors shadow-glow mt-2"
            >
              {isRegisterMode ? 'Register Account' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-800 text-center">
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              {isRegisterMode
                ? 'Already have an account? Sign In here'
                : "Don't have an account yet? Register here"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
