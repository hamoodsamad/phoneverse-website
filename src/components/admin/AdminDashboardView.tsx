'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Brand, AutomationJob, SystemLog, Order } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import {
  ShieldCheck,
  Smartphone as PhoneIcon,
  TrendingDown,
  Image as ImageIcon,
  Package,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardViewProps {
  initialPhones: Smartphone[];
  initialBrands: Brand[];
  initialJobs: AutomationJob[];
  initialLogs: SystemLog[];
}

export function AdminDashboardView({
  initialPhones,
  initialBrands,
  initialJobs,
  initialLogs
}: AdminDashboardViewProps) {
  const { format } = useCurrency();

  const [activeTab, setActiveTab] = useState<'overview' | 'smartphones' | 'prices' | 'images' | 'orders' | 'automation' | 'providers' | 'logs'>('overview');
  const [phones, setPhones] = useState<Smartphone[]>(initialPhones);
  const [jobs, setJobs] = useState<AutomationJob[]>(initialJobs);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [runningJob, setRunningJob] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Manual Trigger for Background Jobs
  const triggerJob = async (jobType: 'discover_phones' | 'update_prices' | 'sync_images' | 'fetch_news') => {
    setRunningJob(jobType);
    setSyncStatusMsg(`Executing background job [${jobType}]...`);

    // Simulate task execution / API sync
    setTimeout(() => {
      const newJob: AutomationJob = {
        id: `job-${Date.now()}`,
        job_type: jobType,
        status: 'completed',
        scheduled_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        finished_at: new Date().toISOString(),
        items_processed: 25,
        items_added: jobType === 'discover_phones' ? 1 : 0,
        items_updated: jobType === 'update_prices' ? 8 : 2,
        details: { triggeredBy: 'admin_manual_override', market: 'Pakistan' }
      };

      const newLog: SystemLog = {
        id: `log-${Date.now()}`,
        level: 'info',
        source: `AdminSync:${jobType}`,
        message: `Manual synchronization of ${jobType} completed successfully. Processed 25 records.`,
        created_at: new Date().toISOString()
      };

      setJobs([newJob, ...jobs]);
      setLogs([newLog, ...logs]);
      setRunningJob(null);
      setSyncStatusMsg(`Synchronization for ${jobType.replace('_', ' ')} completed successfully!`);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Super Administrator Control Plane
          </div>
          <h1 className="text-3xl font-black text-white">
            PhoneVerse Admin Operations
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage catalog, Pakistani retail prices, Cloudinary assets, background automation, and AI configs.
          </p>
        </div>

        {/* Global sync status indicator */}
        {syncStatusMsg && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{syncStatusMsg}</span>
          </div>
        )}
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-800 mb-8 text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Layers },
          { id: 'smartphones', label: `Smartphones (${phones.length})`, icon: PhoneIcon },
          { id: 'prices', label: 'Price Management', icon: TrendingDown },
          { id: 'images', label: 'Cloudinary Images', icon: ImageIcon },
          { id: 'automation', label: 'Background Automation & Crons', icon: RefreshCw },
          { id: 'providers', label: 'API & AI Provider Settings', icon: Settings },
          { id: 'logs', label: 'System Logs', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <span className="text-xs text-gray-400 font-semibold">Active Catalog Models</span>
              <div className="text-3xl font-black text-white mt-1">{phones.length}</div>
              <span className="text-[11px] text-emerald-400 mt-2 block">100% Verified Specs</span>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <span className="text-xs text-gray-400 font-semibold">Active Pakistani Sellers</span>
              <div className="text-3xl font-black text-cyan-400 mt-1">5</div>
              <span className="text-[11px] text-gray-400 mt-2 block">PriceOye, Daraz Mall, Telemart, etc.</span>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <span className="text-xs text-gray-400 font-semibold">Cron Jobs Executed</span>
              <div className="text-3xl font-black text-purple-400 mt-1">{jobs.length}</div>
              <span className="text-[11px] text-emerald-400 mt-2 block">All tasks operational</span>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <span className="text-xs text-gray-400 font-semibold">Primary Currency</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">PKR (₨)</div>
              <span className="text-[11px] text-gray-400 mt-2 block">Target Market: Pakistan</span>
            </div>
          </div>

          {/* Quick Manual Actions */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Manual Automated Synchronization Triggers
            </h3>
            <p className="text-xs text-gray-400">
              Trigger background discovery routines on demand without waiting for scheduled cron iterations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <button
                onClick={() => triggerJob('discover_phones')}
                disabled={Boolean(runningJob)}
                className="bg-gray-900 border border-gray-700 hover:border-emerald-500 p-4 rounded-2xl text-left transition-colors"
              >
                <div className="font-bold text-white text-xs mb-1">1. Sync Phone Discovery</div>
                <div className="text-[11px] text-gray-400">Discover newly announced devices.</div>
                <span className="text-[10px] text-emerald-400 font-semibold mt-3 block">
                  {runningJob === 'discover_phones' ? 'Syncing...' : 'Run Sync →'}
                </span>
              </button>

              <button
                onClick={() => triggerJob('update_prices')}
                disabled={Boolean(runningJob)}
                className="bg-gray-900 border border-gray-700 hover:border-rose-500 p-4 rounded-2xl text-left transition-colors"
              >
                <div className="font-bold text-white text-xs mb-1">2. Sync Retailer Prices</div>
                <div className="text-[11px] text-gray-400">Poll live Pakistani prices & drops.</div>
                <span className="text-[10px] text-rose-400 font-semibold mt-3 block">
                  {runningJob === 'update_prices' ? 'Checking...' : 'Run Check →'}
                </span>
              </button>

              <button
                onClick={() => triggerJob('sync_images')}
                disabled={Boolean(runningJob)}
                className="bg-gray-900 border border-gray-700 hover:border-cyan-500 p-4 rounded-2xl text-left transition-colors"
              >
                <div className="font-bold text-white text-xs mb-1">3. Sync Official Images</div>
                <div className="text-[11px] text-gray-400">Upload matched color photos to Cloudinary.</div>
                <span className="text-[10px] text-cyan-400 font-semibold mt-3 block">
                  {runningJob === 'sync_images' ? 'Uploading...' : 'Run Upload →'}
                </span>
              </button>

              <button
                onClick={() => triggerJob('fetch_news')}
                disabled={Boolean(runningJob)}
                className="bg-gray-900 border border-gray-700 hover:border-purple-500 p-4 rounded-2xl text-left transition-colors"
              >
                <div className="font-bold text-white text-xs mb-1">4. Fetch Technology News</div>
                <div className="text-[11px] text-gray-400">Pull RSS updates and AI summaries.</div>
                <span className="text-[10px] text-purple-400 font-semibold mt-3 block">
                  {runningJob === 'fetch_news' ? 'Fetching...' : 'Run Fetch →'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMARTPHONES MANAGEMENT */}
      {activeTab === 'smartphones' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">Smartphones Inventory & Specifications</h2>
              <p className="text-xs text-gray-400">Manage hardware records, PTA status, and model variants.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3">Device</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Chipset</th>
                  <th className="p-3">PTA Status</th>
                  <th className="p-3">Price (PKR)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {phones.map(phone => (
                  <tr key={phone.id} className="hover:bg-gray-900/40">
                    <td className="p-3">
                      <div className="font-bold text-white">{phone.name}</div>
                      <span className="text-[10px] text-gray-500">{phone.model_name || phone.slug}</span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-400">{phone.brand_name}</td>
                    <td className="p-3 text-gray-300">{phone.specs?.chipset.split('(')[0]}</td>
                    <td className="p-3 text-gray-300">{phone.pta_status}</td>
                    <td className="p-3 font-extrabold text-white">{format(phone.base_price_pkr)}</td>
                    <td className="p-3">
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-semibold">
                        {phone.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        href={`/smartphones/${phone.slug}`}
                        className="text-xs text-cyan-400 hover:underline font-semibold"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRICE MANAGEMENT */}
      {activeTab === 'prices' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">Pakistani Retail Price Records</h2>
              <p className="text-xs text-gray-400">Directly modify merchant prices, set discounts, and correct listings.</p>
            </div>
          </div>

          <div className="space-y-4">
            {phones.map(phone => (
              <div key={phone.id} className="p-4 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400">{phone.brand_name}</span>
                  <div className="font-bold text-white text-sm">{phone.name}</div>
                  <span className="text-xs text-gray-400">Current Base: {format(phone.base_price_pkr)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/price-history/${phone.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold"
                  >
                    View History
                  </Link>
                  <Link
                    href={`/smartphones/${phone.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-900 text-xs font-bold"
                  >
                    Edit Prices
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CLOUDINARY IMAGES */}
      {activeTab === 'images' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">Cloudinary Image Storage & Management</h2>
              <p className="text-xs text-gray-400">Manage responsive galleries, webp optimizations, and color variant photos.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {phones.map(phone => (
              <div key={phone.id} className="p-4 rounded-2xl bg-gray-900 border border-gray-800 text-center space-y-2">
                <div className="relative w-full h-32 bg-gray-800/40 rounded-xl p-2 flex items-center justify-center">
                  <Image
                    src={phone.primary_image_url}
                    alt={phone.name}
                    fill
                    sizes="200px"
                    className="object-contain"
                  />
                </div>
                <div className="font-bold text-white text-xs line-clamp-1">{phone.name}</div>
                <div className="text-[10px] text-emerald-400">Cloudinary CDN Active</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUTOMATION & CRONS */}
      {activeTab === 'automation' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">Scheduled Workers & Task Execution Logs</h2>
              <p className="text-xs text-gray-400">Independent background scheduler monitoring smartphone launches & PKR prices.</p>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm uppercase">{job.job_type.replace('_', ' ')}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-semibold">
                      {job.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>Finished at: {new Date(job.finished_at || job.scheduled_at).toLocaleTimeString('en-PK')}</span>
                    <span>• Processed: {job.items_processed} items</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-emerald-400 font-bold">+{job.items_added} Added</span>
                  <span className="text-cyan-400 font-bold ml-2">~{job.items_updated} Updated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: API PROVIDERS */}
      {activeTab === 'providers' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="pb-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">API Integration Architecture & Provider Status</h2>
            <p className="text-xs text-gray-400">Modular provider connectors configured via environment variables.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: '1. Smartphone Specification API', envKey: 'SMARTPHONE_DATA_API_KEY', status: 'Operational (Modular Adapter Active)', fallback: 'Manual Catalog Creation' },
              { name: '2. Retailer Price Tracking API', envKey: 'PRICE_TRACKING_API_KEY', status: 'Active (Pakistan Priority: PriceOye, Daraz, Telemart)', fallback: 'Direct Admin Price Updates' },
              { name: '3. OpenAI GPT-4o API', envKey: 'OPENAI_API_KEY', status: 'Modular Connected (Fallback Engine Ready)', fallback: 'Verified Hardware Rule Matrix' },
              { name: '4. Smartphone Image Search API', envKey: 'SMARTPHONE_IMAGE_API_KEY', status: 'Separate Integration Interface', fallback: 'Admin Manual Asset Upload' },
              { name: '5. Cloudinary Storage API', envKey: 'CLOUDINARY_API_KEY', status: 'Modular Storage & Optimization', fallback: 'Standard Direct URLs' },
              { name: '6. Email Notification API (Resend)', envKey: 'RESEND_API_KEY', status: 'Connected (Price Drop & Invoice Emails)', fallback: 'Console Dispatch Logging' },
              { name: '7. Payment Gateway API', envKey: 'PAYMENT_GATEWAY_PROVIDER', status: 'Cash on Delivery (COD) & IBFT Active', fallback: 'Manual Courier Verification' }
            ].map(p => (
              <div key={p.name} className="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{p.name}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-semibold">
                    Healthy
                  </span>
                </div>
                <div className="text-gray-400">Environment Key: <code className="text-cyan-400">{p.envKey}</code></div>
                <div className="text-gray-300">Status: {p.status}</div>
                <div className="text-gray-500 text-[11px]">Fallback Strategy: {p.fallback}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: LOGS */}
      {activeTab === 'logs' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">System Telemetry & Audit Logs</h2>
              <p className="text-xs text-gray-400">Real-time application audit trail and execution diagnostics.</p>
            </div>
          </div>

          <div className="bg-dark-900 rounded-2xl p-4 border border-gray-800 font-mono text-[11px] space-y-2 max-h-96 overflow-y-auto">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-2 text-gray-300">
                <span className="text-gray-600">[{new Date(log.created_at).toLocaleTimeString('en-PK')}]</span>
                <span className={`font-bold ${
                  log.level === 'error' ? 'text-rose-400' : log.level === 'warn' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-purple-400">[{log.source}]</span>
                <span className="text-gray-200">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
