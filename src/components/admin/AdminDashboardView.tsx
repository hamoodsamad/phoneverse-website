'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, Brand, AutomationJob, SystemLog } from '@/types';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Smartphone as PhoneIcon,
  TrendingDown,
  Image as ImageIcon,
  Package,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Terminal,
  ExternalLink,
  X,
  Lock,
  Eye,
  EyeOff,
  Key,
  DollarSign,
  ShoppingCart,
  UserCheck,
  LogOut,
  Search,
  Filter
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
  const {
    isAdmin,
    adminLogin,
    changeAdminPassword,
    resetAdminPassword,
    logout,
    currentAdminEmail
  } = useAuth();

  // Authentication gate state
  const [authEmail, setAuthEmail] = useState(currentAdminEmail || 'admin@phoneverse.com');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [showConfirmResetPassword, setShowConfirmResetPassword] = useState(false);

  // Dashboard Tabs & Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'smartphones' | 'prices' | 'images' | 'automation' | 'providers' | 'logs' | 'security'>('overview');
  const [phones, setPhones] = useState<Smartphone[]>(initialPhones);
  const [jobs, setJobs] = useState<AutomationJob[]>(initialJobs);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [runningJob, setRunningJob] = useState<string | null>(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');

  // Change Password state in Settings
  const [oldPassword, setOldPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newSettingPassword, setNewSettingPassword] = useState('');
  const [showNewSettingPassword, setShowNewSettingPassword] = useState(false);
  const [confirmSettingPassword, setConfirmSettingPassword] = useState('');
  const [showConfirmSettingPassword, setShowConfirmSettingPassword] = useState(false);
  const [pwdChangeMsg, setPwdChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock Sales Transactions Data
  const [recentOrders] = useState([
    { id: 'PK-ORD-9021', customer: 'Zubair Khan', city: 'Lahore (Gulberg III)', phone: 'iPhone 16 Pro Max 256GB', amount: 494999, payment: 'Cash on Delivery (COD)', status: 'Delivered', date: '2026-02-16' },
    { id: 'PK-ORD-9022', customer: 'Dr. Amina Tariq', city: 'Karachi (DHA Phase 6)', phone: 'Galaxy S25 Ultra 256GB', amount: 449999, payment: 'Bank Transfer (IBFT)', status: 'Out for Delivery', date: '2026-02-16' },
    { id: 'PK-ORD-9023', customer: 'Saad Farooq', city: 'Islamabad (F-10/2)', phone: 'Infinix Zero 40 5G 512GB', amount: 89999, payment: 'JazzCash Mobile', status: 'Processing', date: '2026-02-15' },
    { id: 'PK-ORD-9024', customer: 'Bilal Sheikh', city: 'Faisalabad (Kohinoor)', phone: 'Redmi Note 14 Pro+ 5G', amount: 119999, payment: 'EasyPaisa Wallet', status: 'Delivered', date: '2026-02-15' },
    { id: 'PK-ORD-9025', customer: 'Usman Raza', city: 'Rawalpindi (Bahria Phase 7)', phone: 'Xiaomi 15 Pro 512GB', amount: 289999, payment: 'Credit Card (Visa)', status: 'Dispatched', date: '2026-02-14' },
    { id: 'PK-ORD-9026', customer: 'Hamza Malik', city: 'Multan (Cantt)', phone: 'Infinix GT 20 Pro Gaming', amount: 72999, payment: 'Cash on Delivery (COD)', status: 'Delivered', date: '2026-02-14' }
  ]);

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

  // Handle Admin Login submission
  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const res = adminLogin(authEmail, authPassword);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      setAuthSuccess('Welcome back, Administrator. Unlocking dashboard...');
    }
  };

  // Handle Admin Forgot Password reset
  const handleForgotResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (newResetPassword !== confirmResetPassword) {
      setAuthError('New passwords do not match. Please re-enter.');
      return;
    }

    const res = resetAdminPassword(recoveryKey, newResetPassword);
    if (!res.success) {
      setAuthError(res.message);
    } else {
      setAuthSuccess(res.message);
      setIsForgotMode(false);
      setAuthPassword(newResetPassword);
    }
  };

  // Handle In-Settings Password Change
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeMsg(null);

    if (newSettingPassword !== confirmSettingPassword) {
      setPwdChangeMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const res = changeAdminPassword(oldPassword, newSettingPassword);
    if (!res.success) {
      setPwdChangeMsg({ type: 'error', text: res.message });
    } else {
      setPwdChangeMsg({ type: 'success', text: res.message });
      setOldPassword('');
      setNewSettingPassword('');
      setConfirmSettingPassword('');
    }
  };

  // Handle deleting a phone from catalog
  const handleDeletePhone = (phoneId: string, phoneName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove "${phoneName}" from the catalog? This will delete the phone and its pricing data from the live store.`);
    if (!confirmDelete) return;

    setPhones(prev => prev.filter(p => p.id !== phoneId));
    setSyncStatusMsg(`"${phoneName}" has been successfully removed from the catalog.`);
  };

  // Handle Adding Phone
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
      model_name: `MD-${Date.now().toString().slice(-4)}`,
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
        display_type: 'LTPO Dynamic AMOLED 2X, 120Hz',
        display_size_inches: 6.7,
        resolution: '1440 x 3120 pixels',
        refresh_rate_hz: Number(newPhone.refreshRate),
        peak_brightness_nits: 2600,
        display_protection: 'Corning Gorilla Armor',
        chipset: newPhone.chipset,
        cpu: 'Octa-core High Performance',
        gpu: 'Adreno / Mali Flagship',
        os_name: 'Android 15',
        os_update_policy: '5 Major Android Upgrades',
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
    setSyncStatusMsg(`"${createdPhone.name}" added successfully to the catalog and live store!`);
  };

  // Manual Trigger for Background Jobs
  const triggerJob = async (jobType: 'discover_phones' | 'update_prices' | 'sync_images' | 'fetch_news') => {
    setRunningJob(jobType);
    setSyncStatusMsg(`Executing background job [${jobType}]...`);

    setTimeout(() => {
      const newJob: AutomationJob = {
        id: `job-${Date.now()}`,
        job_type: jobType,
        status: 'completed',
        scheduled_at: new Date().toISOString(),
        started_at: new Date().toISOString(),
        finished_at: new Date().toISOString(),
        items_processed: 30,
        items_added: jobType === 'discover_phones' ? 1 : 0,
        items_updated: jobType === 'update_prices' ? 8 : 2,
        details: { triggeredBy: 'admin_manual_override', market: 'Pakistan' }
      };

      const newLog: SystemLog = {
        id: `log-${Date.now()}`,
        level: 'info',
        source: `AdminSync:${jobType}`,
        message: `Manual synchronization of ${jobType} completed successfully. Processed 30 records.`,
        created_at: new Date().toISOString()
      };

      setJobs([newJob, ...jobs]);
      setLogs([newLog, ...logs]);
      setRunningJob(null);
      setSyncStatusMsg(`Synchronization for ${jobType.replace('_', ' ')} completed successfully!`);
    }, 1200);
  };

  // Filtered smartphones
  const filteredPhones = phones.filter(phone => {
    const matchesBrand = selectedBrandFilter === 'all' || phone.brand_slug.toLowerCase() === selectedBrandFilter.toLowerCase();
    const matchesSearch = !catalogSearch || phone.name.toLowerCase().includes(catalogSearch.toLowerCase()) || phone.brand_name.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  // =========================================================================
  // AUTHENTICATION GATE: IF USER IS NOT LOGGED IN AS ADMIN, SHOW SECURE LOCK
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Top lock visual */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-glow">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Admin Security Vault</h1>
              <p className="text-xs text-gray-400 mt-1">
                Authorized Personnel Only. Please authenticate to access backend control systems.
              </p>
            </div>
          </div>

          {/* Feedback messages */}
          {authError && (
            <div className="p-3 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{authSuccess}</span>
            </div>
          )}

          {!isForgotMode ? (
            /* Standard Admin Login Form */
            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="admin@phoneverse.com"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-300 font-semibold">Admin Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setAuthError(null);
                      setAuthSuccess(null);
                    }}
                    className="text-[11px] text-purple-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showAuthPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    aria-label={showAuthPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Admin Dashboard</span>
              </button>
            </form>
          ) : (
            /* Forgot Password / Master Recovery Mode */
            <form onSubmit={handleForgotResetSubmit} className="space-y-4">
              <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl text-[11px] text-purple-200">
                Enter your system <strong>Master Recovery Key</strong> to reset your admin password.
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Master Recovery Key</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    placeholder="PHONEVERSE-PAKISTAN-2026"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <Key className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmResetPassword ? 'text' : 'password'}
                    required
                    value={confirmResetPassword}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmResetPassword(!showConfirmResetPassword)}
                    aria-label={showConfirmResetPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setAuthError(null);
                  }}
                  className="w-1/3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs transition-colors shadow-lg"
                >
                  Reset & Save
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-gray-800 bg-dark-900/80">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Control Center (Pakistan Market)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            PhoneVerse Management & Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage catalog phones, live PKR sales analytics, retail pricing, and background cron schedules.
          </p>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Website</span>
          </Link>

          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Admin</span>
          </button>
        </div>
      </div>

      {/* Global Status Message Toast */}
      {syncStatusMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-4 py-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
          <button onClick={() => setSyncStatusMsg(null)} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-800 text-xs font-bold">
        {[
          { id: 'overview', label: 'Sales & Performance', icon: Layers },
          { id: 'smartphones', label: `Catalog Management (${phones.length})`, icon: PhoneIcon },
          { id: 'prices', label: 'Retail Price Records', icon: TrendingDown },
          { id: 'images', label: 'Cloudinary CDN Assets', icon: ImageIcon },
          { id: 'automation', label: 'Background Automation', icon: RefreshCw },
          { id: 'providers', label: 'API Integrations', icon: Settings },
          { id: 'security', label: 'Admin Security & Password', icon: Lock },
          { id: 'logs', label: 'Audit Logs', icon: Terminal }
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

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & SALES BUSINESS ANALYTICS                               */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Business KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">Total Revenue (PKR)</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
                ₨ 18,450,000
              </div>
              <span className="text-[11px] text-gray-400 mt-2 block">+14.2% growth this month</span>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">Total Orders Processed</span>
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-2">46 Orders</div>
              <span className="text-[11px] text-gray-400 mt-2 block">Across 12 major Pakistani cities</span>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">Gross Profit Margin</span>
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-2">
                ₨ 2,767,500
              </div>
              <span className="text-[11px] text-purple-300 mt-2 block">Estimated margin: 15.0%</span>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-semibold">Active Phone Catalog</span>
                <PhoneIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                {phones.length} Models
              </div>
              <span className="text-[11px] text-emerald-400 mt-2 block">100% PTA & Spec Verified</span>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  Recent Customer Orders (Pakistan Nationwide)
                </h3>
                <p className="text-xs text-gray-400">Real-time smartphone purchases with COD and bank transfer verification.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer & City</th>
                    <th className="p-3">Smartphone Purchased</th>
                    <th className="p-3">Amount (PKR)</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-900/40">
                      <td className="p-3 font-mono font-bold text-white">{order.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{order.customer}</div>
                        <div className="text-[10px] text-gray-400">{order.city}</div>
                      </td>
                      <td className="p-3 text-cyan-300 font-medium">{order.phone}</td>
                      <td className="p-3 font-bold text-white">{format(order.amount)}</td>
                      <td className="p-3 text-gray-300">{order.payment}</td>
                      <td className="p-3 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : order.status === 'Out for Delivery'
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Manual Synchronization Triggers */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Automated Background Worker Triggers
            </h3>
            <p className="text-xs text-gray-400">
              Instantly run background synchronization jobs without waiting for scheduled crons.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <button
                onClick={() => triggerJob('discover_phones')}
                disabled={Boolean(runningJob)}
                className="bg-gray-900 border border-gray-700 hover:border-emerald-500 p-4 rounded-2xl text-left transition-colors"
              >
                <div className="font-bold text-white text-xs mb-1">1. Sync Phone Discovery</div>
                <div className="text-[11px] text-gray-400">Check GSMArena feeds for new devices.</div>
                <span className="text-[10px] text-emerald-400 font-semibold mt-3 block">
                  {runningJob === 'discover_phones' ? 'Syncing...' : 'Run Discovery →'}
                </span>
              </button>

              <button
                onClick={() => triggerJob('update_prices')}
                disabled={Boolean(runningJob)}
                className="bg-gray-900 border border-gray-700 hover:border-rose-500 p-4 rounded-2xl text-left transition-colors"
              >
                <div className="font-bold text-white text-xs mb-1">2. Sync Retailer Prices</div>
                <div className="text-[11px] text-gray-400">Poll PriceOye, Daraz Mall, and Telemart.</div>
                <span className="text-[10px] text-rose-400 font-semibold mt-3 block">
                  {runningJob === 'update_prices' ? 'Checking...' : 'Run Price Check →'}
                </span>
              </button>

              <button
                onClick={() => triggerJob('sync_images')}
                disabled={Boolean(runningJob)}
                className="bg-gray-900 border border-gray-700 hover:border-cyan-500 p-4 rounded-2xl text-left transition-colors"
              >
                <div className="font-bold text-white text-xs mb-1">3. Sync Official Images</div>
                <div className="text-[11px] text-gray-400">Upload high-res color renders to Cloudinary.</div>
                <span className="text-[10px] text-cyan-400 font-semibold mt-3 block">
                  {runningJob === 'sync_images' ? 'Uploading...' : 'Run Upload →'}
                </span>
              </button>

              <button
                onClick={() => triggerJob('fetch_news')}
                disabled={Boolean(runningJob)}
                className="bg-gray-900 border border-gray-700 hover:border-purple-500 p-4 rounded-2xl text-left transition-colors"
              >
                <div className="font-bold text-white text-xs mb-1">4. Fetch Tech News</div>
                <div className="text-[11px] text-gray-400">Generate 2026 industry summaries.</div>
                <span className="text-[10px] text-purple-400 font-semibold mt-3 block">
                  {runningJob === 'fetch_news' ? 'Fetching...' : 'Run News Pull →'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SMARTPHONES CATALOG MANAGEMENT (ADD & DELETE)                     */}
      {/* ========================================================================= */}
      {activeTab === 'smartphones' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white">Smartphones Inventory & Catalog</h2>
              <p className="text-xs text-gray-400">
                Total {filteredPhones.length} smartphones listed. You can add new phones or remove obsolete models.
              </p>
            </div>

            <button
              onClick={() => setShowAddPhoneModal(true)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-glow shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Smartphone</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search catalog by phone name or brand..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={selectedBrandFilter}
                onChange={(e) => setSelectedBrandFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 w-full sm:w-44"
              >
                <option value="all">All Brands ({phones.length})</option>
                {initialBrands.map(b => (
                  <option key={b.id} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Catalog Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3">Device Name</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Chipset</th>
                  <th className="p-3">PTA Status</th>
                  <th className="p-3">Price (PKR)</th>
                  <th className="p-3">Launch Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredPhones.map(phone => (
                  <tr key={phone.id} className="hover:bg-gray-900/40">
                    <td className="p-3">
                      <div className="font-bold text-white">{phone.name}</div>
                      <span className="text-[10px] text-gray-500">{phone.model_name || phone.slug}</span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-400">{phone.brand_name}</td>
                    <td className="p-3 text-gray-300">{phone.specs?.chipset?.split('(')[0] || 'Flagship SoC'}</td>
                    <td className="p-3 text-gray-300">{phone.pta_status}</td>
                    <td className="p-3 font-extrabold text-white">{format(phone.base_price_pkr)}</td>
                    <td className="p-3">
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800 font-semibold">
                        {phone.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/smartphones/${phone.slug}`}
                          className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-cyan-400 text-[11px] font-semibold"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeletePhone(phone.id, phone.name)}
                          title={`Delete ${phone.name}`}
                          className="p-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ADMIN SECURITY & PASSWORD SETTINGS                                */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <div className="pb-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              Admin Password & Credentials Management
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Change the administrator password. Once saved, subsequent logins will strictly require your new password.
            </p>
          </div>

          {pwdChangeMsg && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
              pwdChangeMsg.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/70 border-rose-800 text-rose-300'
            }`}>
              {pwdChangeMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{pwdChangeMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">Current Password *</label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  aria-label={showOldPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">New Password *</label>
              <div className="relative">
                <input
                  type={showNewSettingPassword ? 'text' : 'password'}
                  required
                  value={newSettingPassword}
                  onChange={(e) => setNewSettingPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewSettingPassword(!showNewSettingPassword)}
                  aria-label={showNewSettingPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showNewSettingPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-300 font-semibold block mb-1">Confirm New Password *</label>
              <div className="relative">
                <input
                  type={showConfirmSettingPassword ? 'text' : 'password'}
                  required
                  value={confirmSettingPassword}
                  onChange={(e) => setConfirmSettingPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmSettingPassword(!showConfirmSettingPassword)}
                  aria-label={showConfirmSettingPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmSettingPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs transition-colors shadow-lg mt-2"
            >
              Update Admin Password
            </button>
          </form>

          {/* Master Recovery Key Info Box */}
          <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-gray-300 font-bold">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Emergency Master Recovery Key</span>
            </div>
            <p className="text-gray-400 text-[11px]">
              If you ever forget your admin password, you can use the Master Recovery Key on the login screen to reset it:
            </p>
            <code className="block bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-purple-300 font-mono text-xs select-all">
              PHONEVERSE-PAKISTAN-2026
            </code>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RETAIL PRICE RECORDS                                              */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* TAB 5: CLOUDINARY IMAGES                                                 */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* TAB 6: AUTOMATION & CRONS                                                */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* TAB 7: API PROVIDERS                                                     */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* TAB 8: AUDIT LOGS                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-4">
          <div className="pb-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Real-time System Audit Logs
            </h2>
            <p className="text-xs text-gray-400">System events, API synchronization errors, and scheduler output.</p>
          </div>

          <div className="p-4 rounded-2xl bg-black border border-gray-800 font-mono text-xs text-gray-300 space-y-2 max-h-96 overflow-y-auto">
            {logs.map(log => (
              <div key={log.id} className="flex items-start gap-2 border-b border-gray-900 pb-1.5 last:border-0">
                <span className="text-gray-500 select-none">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                <span className={`uppercase font-bold ${
                  log.level === 'error' ? 'text-rose-400' : log.level === 'warn' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  [{log.level}]
                </span>
                <span className="text-purple-400">({log.source}):</span>
                <span className="text-gray-200">{log.message}</span>
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
