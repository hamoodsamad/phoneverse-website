'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, SmartphoneVariant, Review } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { calculateDiscount } from '@/lib/currency';
import {
  ShieldCheck,
  ShoppingBag,
  Heart,
  Scale,
  Sparkles,
  TrendingDown,
  Cpu,
  Camera,
  Battery,
  Layers,
  Radio,
  Sliders,
  Check,
  Star,
  ExternalLink,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface SmartphoneDetailViewProps {
  phone: Smartphone;
  reviews: Review[];
}

export function SmartphoneDetailView({ phone, reviews: initialReviews }: SmartphoneDetailViewProps) {
  const { format } = useCurrency();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const [selectedVariant, setSelectedVariant] = useState<SmartphoneVariant>(
    phone.variants?.[0] || {
      id: 'default',
      smartphone_id: phone.id,
      sku: `${phone.slug}-standard`,
      ram_gb: 12,
      storage_gb: 256,
      color_name: 'Standard Titanium',
      color_hex: '#333333',
      regional_market: 'Pakistan Official',
      pta_status: phone.pta_status,
      price_pkr: phone.base_price_pkr,
      stock_quantity: 10,
      is_available: true
    }
  );

  const [activeTab, setActiveTab] = useState<'specs' | 'prices' | 'reviews'>('specs');
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFavorited = isInWishlist(phone.id);
  const isCompared = isInCompare(phone.id);
  const discountPct = calculateDiscount(selectedVariant.price_pkr, selectedVariant.original_price_pkr || phone.original_price_pkr);

  const handleAddToCart = () => {
    addToCart(phone, selectedVariant, 1);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      smartphone_id: phone.id,
      author_name: newReviewAuthor.trim(),
      rating: newReviewRating,
      title: 'Verified Pakistani Buyer Review',
      comment: newReviewComment.trim(),
      is_verified_buyer: true,
      created_at: new Date().toISOString().split('T')[0]
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setReviewSubmitted(true);
  };

  const specs = phone.specs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        <span>/</span>
        <Link href="/smartphones" className="hover:text-emerald-400">Smartphones</Link>
        <span>/</span>
        <Link href={`/brands/${phone.brand_slug}`} className="hover:text-emerald-400">{phone.brand_name}</Link>
        <span>/</span>
        <span className="text-gray-200 font-semibold">{phone.name}</span>
      </nav>

      {/* Top Product Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
        {/* Gallery / Image View */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full h-96 sm:h-[460px] glass-panel rounded-3xl p-6 border border-gray-800 flex items-center justify-center overflow-hidden">
            {phone.is_unconfirmed && (
              <div className="absolute top-4 left-4 bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Rumored Specifications
              </div>
            )}
            <Image
              src={phone.primary_image_url}
              alt={phone.name}
              fill
              sizes="600px"
              className="object-contain p-6"
              priority
            />
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <span>Color Variant: <strong className="text-white">{selectedVariant.color_name}</strong></span>
            <span
              className="w-4 h-4 rounded-full border border-gray-600 inline-block shadow-sm"
              style={{ backgroundColor: selectedVariant.color_hex }}
            />
          </div>
        </div>

        {/* Product Details & Variant Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                {phone.brand_name}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-400">Model: {phone.model_name || 'Official Flagship'}</span>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-400">Released: {phone.release_date || '2026'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {phone.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-950/80 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                {selectedVariant.pta_status}
              </span>
              <span className="text-xs text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                {phone.warranty_info}
              </span>
              <span className="text-xs text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                Source: {phone.source_attribution}
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-800">
            <div className="text-xs text-gray-400">Verified Retail Price in Pakistan (PKR)</div>
            <div className="flex items-baseline gap-3 my-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {format(selectedVariant.price_pkr)}
              </span>
              {selectedVariant.original_price_pkr && (
                <span className="text-base text-gray-500 line-through font-semibold">
                  {format(selectedVariant.original_price_pkr)}
                </span>
              )}
              {discountPct > 0 && (
                <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  Save {discountPct}%
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-400">
              *Prices include official import duties where PTA Approved. Shipping free over ₨ 50,000.
            </div>
          </div>

          {/* Color & Variant Selection */}
          {phone.variants && phone.variants.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Select Storage & RAM Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {phone.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedVariant.id === v.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-glow'
                          : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {v.ram_gb}GB RAM + {v.storage_gb}GB Storage
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Official Color
                </label>
                <div className="flex items-center gap-3">
                  {phone.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedVariant.id === v.id
                          ? 'border-emerald-500 bg-gray-800 text-white'
                          : 'border-gray-800 bg-gray-900 text-gray-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-600"
                        style={{ backgroundColor: v.color_hex }}
                      />
                      <span>{v.color_name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-glow"
            >
              <ShoppingBag className="w-5 h-5 fill-current" />
              <span>Add to Cart ({format(selectedVariant.price_pkr)})</span>
            </button>

            <button
              onClick={() => toggleWishlist(phone)}
              className={`p-3.5 rounded-2xl border transition-colors ${
                isFavorited
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-rose-500 hover:text-rose-400'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => addToCompare(phone)}
              className={`p-3.5 rounded-2xl border transition-colors ${
                isCompared
                  ? 'bg-cyan-500 text-white border-cyan-500'
                  : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-cyan-500 hover:text-cyan-400'
              }`}
              title="Add to Compare"
            >
              <Scale className="w-5 h-5" />
            </button>

            <Link
              href={`/compare?phone1=${phone.slug}`}
              className="w-full sm:w-auto justify-center px-4 py-3.5 rounded-2xl bg-gray-900 border border-gray-700 text-cyan-400 hover:bg-gray-800 text-xs font-bold flex items-center gap-1.5"
            >
              <Scale className="w-4 h-4" />
              <span>Compare vs Other Phones</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-gray-800 mb-8 flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-bold overflow-x-auto pb-1 w-full max-w-full">
        <button
          onClick={() => setActiveTab('specs')}
          className={`pb-3 flex items-center gap-2 shrink-0 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'specs'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4 shrink-0" />
          <span>Full Technical Specifications</span>
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`pb-3 flex items-center gap-2 shrink-0 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'prices'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <TrendingDown className="w-4 h-4 shrink-0" />
          <span>Pakistan Merchant Prices ({phone.prices?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 flex items-center gap-2 shrink-0 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4 shrink-0" />
          <span>Customer Reviews ({reviewsList.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: FULL SPECIFICATIONS */}
      {activeTab === 'specs' && specs && (
        <div className="space-y-6">
          {/* Display */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800">
            <h3 className="text-base font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Display & Screen Technology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Display Type</span><span className="font-semibold text-white text-right">{specs.display_type}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Screen Size</span><span className="font-semibold text-white">{specs.display_size_inches} inches</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Resolution</span><span className="font-semibold text-white">{specs.resolution}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Refresh Rate</span><span className="font-semibold text-emerald-400">{specs.refresh_rate_hz}Hz ProMotion / Dynamic</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Peak Brightness</span><span className="font-semibold text-white">{specs.peak_brightness_nits} nits</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Screen Protection</span><span className="font-semibold text-white">{specs.display_protection}</span></div>
            </div>
          </div>

          {/* Processor & Hardware */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800">
            <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Platform, Chipset & Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Chipset (SoC)</span><span className="font-semibold text-emerald-400 text-right">{specs.chipset}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">CPU Architecture</span><span className="font-semibold text-white text-right">{specs.cpu}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">GPU / Graphics</span><span className="font-semibold text-white">{specs.gpu}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Operating System</span><span className="font-semibold text-white">{specs.os_name}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800 col-span-1 md:col-span-2"><span className="text-gray-400">Update Policy</span><span className="font-semibold text-cyan-400">{specs.os_update_policy}</span></div>
            </div>
          </div>

          {/* Camera System */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800">
            <h3 className="text-base font-bold text-purple-400 mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Camera Optics & Imaging
            </h3>
            <div className="space-y-3 text-xs">
              <div className="py-2 border-b border-gray-800">
                <span className="text-gray-400 block mb-1">Rear Camera Setup</span>
                <span className="font-semibold text-white text-sm">{specs.rear_camera_setup}</span>
              </div>
              <div className="py-2 border-b border-gray-800">
                <span className="text-gray-400 block mb-1">Video & Optical Features</span>
                <span className="font-medium text-gray-300">{specs.rear_camera_features}</span>
              </div>
              <div className="py-2 border-b border-gray-800">
                <span className="text-gray-400 block mb-1">Front Selfie Camera</span>
                <span className="font-semibold text-white">{specs.front_camera_setup} ({specs.front_camera_features})</span>
              </div>
            </div>
          </div>

          {/* Battery & Charging */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800">
            <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Battery className="w-4 h-4" />
              Battery Capacity & Fast Charging
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Battery Capacity</span><span className="font-semibold text-white">{specs.battery_capacity_mah} mAh</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Wired Fast Charging</span><span className="font-semibold text-white">{specs.wired_charging_watts}W Rapid Charger</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Wireless Charging</span><span className="font-semibold text-white">{specs.wireless_charging_watts}W Fast Wireless</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Reverse Charging</span><span className="font-semibold text-white">{specs.reverse_charging_supported ? 'Supported' : 'No'}</span></div>
            </div>
          </div>

          {/* Connectivity, Build & Sensors */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800">
            <h3 className="text-base font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Connectivity, Build & Sensors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">5G Support</span><span className="font-semibold text-emerald-400">{specs.supports_5g ? 'Sub-6GHz + mmWave 5G' : '4G LTE'}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">SIM Configuration</span><span className="font-semibold text-white">{specs.sim_type}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Wi-Fi Standard</span><span className="font-semibold text-white">{specs.wifi_standard}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Bluetooth</span><span className="font-semibold text-white">{specs.bluetooth_version}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">NFC & USB</span><span className="font-semibold text-white">{specs.has_nfc ? 'NFC Enabled' : 'No NFC'}, {specs.usb_type}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Dimensions & Weight</span><span className="font-semibold text-white">{specs.dimensions_mm} ({specs.weight_grams}g)</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Water Resistance</span><span className="font-semibold text-white">{specs.ip_rating}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-800"><span className="text-gray-400">Sensors</span><span className="font-semibold text-white text-right">{specs.sensors}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MERCHANT PRICES */}
      {activeTab === 'prices' && (
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div>
              <h3 className="text-base font-bold text-white">Live Retailer Prices in Pakistan</h3>
              <p className="text-xs text-gray-400">Verified retail partners and authorized Pakistani merchants.</p>
            </div>
            <Link
              href={`/price-history/${phone.slug}`}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              View Detailed Price Trends →
            </Link>
          </div>

          {phone.prices && phone.prices.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {phone.prices.map(price => (
                <div key={price.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{price.seller_name}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>Last checked: {price.last_checked_at}</span>
                      <span className="text-emerald-400 font-semibold">• {price.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-400">{format(price.price_pkr)}</div>
                      {price.previous_price_pkr && (
                        <div className="text-xs text-gray-500 line-through">{format(price.previous_price_pkr)}</div>
                      )}
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              No merchant prices recorded yet for this device.
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CUSTOMER REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* Write a Review Box */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800">
            <h3 className="text-base font-bold text-white mb-2">Write a Review for {phone.name}</h3>
            {reviewSubmitted ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold">
                Thank you! Your verified Pakistani user review has been posted.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Farhan Khan (Karachi)"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Rating</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={5}>5 Stars - Excellent Flagship</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Below Expectations</option>
                      <option value={1}>1 Star - Poor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Your Review</label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe camera performance, real-world battery endurance, PTA activation, and thermal handling..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>

          {/* Reviews List */}
          <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white">Verified Pakistani Customer Feedback</h3>
            {reviewsList.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {reviewsList.map(review => (
                  <div key={review.id} className="py-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{review.author_name}</span>
                        {review.is_verified_buyer && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-medium">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500">{review.created_at}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>

                    <div className="text-xs font-semibold text-gray-200 mb-1">{review.title}</div>
                    <p className="text-xs text-gray-400 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-gray-400">
                Be the first to review {phone.name}!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
