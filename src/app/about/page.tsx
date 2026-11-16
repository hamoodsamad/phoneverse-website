import React from 'react';
import { ShieldCheck, Sparkles, TrendingDown, Users, Globe2, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
          About PhoneVerse 2026
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Pioneering Smartphone Intelligence in Pakistan
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Built for technology enthusiasts, verified buyers, and smartphone researchers seeking authentic data, verified PTA compliance, and unbiased AI comparison analytics.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 text-sm text-gray-300 leading-relaxed">
        <h2 className="text-xl font-bold text-white">Our Mission</h2>
        <p>
          Founded in 2026, PhoneVerse was engineered to solve a fundamental challenge in the Pakistani electronics market: the lack of unified, verified technical specification data, confusing import tax / PTA status ambiguities, and scattered retailer prices.
        </p>
        <p>
          We bridge the gap between global smartphone launches and local Pakistani retail reality by consolidating verified hardware schematics, real-time PKR price trackers, and OpenAI GPT-4o comparative intelligence into a seamless, modern platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-800">
          <div className="space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white">100% Verified Specs</h3>
            <p className="text-xs text-gray-400">Directly attributed to official manufacturer feeds and lab benchmarks.</p>
          </div>
          <div className="space-y-2">
            <TrendingDown className="w-6 h-6 text-cyan-400" />
            <h3 className="font-bold text-white">Live PKR Tracking</h3>
            <p className="text-xs text-gray-400">Monitoring PriceOye, Daraz Mall, Telemart, and official Pakistani brand stores.</p>
          </div>
          <div className="space-y-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-white">AI Hardware Advisor</h3>
            <p className="text-xs text-gray-400">Personalized matching based on real gaming, camera, and budget priorities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
