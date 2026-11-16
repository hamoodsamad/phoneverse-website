'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotalPkr,
    discountPkr,
    shippingFeePkr,
    totalPkr,
    itemCount
  } = useCart();

  const { format } = useCurrency();
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, success: res.success });
    if (res.success) setCouponCode('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Shopping Cart</h1>
          <p className="text-xs text-gray-400 mt-1">{itemCount} smartphone(s) in your cart</p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-rose-400 transition-colors"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items list */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="glass-panel p-5 rounded-3xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-24 bg-gray-800/60 rounded-2xl p-2 shrink-0">
                    <Image
                      src={item.smartphone.primary_image_url}
                      alt={item.smartphone.name}
                      fill
                      sizes="100px"
                      className="object-contain"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">{item.smartphone.brand_name}</span>
                    <Link href={`/smartphones/${item.smartphone.slug}`} className="font-bold text-white hover:text-emerald-400 text-base block">
                      {item.smartphone.name}
                    </Link>
                    <div className="text-xs text-gray-400 mt-1">
                      {item.variant.ram_gb}GB RAM + {item.variant.storage_gb}GB | {item.variant.color_name}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> {item.variant.pta_status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-700 bg-gray-900 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-800 text-gray-300 transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-800 text-gray-300 transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price per item / total */}
                  <div className="text-right">
                    <div className="font-black text-white text-base">
                      {format(item.variant.price_pkr * item.quantity)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-gray-500">
                        {format(item.variant.price_pkr)} each
                      </div>
                    )}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-500 hover:text-rose-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link
              href="/smartphones"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            {/* Promo Code Box */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-3">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-400" />
                Discount Promo Code
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs">
                  <div>
                    <span className="font-bold text-emerald-400">{appliedCoupon.code}</span>
                    <span className="text-gray-400 block text-[11px]">
                      {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% OFF` : `₨ ${appliedCoupon.discount_value} OFF`}
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-rose-400 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME2026"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <div className={`text-[11px] font-semibold ${couponMsg.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponMsg.text}
                </div>
              )}
            </div>

            {/* Summary Box */}
            <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
              <h3 className="text-base font-bold text-white">Order Summary</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">{format(subtotalPkr)}</span>
                </div>

                {discountPkr > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{format(discountPkr)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Delivery (Pakistan)</span>
                  <span className="text-white font-semibold">
                    {shippingFeePkr === 0 ? <strong className="text-emerald-400">FREE</strong> : format(shippingFeePkr)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Amount</span>
                <span className="text-2xl font-black text-emerald-400">{format(totalPkr)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold py-3.5 rounded-2xl text-xs transition-colors shadow-glow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl border border-gray-800 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-800/80 text-gray-400 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Your Cart is Empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You have not added any smartphones to your cart yet. Explore our verified smartphone catalog to get started.
          </p>
          <Link
            href="/smartphones"
            className="inline-flex items-center gap-2 bg-emerald-500 text-dark-900 font-bold px-6 py-2.5 rounded-xl text-xs"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
