'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Smartphone as PhoneIcon,
  Building
} from 'lucide-react';

const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
];

const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Sukkur'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPkr, subtotalPkr, discountPkr, shippingFeePkr, clearCart } = useCart();
  const { format } = useCurrency();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'bank_transfer'>('cod');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);

    const orderNumber = `PK-${Date.now().toString().slice(-6)}`;

    // Create order record in localStorage for instant tracking
    const orderRecord = {
      id: `ord_${Date.now()}`,
      order_number: orderNumber,
      customer_name: formData.fullName,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_province: formData.province,
      postal_code: formData.postalCode,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
      order_status: 'confirmed',
      subtotal_pkr: subtotalPkr,
      discount_pkr: discountPkr,
      shipping_fee_pkr: shippingFeePkr,
      total_pkr: totalPkr,
      tracking_number: `TCS-${Date.now().toString().slice(-8)}`,
      items: items.map(i => ({
        smartphone_id: i.smartphone.id,
        variant_id: i.variant.id,
        product_name: i.smartphone.name,
        variant_details: `${i.variant.ram_gb}GB+${i.variant.storage_gb}GB, ${i.variant.color_name} (${i.variant.pta_status})`,
        quantity: i.quantity,
        unit_price_pkr: i.variant.price_pkr,
        total_price_pkr: i.variant.price_pkr * i.quantity
      })),
      created_at: new Date().toISOString()
    };

    // Save to user's orders list in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('phoneverse_orders') || '[]');
      localStorage.setItem('phoneverse_orders', JSON.stringify([orderRecord, ...existing]));
    } catch (e) {
      console.warn(e);
    }

    clearCart();
    setSubmitting(false);
    router.push(`/orders?placed=${orderNumber}`);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
        <p className="text-xs text-gray-400">Add a smartphone to proceed with checkout.</p>
        <Link href="/smartphones" className="inline-block bg-emerald-500 text-dark-900 font-bold px-6 py-2.5 rounded-xl text-xs">
          Browse Smartphones
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Secure Checkout</h1>
        <p className="text-xs text-gray-400 mt-1">Official nationwide express delivery across Pakistan.</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              1. Pakistani Shipping Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Muhammad Zeeshan"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Mobile Number (Active WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0300-1234567"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Email Address (For Invoices & Tracking) *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="zeeshan@example.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Street Address, House/Office #, Sector/Area *</label>
              <textarea
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House 12-B, Street 4, Sector F-8/2, Islamabad"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">City *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2 text-xs text-white"
                >
                  {PAKISTAN_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Province / Region *</label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2 text-xs text-white"
                >
                  {PAKISTAN_PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Postal Code (Optional)</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="e.g. 44000"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              2. Select Payment Method
            </h2>

            <div className="space-y-2">
              {/* Cash on delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-950/20 text-white'
                    : 'border-gray-800 bg-gray-900 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-bold text-xs">Cash on Delivery (COD) - Nationwide Pakistan</div>
                    <div className="text-[11px] text-gray-400">Pay cash directly to courier at your doorstep upon receiving the parcel.</div>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'cod'} readOnly className="accent-emerald-500" />
              </label>

              {/* Mobile Wallets: JazzCash / EasyPaisa */}
              <label
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'jazzcash'
                    ? 'border-cyan-500 bg-cyan-950/20 text-white'
                    : 'border-gray-800 bg-gray-900 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="font-bold text-xs">JazzCash / EasyPaisa / Mobile Wallets</div>
                    <div className="text-[11px] text-gray-400">Direct mobile wallet checkout or QR transfer.</div>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'jazzcash'} readOnly className="accent-cyan-500" />
              </label>

              {/* Direct Bank Transfer */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-purple-500 bg-purple-950/20 text-white'
                    : 'border-gray-800 bg-gray-900 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-bold text-xs">Direct Bank Transfer (IBFT - HBL / Meezan)</div>
                    <div className="text-[11px] text-gray-400">Official company account with electronic receipt.</div>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'bank_transfer'} readOnly className="accent-purple-500" />
              </label>
            </div>
          </div>
        </div>

        {/* Order Review & Pay CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white">Your Order</h3>

            <div className="divide-y divide-gray-800 text-xs">
              {items.map(item => (
                <div key={item.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{item.smartphone.name}</div>
                    <div className="text-[11px] text-gray-400">{item.variant.ram_gb}GB+{item.variant.storage_gb}GB • Qty: {item.quantity}</div>
                  </div>
                  <div className="font-black text-white">
                    {format(item.variant.price_pkr * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">{format(subtotalPkr)}</span>
              </div>
              {discountPkr > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount</span>
                  <span>-{format(discountPkr)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Shipping (Pakistan)</span>
                <span className="text-emerald-400 font-semibold">
                  {shippingFeePkr === 0 ? 'FREE' : format(shippingFeePkr)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-800 flex justify-between items-baseline">
                <span className="font-bold text-white text-sm">Total Due</span>
                <span className="text-2xl font-black text-emerald-400">{format(totalPkr)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold py-3.5 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 shadow-glow"
            >
              <span>{submitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official 1-Year Mercantile / Brand Warranty Included</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
