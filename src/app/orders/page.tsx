'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { Package, Truck, CheckCircle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

function OrdersContent() {
  const { format } = useCurrency();
  const searchParams = useSearchParams();
  const placedId = searchParams.get('placed');

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('phoneverse_orders') || '[]');
      setOrders(saved);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {placedId && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-950/30 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-dark-900 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Order #{placedId} Placed Successfully!</h2>
            <p className="text-xs text-gray-300">
              We have dispatched an electronic confirmation to your email. Our delivery team will contact you for dispatch.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">My Orders & Tracking</h1>
          <p className="text-xs text-gray-400 mt-1">Real-time parcel status across TCS and courier networks in Pakistan.</p>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
                <div>
                  <span className="text-xs text-gray-400">Order Number</span>
                  <div className="text-base font-black text-white">{order.order_number}</div>
                  <span className="text-[11px] text-gray-500">{new Date(order.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Status: {order.order_status.toUpperCase()}</span>
                  </span>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Total (PKR)</span>
                    <span className="text-base font-black text-emerald-400">{format(order.total_pkr)}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-800/60 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white text-sm">{item.product_name}</span>
                      <span className="text-gray-400 block text-[11px]">{item.variant_details} • Quantity: {item.quantity}</span>
                    </div>
                    <span className="font-black text-gray-200">{format(item.total_price_pkr)}</span>
                  </div>
                ))}
              </div>

              {/* Shipping info */}
              <div className="pt-3 border-t border-gray-800 flex flex-col sm:flex-row justify-between text-xs text-gray-400 gap-2">
                <div>
                  <strong className="text-gray-300">Deliver To:</strong> {order.customer_name} ({order.customer_phone})<br />
                  <span>{order.shipping_address}, {order.shipping_city}, {order.shipping_province}</span>
                </div>

                <div className="sm:text-right">
                  <strong className="text-gray-300">Payment:</strong> {order.payment_method.toUpperCase()} ({order.payment_status})<br />
                  <strong className="text-cyan-400">Tracking #:</strong> {order.tracking_number}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl border border-gray-800 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-800/80 text-gray-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Once you checkout, your tracking details and delivery progress will appear here.
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

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto p-12 text-center text-gray-400">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
