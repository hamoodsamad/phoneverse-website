export type SmartphoneStatus = 'rumored' | 'upcoming' | 'available' | 'discontinued';
export type PtaStatus = 'PTA Approved' | 'Non-PTA' | 'Both Available';
export type UserRole = 'customer' | 'editor' | 'admin' | 'super_admin';
export type CurrencyCode = 'PKR' | 'USD' | 'EUR' | 'AED' | 'GBP' | 'SAR';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  country_origin?: string;
  website?: string;
  description?: string;
  phone_count?: number;
}

export interface SmartphoneSpecifications {
  id?: string;
  smartphone_id?: string;
  display_type: string;
  display_size_inches: number;
  resolution: string;
  refresh_rate_hz: number;
  peak_brightness_nits: number;
  display_protection: string;
  chipset: string;
  cpu: string;
  gpu: string;
  os_name: string;
  os_update_policy: string;
  rear_camera_setup: string;
  rear_camera_features: string;
  front_camera_setup: string;
  front_camera_features: string;
  battery_capacity_mah: number;
  wired_charging_watts: number;
  wireless_charging_watts: number;
  reverse_charging_supported: boolean;
  supports_5g: boolean;
  sim_type: string;
  wifi_standard: string;
  bluetooth_version: string;
  has_nfc: boolean;
  usb_type: string;
  dimensions_mm: string;
  weight_grams: number;
  ip_rating: string;
  frame_material: string;
  speaker_type: string;
  headphone_jack_3_5mm?: boolean;
  sensors: string;
}

export interface SmartphoneVariant {
  id: string;
  smartphone_id: string;
  sku: string;
  ram_gb: number;
  storage_gb: number;
  color_name: string;
  color_hex: string;
  regional_market: string;
  pta_status: PtaStatus;
  price_pkr: number;
  original_price_pkr?: number;
  stock_quantity: number;
  is_available: boolean;
}

export interface SmartphoneImage {
  id: string;
  smartphone_id: string;
  variant_id?: string;
  cloudinary_public_id?: string;
  url: string;
  thumbnail_url?: string;
  view_type: 'front' | 'back' | 'side' | 'angle' | 'gallery' | 'hero';
  color_name?: string;
  is_primary: boolean;
}

export interface Seller {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  is_verified: boolean;
  country: string;
  rating: number;
}

export interface PriceRecord {
  id: string;
  smartphone_id: string;
  variant_id?: string;
  seller_id: string;
  seller_name: string;
  seller_logo?: string;
  price_pkr: number;
  previous_price_pkr?: number;
  currency: string;
  in_stock: boolean;
  product_url?: string;
  last_checked_at: string;
}

export interface PriceHistoryItem {
  id: string;
  smartphone_id: string;
  recorded_price_pkr: number;
  recorded_at: string;
  seller_name?: string;
}

export interface Smartphone {
  id: string;
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  name: string;
  model_name?: string;
  slug: string;
  release_date?: string;
  announcement_date?: string;
  status: SmartphoneStatus;
  is_unconfirmed: boolean;
  is_featured: boolean;
  is_trending: boolean;
  source_attribution: string;
  pta_status: PtaStatus;
  warranty_info: string;
  base_price_pkr: number;
  original_price_pkr?: number;
  primary_image_url: string;
  images?: SmartphoneImage[];
  specs?: SmartphoneSpecifications;
  variants?: SmartphoneVariant[];
  prices?: PriceRecord[];
  price_history?: PriceHistoryItem[];
  created_at?: string;
  updated_at?: string;
}

export interface ComparisonCategoryWinner {
  category: string;
  winnerPhoneId: string;
  reason: string;
}

export interface ComparisonResult {
  phones: Smartphone[];
  categoryWinners: ComparisonCategoryWinner[];
  overallWinnerId: string;
  aiAnalysis: {
    summary: string;
    cameraComparison: string;
    gamingComparison: string;
    batteryComparison: string;
    valueForMoneyVerdict: string;
    bestForGamingId: string;
    bestForPhotographyId: string;
    bestForBatteryId: string;
    bestValueId: string;
  };
  prosAndCons: Record<string, { pros: string[]; cons: string[] }>;
  isAiGenerated: boolean;
}

export interface RecommendationRequest {
  budget_pkr: number;
  preferred_brand?: string;
  usage_priorities: ('gaming' | 'camera' | 'battery' | 'daily' | 'compact' | 'premium_build')[];
  minimum_ram_gb?: number;
  minimum_storage_gb?: number;
  needs_5g?: boolean;
}

export interface RecommendedPhone {
  phone: Smartphone;
  matchScore: number;
  recommendationReason: string;
  keyStrengths: string[];
}

export interface RecommendationResponse {
  recommendations: RecommendedPhone[];
  aiReasoning: string;
  isAiGenerated: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  source_name: string;
  source_url: string;
  image_url: string;
  published_at: string;
  related_smartphones?: { id: string; name: string; slug: string }[];
}

export interface Review {
  id: string;
  smartphone_id: string;
  author_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_buyer: boolean;
  created_at: string;
}

export interface CartItem {
  id: string; // unique item key
  smartphone: Smartphone;
  variant: SmartphoneVariant;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  smartphone_id: string;
  variant_id?: string;
  product_name: string;
  variant_details: string;
  quantity: number;
  unit_price_pkr: number;
  total_price_pkr: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  postal_code?: string;
  payment_method: 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal_pkr: number;
  discount_pkr: number;
  shipping_fee_pkr: number;
  total_pkr: number;
  tracking_number?: string;
  items: OrderItem[];
  created_at: string;
}

export interface Coupon {
  code: string;
  discount_type: 'percentage' | 'fixed_pkr';
  discount_value: number;
  min_order_pkr: number;
  max_discount_pkr?: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  is_active: boolean;
}

export interface AutomationJob {
  id: string;
  job_type: 'discover_phones' | 'update_prices' | 'sync_images' | 'fetch_news';
  status: 'pending' | 'running' | 'completed' | 'failed';
  scheduled_at: string;
  started_at?: string;
  finished_at?: string;
  items_processed: number;
  items_added: number;
  items_updated: number;
  details?: Record<string, any>;
  error_log?: string;
}

export interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  source: string;
  message: string;
  metadata?: Record<string, any>;
  created_at: string;
}
