import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { dataRepository } from '@/lib/db';
import { priceTrackingService } from '@/lib/integrations/price-tracking';
import { formatPrice } from '@/lib/currency';
import { TrendingDown, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PriceHistoryPage({ params }: PageProps) {
  const { slug } = await params;
  const phone = await dataRepository.getSmartphoneBySlug(slug);

  if (!phone) {
    notFound();
  }

  const history = phone.price_history || [];
  const stats = priceTrackingService.calculatePriceStats(history, phone.base_price_pkr);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href={`/smartphones/${phone.slug}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-emerald-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {phone.name}</span>
      </Link>

      {/* Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-24 sm:w-28 sm:h-32 bg-gray-800/60 rounded-2xl p-2 shrink-0">
            <Image
              src={phone.primary_image_url}
              alt={phone.name}
              fill
              sizes="120px"
              className="object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <span>{phone.brand_name}</span>
              <span>•</span>
              <span>{phone.pta_status}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {phone.name} Price History & Tracker
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Historical retail price movement in Pakistan (PKR) across verified electronic merchants.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/smartphones/${phone.slug}`}
            className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold px-6 py-3 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-glow"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy at Best Price ({formatPrice(phone.base_price_pkr)})</span>
          </Link>
        </div>
      </div>

      {/* Price Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="text-xs text-gray-400 font-semibold mb-1">Current Lowest Retail (PKR)</div>
          <div className="text-2xl font-black text-emerald-400">{formatPrice(phone.base_price_pkr)}</div>
          <div className="text-[11px] text-gray-500 mt-1">Verified across Pakistani sellers</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="text-xs text-gray-400 font-semibold mb-1">All-Time Lowest Recorded</div>
          <div className="text-2xl font-black text-cyan-400">{formatPrice(stats.lowestPricePkr)}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> Best time to buy
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="text-xs text-gray-400 font-semibold mb-1">Launch / Highest Price</div>
          <div className="text-2xl font-black text-gray-400">{formatPrice(stats.highestPricePkr)}</div>
          <div className="text-[11px] text-gray-500 mt-1">Initial official release MSRP</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="text-xs text-gray-400 font-semibold mb-1">Total Price Drop</div>
          <div className="text-2xl font-black text-rose-400">-{stats.priceDropPercentage}%</div>
          <div className="text-[11px] text-rose-300 mt-1">Saved {formatPrice(stats.priceDropPkr)}</div>
        </div>
      </div>

      {/* Historical Records Timeline */}
      <div className="glass-panel rounded-3xl border border-gray-800 p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Historical Price Log (PKR)</h3>
            <p className="text-xs text-gray-400">Chronological records of verified seller listings.</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            {history.length} price checks recorded
          </span>
        </div>

        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((record, idx) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    #{history.length - idx}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      {formatPrice(record.recorded_price_pkr)}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>Recorded on: {new Date(record.recorded_at).toLocaleDateString('en-PK', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-300">
                    Seller: <strong className="text-emerald-400">{record.seller_name || 'PriceOye'}</strong>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              No previous price history points recorded for this device yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
