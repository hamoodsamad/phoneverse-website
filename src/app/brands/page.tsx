import React from 'react';
import Link from 'next/link';
import { dataRepository } from '@/lib/db';
import { Layers, ArrowRight, ExternalLink } from 'lucide-react';

export const revalidate = 60;

export default async function BrandsPage() {
  const brands = await dataRepository.getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          Hardware Manufacturers
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Smartphone Brands Directory
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Explore smartphones by official manufacturer, discover their unique operating systems, and browse current catalog offerings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map(brand => (
          <div
            key={brand.id}
            className="glass-panel glass-panel-hover p-6 rounded-3xl border border-gray-800 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-800/90 text-white font-black text-xl flex items-center justify-center border border-gray-700 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                  {brand.name.slice(0, 2).toUpperCase()}
                </div>
                {brand.country_origin && (
                  <span className="text-xs bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-gray-400">
                    {brand.country_origin}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                {brand.name}
              </h2>

              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {brand.description}
              </p>
            </div>

            <div className="pt-6 border-t border-gray-800/80 mt-6 flex items-center justify-between">
              <Link
                href={`/brands/${brand.slug}`}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View {brand.name} Models</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-300"
                  title="Official Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
