import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dataRepository } from '@/lib/db';
import { Newspaper, Calendar, ExternalLink, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function NewsIndexPage() {
  const news = await dataRepository.getNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Newspaper className="w-4 h-4" />
          Industry Intelligence & Updates
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Technology & Smartphone News (2026)
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Automated news summaries, PTA regulatory policy updates, chipset benchmark breakthroughs, and global smartphone launches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {news.map(article => (
          <article
            key={article.id}
            className="glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col justify-between border border-gray-800"
          >
            <div>
              <div className="relative w-full h-52 bg-gray-800">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-dark-900/90 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {article.source_name}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(article.published_at).toLocaleDateString('en-PK', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <Link href={`/news/${article.slug}`}>
                  <h2 className="font-bold text-base text-white hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h2>
                </Link>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between text-xs border-t border-gray-800/60 mt-4">
              <Link href={`/news/${article.slug}`} className="font-bold text-cyan-400 hover:underline flex items-center gap-1">
                <span>Read Full Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300 flex items-center gap-1 text-[11px]"
              >
                <span>External Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
