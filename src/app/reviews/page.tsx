import React from 'react';
import Link from 'next/link';
import { dataRepository } from '@/lib/db';
import { Star, ShieldCheck, MessageSquare } from 'lucide-react';

export const revalidate = 60;

export default async function ReviewsPage() {
  const [reviews, phones] = await Promise.all([
    dataRepository.getReviews(),
    dataRepository.getSmartphones()
  ]);

  const phoneMap = new Map(phones.map(p => [p.id, p]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Star className="w-4 h-4 fill-current" />
          Community Feedback
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Verified Customer Smartphone Reviews
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Authentic feedback from Pakistani buyers on camera performance, battery degradation, thermal throttling, and local network PTA experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(review => {
          const phone = phoneMap.get(review.smartphone_id);
          return (
            <div
              key={review.id}
              className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  {review.is_verified_buyer && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>

                {phone && (
                  <div className="mb-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">{phone.brand_name}</span>
                    <Link href={`/smartphones/${phone.slug}`} className="block font-bold text-white hover:text-emerald-400 text-sm">
                      {phone.name}
                    </Link>
                  </div>
                )}

                <h3 className="font-bold text-gray-200 text-xs mb-2 italic">
                  &quot;{review.title}&quot;
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800/80 mt-4 flex items-center justify-between text-[11px] text-gray-500">
                <span className="font-semibold text-gray-400">{review.author_name}</span>
                <span>{review.created_at}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
