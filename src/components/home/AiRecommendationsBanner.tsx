import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Target, Sliders } from 'lucide-react';

export function AiRecommendationsBanner() {
  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800/60">
      <div className="relative glass-panel rounded-3xl p-8 sm:p-12 overflow-hidden border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-dark-900 to-cyan-950/40">
        {/* Glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Personalized Recommendations
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            Confused About Which Phone to Buy in Pakistan? Let AI Find Your Exact Match.
          </h2>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Tell us your budget in PKR, your gaming expectations, photography needs, and battery preferences. Our OpenAI GPT-4o engine scans verified hardware benchmarks and official Pakistani retail inventories to recommend the best value.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-gray-300">
            <div className="flex items-center gap-2 bg-dark-900/60 p-3 rounded-xl border border-gray-800">
              <Target className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Budget Centric PKR Matching</span>
            </div>
            <div className="flex items-center gap-2 bg-dark-900/60 p-3 rounded-xl border border-gray-800">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Thermal & Gaming Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-dark-900/60 p-3 rounded-xl border border-gray-800">
              <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PTA Duty & Warranty Filter</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/ai-recommendations"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-purple-600 hover:bg-purple-500 text-white font-black px-7 py-3.5 rounded-2xl text-sm transition-all shadow-lg hover:shadow-purple-500/25 text-center"
            >
              <span>Launch AI Smartphone Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
