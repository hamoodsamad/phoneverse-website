'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, RecommendedPhone } from '@/types';
import { mockSmartphones, mockBrands } from '@/data/mockData';
import { useCurrency } from '@/context/CurrencyContext';
import { aiService } from '@/lib/integrations/ai-service';
import {
  Sparkles,
  Target,
  Gamepad2,
  Camera,
  BatteryCharging,
  Sliders,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ShoppingBag
} from 'lucide-react';

export default function AiRecommendationsPage() {
  const { format } = useCurrency();

  // Wizard state
  const [budgetPkr, setBudgetPkr] = useState<number>(250000);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [priorities, setPriorities] = useState<string[]>(['gaming', 'camera']);
  const [minRam, setMinRam] = useState<number>(12);
  const [needs5g, setNeeds5g] = useState(true);

  // Recommendations state
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedPhone[]>([]);
  const [aiReasoning, setAiReasoning] = useState<string>('');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState(false);

  const togglePriority = (p: string) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter(item => item !== p));
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await aiService.generateRecommendations(
        {
          budget_pkr: budgetPkr,
          preferred_brand: selectedBrand || undefined,
          usage_priorities: priorities as any,
          minimum_ram_gb: minRam,
          needs_5g: needs5g
        },
        mockSmartphones
      );

      setRecommendations(response.recommendations);
      setAiReasoning(response.aiReasoning);
      setIsAiGenerated(response.isAiGenerated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-dark-900 to-cyan-950/30 mb-10">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            OpenAI & Hardware Benchmarking Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            AI Smartphone Recommendation Advisor
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            Answer a few quick questions about your budget in PKR and personal usage style. Our AI scans verified specifications, official PTA status, and current Pakistani retail prices to match you with your ideal phone.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Wizard Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleGenerate} className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              Your Phone Preferences
            </h2>

            {/* Budget Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-300 uppercase tracking-wider">Maximum Budget</span>
                <span className="text-emerald-400 font-extrabold text-sm">{format(budgetPkr)}</span>
              </div>
              <input
                type="range"
                min={60000}
                max={600000}
                step={10000}
                value={budgetPkr}
                onChange={(e) => setBudgetPkr(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>₨ 60,000 (Midrange)</span>
                <span>₨ 600,000 (Ultra Flagship)</span>
              </div>
            </div>

            {/* Brand Preference */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                Preferred Brand (Optional)
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Any Brand (Best Overall Match)</option>
                {mockBrands.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Usage Priorities */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                Primary Requirements (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'gaming', label: 'Gaming & Performance', icon: Gamepad2 },
                  { id: 'camera', label: 'Pro Optics & Photography', icon: Camera },
                  { id: 'battery', label: 'Long Battery Life (5000mAh+)', icon: BatteryCharging },
                  { id: 'compact', label: 'Compact / Light Weight', icon: Target },
                  { id: 'premium_build', label: 'Titanium / Ceramic Build', icon: ShieldCheck }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = priorities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePriority(item.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-purple-400" />
                      <span className="leading-snug">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RAM requirement */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                Minimum RAM
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[8, 12, 16].map(ram => (
                  <button
                    key={ram}
                    type="button"
                    onClick={() => setMinRam(ram)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      minRam === ram
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-gray-900 border-gray-800 text-gray-400'
                    }`}
                  >
                    {ram}GB+ RAM
                  </button>
                ))}
              </div>
            </div>

            {/* 5G checkbox */}
            <div className="pt-2 border-t border-gray-800">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-gray-300 font-semibold">Must have 5G support</span>
                <input
                  type="checkbox"
                  checked={needs5g}
                  onChange={(e) => setNeeds5g(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-500"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating Hardware & Prices...' : 'Generate Recommendations'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: AI Recommendations Output */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="glass-panel p-16 rounded-3xl border border-gray-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-white">Analyzing Hardware Architecture & Pakistan Retail Data</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Comparing AnTuTu scores, camera sensor sizes, and current retail prices in PKR across certified merchants.
              </p>
            </div>
          ) : hasSearched && recommendations.length > 0 ? (
            <div className="space-y-6">
              {/* Reasoning Card */}
              <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 text-xs text-gray-300 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-300 block mb-1">
                    AI Advisor Reasoning ({isAiGenerated ? 'OpenAI GPT-4o' : 'Verified Rule Engine'}):
                  </strong>
                  <span>{aiReasoning}</span>
                </div>
              </div>

              {/* Recommended Cards */}
              <div className="space-y-4">
                {recommendations.map((item, idx) => {
                  const phone = item.phone;
                  return (
                    <div
                      key={phone.id}
                      className="glass-panel p-6 rounded-3xl border border-gray-800 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row items-center gap-6"
                    >
                      <div className="relative w-28 h-36 bg-gray-800/50 rounded-2xl p-2 shrink-0">
                        <Image
                          src={phone.primary_image_url}
                          alt={phone.name}
                          fill
                          sizes="140px"
                          className="object-contain"
                        />
                        <div className="absolute top-2 left-2 bg-purple-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                          #{idx + 1} Match
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-emerald-400">{phone.brand_name}</span>
                          <span className="text-[11px] font-semibold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800">
                            {item.matchScore}% Compatibility
                          </span>
                        </div>

                        <Link href={`/smartphones/${phone.slug}`} className="font-black text-lg text-white hover:text-emerald-400 transition-colors block">
                          {phone.name}
                        </Link>

                        <p className="text-xs text-gray-300 leading-snug">
                          {item.recommendationReason}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.keyStrengths.map((strength, sIdx) => (
                            <span key={sIdx} className="text-[10px] bg-gray-900 border border-gray-800 text-gray-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> {strength}
                            </span>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-gray-400">Best Price (PKR)</div>
                            <div className="text-base font-black text-emerald-400">
                              {format(phone.base_price_pkr)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/compare?phone1=${phone.slug}`}
                              className="px-3 py-1.5 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold"
                            >
                              Compare
                            </Link>
                            <Link
                              href={`/smartphones/${phone.slug}`}
                              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-900 text-xs font-extrabold flex items-center gap-1 shadow-glow"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>View Specs</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-gray-800 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Ready for Personalized Recommendations</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Adjust your maximum budget slider and select your priorities on the left to receive an AI curated shortlist.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
