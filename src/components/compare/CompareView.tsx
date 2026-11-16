'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Smartphone, ComparisonResult } from '@/types';
import { useCompare } from '@/context/CompareContext';
import { useCurrency } from '@/context/CurrencyContext';
import { aiService } from '@/lib/integrations/ai-service';
import {
  Scale,
  Sparkles,
  Trophy,
  X,
  Plus,
  CheckCircle,
  XCircle,
  Cpu,
  Camera,
  Battery,
  Layers,
  Zap,
  ShoppingBag,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface CompareViewProps {
  allPhones: Smartphone[];
}

export function CompareView({ allPhones }: CompareViewProps) {
  const { format } = useCurrency();
  const searchParams = useSearchParams();
  const { selectedPhones, removeFromCompare, clearCompare, addToCompare } = useCompare();

  const [activePhones, setActivePhones] = useState<Smartphone[]>(selectedPhones);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Synchronize with compare context and URL query params
  useEffect(() => {
    const p1Slug = searchParams.get('phone1');
    const p2Slug = searchParams.get('phone2');

    let phonesToSet: Smartphone[] = [...selectedPhones];

    if (p1Slug) {
      const p1 = allPhones.find(p => p.slug === p1Slug);
      if (p1 && !phonesToSet.some(p => p.id === p1.id)) phonesToSet.push(p1);
    }
    if (p2Slug) {
      const p2 = allPhones.find(p => p.slug === p2Slug);
      if (p2 && !phonesToSet.some(p => p.id === p2.id)) phonesToSet.push(p2);
    }

    // Default to top 2 if none selected
    if (phonesToSet.length === 0 && allPhones.length >= 2) {
      phonesToSet = [allPhones[0], allPhones[1]];
    }

    setActivePhones(phonesToSet);
  }, [selectedPhones, searchParams, allPhones]);

  // Generate comparison when activePhones change
  useEffect(() => {
    if (activePhones.length >= 2) {
      setLoadingAi(true);
      aiService.compareSmartphones(activePhones)
        .then(res => setComparisonResult(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingAi(false));
    } else {
      setComparisonResult(null);
    }
  }, [activePhones]);

  const handleRemove = (phoneId: string) => {
    const updated = activePhones.filter(p => p.id !== phoneId);
    setActivePhones(updated);
    removeFromCompare(phoneId);
  };

  const handleAddPhone = (phone: Smartphone) => {
    if (activePhones.length >= 4) return;
    if (activePhones.some(p => p.id === phone.id)) return;
    const updated = [...activePhones, phone];
    setActivePhones(updated);
    addToCompare(phone);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            Silicon & Optics Showdown
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Smartphone Specification & AI Comparison
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Side-by-side technical specification matrix paired with AI-driven category evaluations for Pakistani buyers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activePhones.length < 4 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-gray-900 border border-gray-700 hover:border-cyan-500 text-cyan-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Phone ({activePhones.length}/4)</span>
            </button>
          )}

          {activePhones.length > 0 && (
            <button
              onClick={() => { setActivePhones([]); clearCompare(); }}
              className="text-xs text-gray-400 hover:text-white px-3 py-2"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {activePhones.length < 2 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-gray-800 my-8">
          <Scale className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Select at least 2 smartphones to compare</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
            Compare processors, cameras, displays, battery life, and pricing in PKR.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500 text-dark-900 font-bold px-6 py-2.5 rounded-xl text-xs"
          >
            Choose Smartphones
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* AI Comparative Executive Verdict */}
          {comparisonResult && (
            <div className="glass-panel p-5 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-dark-900 to-cyan-950/30 space-y-6 w-full max-w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>AI Comparison Engine • {comparisonResult.isAiGenerated ? 'OpenAI GPT-4o' : 'Hardware Evaluator'}</span>
                </div>
                <span className="text-[11px] text-gray-400 bg-dark-900/80 px-2.5 py-1 rounded-full border border-gray-800 shrink-0 w-fit">
                  PTA & Pakistan Retail Calibrated
                </span>
              </div>

              {loadingAi ? (
                <div className="py-6 text-center text-xs text-purple-300 animate-pulse">
                  Analyzing hardware schematics and retail pricing...
                </div>
              ) : (
                <>
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-medium">
                    {comparisonResult.aiAnalysis.summary}
                  </p>

                  {/* Category Winners Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {comparisonResult.categoryWinners.map(win => {
                      const winningPhone = activePhones.find(p => p.id === win.winnerPhoneId);
                      return (
                        <div key={win.category} className="bg-dark-900/80 p-4 rounded-2xl border border-gray-800 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
                              <Trophy className="w-3.5 h-3.5 shrink-0" />
                              <span>{win.category}</span>
                            </div>
                            <div className="font-extrabold text-white text-sm">
                              {winningPhone?.name || 'Top Contender'}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1 leading-snug line-clamp-3">
                              {win.reason}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Deep dive sections */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-800 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-cyan-400 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5" /> Silicon & Gaming
                      </span>
                      <p className="text-gray-300 leading-relaxed">{comparisonResult.aiAnalysis.gamingComparison}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-purple-400 flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5" /> Camera & Optics
                      </span>
                      <p className="text-gray-300 leading-relaxed">{comparisonResult.aiAnalysis.cameraComparison}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Battery className="w-3.5 h-3.5" /> Battery & Endurance
                      </span>
                      <p className="text-gray-300 leading-relaxed">{comparisonResult.aiAnalysis.batteryComparison}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SIDE-BY-SIDE MATRIX TABLE */}
          <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden w-full max-w-full">
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full text-left border-collapse text-xs">
                {/* Header Row: Phone Cards */}
                <thead>
                  <tr className="border-b border-gray-800 bg-dark-900/80">
                    <th className="p-4 w-44 font-bold text-gray-400 uppercase tracking-wider text-[11px] align-top">
                      Specification
                    </th>
                    {activePhones.map(phone => (
                      <th key={phone.id} className="p-4 min-w-[220px] align-top">
                        <div className="relative group">
                          <button
                            onClick={() => handleRemove(phone.id)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-800 hover:bg-rose-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>

                          <div className="relative w-full h-32 mb-2 bg-gray-800/40 rounded-xl p-2">
                            <Image
                              src={phone.primary_image_url}
                              alt={phone.name}
                              fill
                              sizes="200px"
                              className="object-contain"
                            />
                          </div>

                          <div className="text-[10px] font-bold text-emerald-400 uppercase">{phone.brand_name}</div>
                          <Link href={`/smartphones/${phone.slug}`} className="font-black text-sm text-white hover:text-emerald-400 transition-colors block line-clamp-1">
                            {phone.name}
                          </Link>

                          <div className="mt-2 text-sm font-extrabold text-emerald-400">
                            {format(phone.base_price_pkr)}
                          </div>
                          <div className="text-[10px] text-gray-400">{phone.pta_status}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800/60">
                  {/* Price in PKR */}
                  <tr className="bg-gray-900/30">
                    <td className="p-4 font-bold text-gray-400">Best Retail PKR</td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 font-extrabold text-emerald-400 text-sm">
                        {format(p.base_price_pkr)}
                      </td>
                    ))}
                  </tr>

                  {/* PTA Status */}
                  <tr>
                    <td className="p-4 font-bold text-gray-400">PTA Approval Status</td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 text-gray-200">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" /> {p.pta_status}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Chipset / Processor */}
                  <tr className="bg-gray-900/30">
                    <td className="p-4 font-bold text-cyan-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5" /> Processor (Chipset)
                    </td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 font-semibold text-white">
                        {p.specs?.chipset}
                      </td>
                    ))}
                  </tr>

                  {/* Display */}
                  <tr>
                    <td className="p-4 font-bold text-gray-400">Display & Refresh Rate</td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 text-gray-200">
                        <div>{p.specs?.display_size_inches}&quot; {p.specs?.display_type}</div>
                        <div className="text-cyan-400 font-semibold">{p.specs?.refresh_rate_hz}Hz • {p.specs?.peak_brightness_nits} nits peak</div>
                      </td>
                    ))}
                  </tr>

                  {/* Rear Camera */}
                  <tr className="bg-gray-900/30">
                    <td className="p-4 font-bold text-purple-400 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" /> Main Camera Setup
                    </td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 text-gray-200 font-medium">
                        {p.specs?.rear_camera_setup}
                      </td>
                    ))}
                  </tr>

                  {/* Front Camera */}
                  <tr>
                    <td className="p-4 font-bold text-gray-400">Selfie Camera</td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 text-gray-200">
                        {p.specs?.front_camera_setup}
                      </td>
                    ))}
                  </tr>

                  {/* Battery & Charging */}
                  <tr className="bg-gray-900/30">
                    <td className="p-4 font-bold text-emerald-400 flex items-center gap-1.5">
                      <Battery className="w-3.5 h-3.5" /> Battery & Charging
                    </td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 text-gray-200">
                        <div className="font-bold text-white">{p.specs?.battery_capacity_mah} mAh</div>
                        <div className="text-gray-400">{p.specs?.wired_charging_watts}W Wired • {p.specs?.wireless_charging_watts}W Wireless</div>
                      </td>
                    ))}
                  </tr>

                  {/* OS & Updates */}
                  <tr>
                    <td className="p-4 font-bold text-gray-400">Software & OS Support</td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 text-gray-200">
                        <div>{p.specs?.os_name}</div>
                        <div className="text-xs text-gray-400">{p.specs?.os_update_policy}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Build & Water resistance */}
                  <tr className="bg-gray-900/30">
                    <td className="p-4 font-bold text-gray-400">Build & Water Ingress</td>
                    {activePhones.map(p => (
                      <td key={p.id} className="p-4 text-gray-200">
                        <div>{p.specs?.frame_material}</div>
                        <div className="text-emerald-400 font-semibold">{p.specs?.ip_rating}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Pros and Cons */}
                  {comparisonResult && (
                    <tr>
                      <td className="p-4 font-bold text-amber-400">Key Advantages</td>
                      {activePhones.map(p => {
                        const pros = comparisonResult.prosAndCons[p.id]?.pros || [];
                        const cons = comparisonResult.prosAndCons[p.id]?.cons || [];
                        return (
                          <td key={p.id} className="p-4 space-y-3 align-top">
                            <div className="space-y-1">
                              {pros.map((pro, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-emerald-400 text-[11px]">
                                  <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-1">
                              {cons.map((con, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-rose-400 text-[11px]">
                                  <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <span>{con}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Phone Selection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel bg-dark-900 border border-gray-700 rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <h3 className="text-base font-bold text-white">Add Smartphone to Comparison</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-gray-800 my-4 flex-1">
              {allPhones
                .filter(p => !activePhones.some(ap => ap.id === p.id))
                .map(phone => (
                  <div key={phone.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-gray-800 rounded-lg p-1 shrink-0">
                        <Image
                          src={phone.primary_image_url}
                          alt={phone.name}
                          fill
                          sizes="60px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-400">{phone.brand_name}</div>
                        <div className="font-bold text-sm text-white">{phone.name}</div>
                        <div className="text-[11px] text-gray-400">{format(phone.base_price_pkr)}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddPhone(phone)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
                    >
                      Select
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
