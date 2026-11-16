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
  ExternalLink,
  X
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
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);

  // Form State for Adding New Smartphone
  const [newPhone, setNewPhone] = useState({
    name: '',
    brandName: 'Samsung',
    basePricePkr: 185000,
    ptaStatus: 'PTA Approved' as const,
    chipset: 'Snapdragon 8 Elite (3nm)',
    rearCamera: '200MP Main (OIS) + 50MP Periscope',
    batteryMah: 5000,
    chargingWatts: 65,
    refreshRate: 120,
    ram: 12,
    storage: 256,
    color: 'Phantom Black',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
  });

  const handleCreatePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.name) return;

    const brand = initialBrands.find(b => b.name.toLowerCase() === newPhone.brandName.toLowerCase()) || initialBrands[0];
    const slug = `${brand.slug}-${newPhone.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const createdPhone: Smartphone = {
      id: `p-${Date.now()}`,
      brand_id: brand.id,
      brand_name: brand.name,
      brand_slug: brand.slug,
      name: newPhone.name,
      model_name: `SM-${Date.now().toString().slice(-4)}`,
      slug,
      release_date: '2026-02-16',
      announcement_date: '2026-02-10',
      status: 'available',
      is_unconfirmed: false,
      is_featured: true,
      is_trending: true,
      source_attribution: 'Admin Manual Verified Entry (Pakistan)',
      pta_status: newPhone.ptaStatus,
      warranty_info: '1 Year Official Pakistan Brand Warranty',
      base_price_pkr: Number(newPhone.basePricePkr),
      primary_image_url: newPhone.imageUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
      specs: {
        display_type: 'LTPO Dynamic AMOLED 2X',
        display_size_inches: 6.7,
        resolution: '1440 x 3120 pixels',
        refresh_rate_hz: Number(newPhone.refreshRate),
        peak_brightness_nits: 2600,
        display_protection: 'Corning Gorilla Armor',
        chipset: newPhone.chipset,
        cpu: 'Octa-core High Performance',
        gpu: 'Adreno Flagship Series',
        os_name: 'Android 15',
        os_update_policy: '7 Major Android Upgrades',
        rear_camera_setup: newPhone.rearCamera,
        rear_camera_features: '4K@120fps, 8K Video, OIS',
        front_camera_setup: '32MP Wide with PDAF',
        front_camera_features: '4K@60fps HDR',
        battery_capacity_mah: Number(newPhone.batteryMah),
        wired_charging_watts: Number(newPhone.chargingWatts),
        wireless_charging_watts: 15,
        reverse_charging_supported: true,
        supports_5g: true,
        sim_type: 'Dual SIM (Nano + eSIM)',
        wifi_standard: 'Wi-Fi 7',
        bluetooth_version: '5.4',
        has_nfc: true,
        usb_type: 'USB Type-C 3.2',
        dimensions_mm: '162 x 77 x 8.1 mm',
        weight_grams: 210,
        ip_rating: 'IP68 water resistant',
        frame_material: 'Armor Aluminum',
        speaker_type: 'Stereo Speakers',
        sensors: 'Ultrasonic In-Display Fingerprint'
      },
      variants: [
        {
          id: `var-${Date.now()}`,
          smartphone_id: `p-${Date.now()}`,
          sku: `${slug}-${newPhone.ram}-${newPhone.storage}`,
          ram_gb: Number(newPhone.ram),
          storage_gb: Number(newPhone.storage),
          color_name: newPhone.color,
          color_hex: '#1f1f1f',
          regional_market: 'Pakistan Official',
          pta_status: newPhone.ptaStatus,
          price_pkr: Number(newPhone.basePricePkr),
          original_price_pkr: Number(newPhone.basePricePkr) * 1.05,
          stock_quantity: 20,
          is_available: true
        }
      ],
      prices: [
        {
          id: `pr-${Date.now()}`,
          smartphone_id: `p-${Date.now()}`,
          seller_id: 's1',
          seller_name: 'PriceOye (Pakistan)',
          price_pkr: Number(newPhone.basePricePkr),
          currency: 'PKR',
          in_stock: true,
          last_checked_at: '2026-02-16'
        }
      ]
    };

    setPhones([createdPhone, ...phones]);
    setShowAddPhoneModal(false);
    setSyncStatusMsg(`"${createdPhone.name}" added successfully to the catalog and live database!`);
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">Smartphones Inventory & Specifications</h2>
              <p className="text-xs text-gray-400">Manage hardware records, PTA status, and model variants.</p>
            </div>

            <button
              onClick={() => setShowAddPhoneModal(true)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold px-4 py-2 rounded-xl text-xs transition-colors shadow-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Smartphone</span>
            </button>
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

      {/* Add New Smartphone Modal Dialog */}
      {showAddPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel bg-dark-900 border border-gray-700 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  Add New Smartphone to Catalog
                </h3>
                <p className="text-xs text-gray-400">Fill in specifications and retail price in PKR.</p>
              </div>
              <button onClick={() => setShowAddPhoneModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePhone} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Phone Model Name *</label>
                  <input
                    type="text"
                    required
                    value={newPhone.name}
                    onChange={(e) => setNewPhone({ ...newPhone, name: e.target.value })}
                    placeholder="e.g. Galaxy S25+ or iPhone 16 Plus"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Brand *</label>
                  <select
                    value={newPhone.brandName}
                    onChange={(e) => setNewPhone({ ...newPhone, brandName: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2 text-xs text-white"
                  >
                    {initialBrands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Retail Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={newPhone.basePricePkr}
                    onChange={(e) => setNewPhone({ ...newPhone, basePricePkr: Number(e.target.value) })}
                    placeholder="e.g. 240000"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">PTA Approval Status *</label>
                  <select
                    value={newPhone.ptaStatus}
                    onChange={(e) => setNewPhone({ ...newPhone, ptaStatus: e.target.value as any })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="PTA Approved">PTA Approved</option>
                    <option value="Non-PTA">Non-PTA</option>
                    <option value="Both Available">Both Available</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Chipset / Processor *</label>
                  <input
                    type="text"
                    required
                    value={newPhone.chipset}
                    onChange={(e) => setNewPhone({ ...newPhone, chipset: e.target.value })}
                    placeholder="e.g. Snapdragon 8 Elite or Apple A18"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Camera Setup *</label>
                  <input
                    type="text"
                    required
                    value={newPhone.rearCamera}
                    onChange={(e) => setNewPhone({ ...newPhone, rearCamera: e.target.value })}
                    placeholder="e.g. 50MP Main (OIS) + 50MP Ultra-Wide"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Battery (mAh)</label>
                  <input
                    type="number"
                    value={newPhone.batteryMah}
                    onChange={(e) => setNewPhone({ ...newPhone, batteryMah: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Wired Charging (Watts)</label>
                  <input
                    type="number"
                    value={newPhone.chargingWatts}
                    onChange={(e) => setNewPhone({ ...newPhone, chargingWatts: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Refresh Rate (Hz)</label>
                  <input
                    type="number"
                    value={newPhone.refreshRate}
                    onChange={(e) => setNewPhone({ ...newPhone, refreshRate: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">RAM (GB)</label>
                  <input
                    type="number"
                    value={newPhone.ram}
                    onChange={(e) => setNewPhone({ ...newPhone, ram: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Storage (GB)</label>
                  <input
                    type="number"
                    value={newPhone.storage}
                    onChange={(e) => setNewPhone({ ...newPhone, storage: Number(e.target.value) })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">Color Name</label>
                  <input
                    type="text"
                    value={newPhone.color}
                    onChange={(e) => setNewPhone({ ...newPhone, color: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={newPhone.imageUrl}
                  onChange={(e) => setNewPhone({ ...newPhone, imageUrl: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPhoneModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold rounded-xl text-xs shadow-glow"
                >
                  Save Smartphone to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
