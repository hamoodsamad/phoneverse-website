import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsArticle } from '@/types';
import { Newspaper, ArrowRight, ExternalLink, Calendar } from 'lucide-react';

export function TechNewsSection({ news }: { news: NewsArticle[] }) {
  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800/60">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4 shrink-0" />
            2026 Mobile Ecosystem
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Latest Smartphone & Telecom News
          </h2>
        </div>

        <Link
          href="/news"
          className="text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
        >
          <span>All News Articles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.slice(0, 3).map(article => (
          <article
            key={article.id}
            className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border border-gray-800"
          >
            <div>
              <div className="relative w-full h-48 bg-gray-800">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-dark-900/90 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {article.source_name}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(article.published_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <Link href={`/news/${article.slug}`}>
                  <h3 className="font-bold text-base text-white hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between text-xs">
              <Link href={`/news/${article.slug}`} className="font-bold text-cyan-400 hover:underline">
                Read Full Story →
              </Link>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-[11px]"
              >
                <span>Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
