import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { dataRepository } from '@/lib/db';
import { ArrowLeft, Calendar, ExternalLink, ShieldCheck, Newspaper } from 'lucide-react';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await dataRepository.getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-emerald-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All News</span>
      </Link>

      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-gray-800 space-y-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="bg-emerald-950/80 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
            {article.source_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(article.published_at).toLocaleDateString('en-PK', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {article.title}
        </h1>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 text-xs font-medium text-gray-300 leading-relaxed italic">
          &quot;{article.summary}&quot;
        </div>

        <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-800">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="800px"
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-invert max-w-none text-sm text-gray-300 leading-relaxed space-y-4">
          <p>{article.content}</p>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Curated and summarized in compliance with source attribution guidelines.</span>
          </div>

          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-cyan-400 hover:underline font-bold"
          >
            <span>Visit Original Story at {article.source_name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
