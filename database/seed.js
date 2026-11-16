/**
 * PhoneVerse 2026 - Master Database Seeder
 * Populates verified Pakistani smartphone specifications, prices, sellers, variants, news & users.
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const brandsData = [
  { name: 'Apple', slug: 'apple', country: 'United States', website: 'https://www.apple.com', description: 'Global technology leader known for iPhone, iOS, and premium hardware innovation.' },
  { name: 'Samsung', slug: 'samsung', country: 'South Korea', website: 'https://www.samsung.com', description: 'World leader in mobile technology, Dynamic AMOLED displays, and Galaxy smartphones.' },
  { name: 'Xiaomi', slug: 'xiaomi', country: 'China', website: 'https://www.mi.com', description: 'Innovative tech giant offering high-end flagship and value-packed HyperOS devices.' },
  { name: 'Google Pixel', slug: 'google-pixel', country: 'United States', website: 'https://store.google.com', description: 'Pure Android experience powered by Google Tensor G-series and leading computational photography.' },
  { name: 'OnePlus', slug: 'oneplus', country: 'China', website: 'https://www.oneplus.com', description: 'Never Settle: flagship performance with OxygenOS and ultra-fast SUPERVOOC charging.' },
  { name: 'Vivo', slug: 'vivo', country: 'China', website: 'https://www.vivo.com', description: 'Pioneers in mobile portrait and optical photography with ZEISS co-engineered systems.' },
  { name: 'Realme', slug: 'realme', country: 'China', website: 'https://www.realme.com', description: 'Daring leap forward with youth-centric high performance and rapid charging smartphones.' },
  { name: 'Infinix', slug: 'infinix', country: 'Hong Kong / Pakistan', website: 'https://www.infinixmobility.com', description: 'Top market-share brand in Pakistan offering extreme value, gaming processors, and bold styling.' },
  { name: 'Tecno', slug: 'tecno', country: 'Hong Kong / Pakistan', website: 'https://www.tecno-mobile.com', description: 'Innovative leader in stylish camera phones, foldable flagships, and accessible technology.' },
  { name: 'POCO', slug: 'poco', country: 'China', website: 'https://www.po.co', description: 'Speed and gaming powerhouse delivering maximum raw processing power per rupee.' },
  { name: 'Motorola', slug: 'motorola', country: 'United States', website: 'https://www.motorola.com', description: 'Clean near-stock Android software with iconic Razr flip devices and Edge series.' },
  { name: 'Honor', slug: 'honor', country: 'China', website: 'https://www.honor.com', description: 'MagicOS ecosystem with aerospace-grade ultra-thin foldables and eye-comfort OLED displays.' }
];

const sellersData = [
  { name: 'PriceOye', slug: 'priceoye', website_url: 'https://priceoye.pk', rating: 4.8 },
  { name: 'Daraz Official Mall', slug: 'daraz', website_url: 'https://www.daraz.pk', rating: 4.7 },
  { name: 'Telemart', slug: 'telemart', website_url: 'https://www.telemart.pk', rating: 4.6 },
  { name: 'Shophive', slug: 'shophive', website_url: 'https://www.shophive.com', rating: 4.5 },
  { name: 'Official Brand Store (Pakistan)', slug: 'official-store', website_url: 'https://store.official.pk', rating: 4.9 }
];

const phonesData = [
  {
    brandSlug: 'apple',
    name: 'iPhone 16 Pro Max',
    model_name: 'A3296',
    slug: 'iphone-16-pro-max',
    release_date: '2024-09-20',
    announcement_date: '2024-09-09',
    status: 'available',
    is_unconfirmed: false,
    is_featured: true,
    is_trending: true,
    pta_status: 'PTA Approved',
    warranty_info: '1 Year Mercantile / Official Apple Warranty',
    base_price_pkr: 494999,
    specs: {
      display_type: 'LTPO Super Retina XDR OLED, 120Hz ProMotion, HDR10, Dolby Vision',
      display_size_inches: 6.9,
      resolution: '1320 x 2868 pixels (~460 ppi)',
      refresh_rate_hz: 120,
      peak_brightness_nits: 2000,
      display_protection: 'Ceramic Shield (2024 Gen), Grade 5 Titanium Frame',
      chipset: 'Apple A18 Pro (3nm second-gen)',
      cpu: 'Hexa-core (2x4.04 GHz performance + 4 efficiency)',
      gpu: 'Apple 6-core GPU with hardware ray tracing',
      os_name: 'iOS 18 (Apple Intelligence ready)',
      os_update_policy: 'Minimum 6-7 years of major iOS upgrades',
      rear_camera_setup: '48MP Main (Sensor-shift OIS) + 48MP Ultra-Wide + 12MP 5x Periscope Telephoto',
      rear_camera_features: '4K@120fps Dolby Vision HDR, ProRes, Spatial Audio, Camera Control Button',
      front_camera_setup: '12MP Wide TrueDepth with PDAF & OIS',
      front_camera_features: '4K@60fps Dolby Vision, Cinematic Mode',
      battery_capacity_mah: 4685,
      wired_charging_watts: 30,
      wireless_charging_watts: 25,
      reverse_charging_supported: true,
      supports_5g: true,
      sim_type: 'Dual eSIM / Nano-SIM + eSIM',
      wifi_standard: 'Wi-Fi 7 (802.11be)',
      bluetooth_version: '5.3, A2DP, LE',
      has_nfc: true,
      usb_type: 'USB Type-C 3.2 Gen 2 (10Gbps), DisplayPort',
      dimensions_mm: '163.0 x 77.6 x 8.25 mm',
      weight_grams: 227.0,
      ip_rating: 'IP68 dust/water resistant (up to 6m for 30 min)',
      frame_material: 'Titanium Grade 5 Frame, Matte Glass Back',
      speaker_type: 'Stereo Speakers with Spatial Audio',
      sensors: 'Face ID, LiDAR Scanner, Barometer, Gyro, Emergency SOS via satellite'
    },
    variants: [
      { ram_gb: 8, storage_gb: 256, color_name: 'Desert Titanium', color_hex: '#c29d84', price_pkr: 494999, original_price_pkr: 529999, pta_status: 'PTA Approved' },
      { ram_gb: 8, storage_gb: 512, color_name: 'Natural Titanium', color_hex: '#989792', price_pkr: 549999, original_price_pkr: 579999, pta_status: 'PTA Approved' },
      { ram_gb: 8, storage_gb: 1024, color_name: 'Black Titanium', color_hex: '#2b2b2b', price_pkr: 619999, original_price_pkr: 649999, pta_status: 'PTA Approved' }
    ]
  },
  {
    brandSlug: 'samsung',
    name: 'Galaxy S25 Ultra',
    model_name: 'SM-S938B',
    slug: 'galaxy-s25-ultra',
    release_date: '2025-01-22',
    announcement_date: '2025-01-22',
    status: 'available',
    is_unconfirmed: false,
    is_featured: true,
    is_trending: true,
    pta_status: 'PTA Approved',
    warranty_info: '1 Year Samsung Pakistan Official Warranty',
    base_price_pkr: 449999,
    specs: {
      display_type: 'Dynamic AMOLED 2X, 120Hz, HDR10+, Anti-Reflective Armor',
      display_size_inches: 6.86,
      resolution: '1440 x 3120 pixels (~500 ppi)',
      refresh_rate_hz: 120,
      peak_brightness_nits: 3000,
      display_protection: 'Corning Gorilla Armor 2, Titanium Frame',
      chipset: 'Qualcomm Snapdragon 8 Elite for Galaxy (3nm)',
      cpu: 'Octa-core (2x4.47 GHz Oryon + 6x3.53 GHz Oryon)',
      gpu: 'Adreno 830',
      os_name: 'Android 15 with One UI 7',
      os_update_policy: '7 Major Android OS upgrades & 7 years security patches',
      rear_camera_setup: '200MP Main (OIS) + 50MP Periscope (5x OIS) + 50MP Telephoto (3x OIS) + 50MP Ultra-Wide',
      rear_camera_features: '8K@30fps, 4K@120fps, Laser AF, Super Steady video, Galaxy AI 2.0',
      front_camera_setup: '12MP Dual Pixel with PDAF',
      front_camera_features: '4K@60fps, Auto-HDR',
      battery_capacity_mah: 5000,
      wired_charging_watts: 45,
      wireless_charging_watts: 15,
      reverse_charging_supported: true,
      supports_5g: true,
      sim_type: 'Dual Nano-SIM + eSIM',
      wifi_standard: 'Wi-Fi 7 (802.11be)',
      bluetooth_version: '5.4, A2DP, LE',
      has_nfc: true,
      usb_type: 'USB Type-C 3.2 Gen 1, OTG, Samsung DeX',
      dimensions_mm: '162.8 x 77.6 x 8.2 mm',
      weight_grams: 219.0,
      ip_rating: 'IP68 dust/water resistant (up to 1.5m for 30 min)',
      frame_material: 'Titanium Frame, Gorilla Glass Victus 2 Back, Built-in S-Pen',
      speaker_type: 'Stereo Speakers tuned by AKG with Dolby Atmos',
      sensors: 'Ultrasonic Under-Display Fingerprint, Accelerometer, Gyro, Barometer, UWB support'
    },
    variants: [
      { ram_gb: 12, storage_gb: 256, color_name: 'Titanium Silverblue', color_hex: '#8494a8', price_pkr: 449999, original_price_pkr: 479999, pta_status: 'PTA Approved' },
      { ram_gb: 16, storage_gb: 512, color_name: 'Titanium Black', color_hex: '#212121', price_pkr: 499999, original_price_pkr: 529999, pta_status: 'PTA Approved' }
    ]
  },
  {
    brandSlug: 'xiaomi',
    name: 'Xiaomi 15 Pro',
    model_name: '24101PNB7C',
    slug: 'xiaomi-15-pro',
    release_date: '2024-10-31',
    announcement_date: '2024-10-29',
    status: 'available',
    is_unconfirmed: false,
    is_featured: true,
    is_trending: true,
    pta_status: 'PTA Approved',
    warranty_info: '1 Year Xiaomi Pakistan Official Warranty',
    base_price_pkr: 244999,
    specs: {
      display_type: 'LTPO OLED, 68B colors, 120Hz, Dolby Vision, HDR10+',
      display_size_inches: 6.73,
      resolution: '1440 x 3200 pixels (~522 ppi)',
      refresh_rate_hz: 120,
      peak_brightness_nits: 3200,
      display_protection: 'Xiaomi Dragon Crystal Glass 2.0',
      chipset: 'Qualcomm Snapdragon 8 Elite (3nm)',
      cpu: 'Octa-core (2x4.32 GHz Oryon & 6x3.53 GHz)',
      gpu: 'Adreno 830',
      os_name: 'HyperOS 2 (Android 15)',
      os_update_policy: '5 Major Android updates & 6 years security',
      rear_camera_setup: '50MP Main (OmniVision 1/1.31" OIS) + 50MP Periscope (5x OIS) + 50MP Ultra-Wide with Leica Summilux lens',
      rear_camera_features: '8K@30fps, 4K@60fps HDR10+, Leica photographic styles',
      front_camera_setup: '32MP Wide with HDR',
      front_camera_features: '4K@60fps Dolby Vision',
      battery_capacity_mah: 6100,
      wired_charging_watts: 90,
      wireless_charging_watts: 50,
      reverse_charging_supported: true,
      supports_5g: true,
      sim_type: 'Dual Nano-SIM',
      wifi_standard: 'Wi-Fi 7 (802.11be)',
      bluetooth_version: '5.4, LHDC 5, aptX Lossless',
      has_nfc: true,
      usb_type: 'USB Type-C 3.2 Gen 2',
      dimensions_mm: '161.3 x 75.3 x 8.35 mm',
      weight_grams: 213.0,
      ip_rating: 'IP68 dust/water resistant (up to 1.5m for 30 min)',
      frame_material: 'Aluminum alloy frame, Glass back',
      speaker_type: 'Stereo Speakers with Hi-Res Wireless Audio',
      sensors: 'Ultrasonic In-Display Fingerprint, Infrared port, Color Spectrum, Gyro'
    },
    variants: [
      { ram_gb: 12, storage_gb: 256, color_name: 'Rock Gray', color_hex: '#5c5f63', price_pkr: 244999, original_price_pkr: 269999, pta_status: 'PTA Approved' },
      { ram_gb: 16, storage_gb: 512, color_name: 'Spruce Green', color_hex: '#2e433a', price_pkr: 279999, original_price_pkr: 299999, pta_status: 'PTA Approved' }
    ]
  },
  {
    brandSlug: 'google-pixel',
    name: 'Google Pixel 9 Pro XL',
    model_name: 'G187C',
    slug: 'google-pixel-9-pro-xl',
    release_date: '2024-08-22',
    announcement_date: '2024-08-13',
    status: 'available',
    is_unconfirmed: false,
    is_featured: true,
    is_trending: true,
    pta_status: 'Both Available',
    warranty_info: '1 Year International / Local Distributor Warranty',
    base_price_pkr: 329999,
    specs: {
      display_type: 'Super Actua LTPO OLED, 120Hz, HDR10+',
      display_size_inches: 6.8,
      resolution: '1344 x 2992 pixels (~486 ppi)',
      refresh_rate_hz: 120,
      peak_brightness_nits: 3000,
      display_protection: 'Corning Gorilla Glass Victus 2',
      chipset: 'Google Tensor G4 (4nm)',
      cpu: 'Octa-core (1x3.1 GHz Cortex-X4 & 3x2.6 GHz & 4x1.92 GHz)',
      gpu: 'Mali-G715 MC7',
      os_name: 'Android 15 (Gemini Nano on-device AI)',
      os_update_policy: '7 years of OS, security, and Pixel Feature Drops',
      rear_camera_setup: '50MP Main (1/1.31" OIS) + 48MP 5x Periscope (OIS) + 48MP Ultra-Wide with Macro Focus',
      rear_camera_features: '8K@30fps Video Boost, Night Sight Video, Best Take, Magic Editor',
      front_camera_setup: '42MP Ultra-Wide with Autofocus',
      front_camera_features: '4K@60fps, Auto-HDR',
      battery_capacity_mah: 5060,
      wired_charging_watts: 37,
      wireless_charging_watts: 23,
      reverse_charging_supported: true,
      supports_5g: true,
      sim_type: 'Nano-SIM and eSIM',
      wifi_standard: 'Wi-Fi 7 (802.11be)',
      bluetooth_version: '5.3, aptX HD',
      has_nfc: true,
      usb_type: 'USB Type-C 3.2',
      dimensions_mm: '162.8 x 76.6 x 8.5 mm',
      weight_grams: 221.0,
      ip_rating: 'IP68 dust/water resistant (up to 1.5m for 30 min)',
      frame_material: 'Polished aerospace aluminum frame, Matte glass back',
      speaker_type: 'Stereo Speakers with Spatial Audio',
      sensors: 'Ultrasonic In-display Fingerprint, Skin Temperature Sensor, UWB'
    },
    variants: [
      { ram_gb: 16, storage_gb: 128, color_name: 'Obsidian', color_hex: '#1f2022', price_pkr: 329999, original_price_pkr: 359999, pta_status: 'PTA Approved' },
      { ram_gb: 16, storage_gb: 256, color_name: 'Porcelain', color_hex: '#f5f4ef', price_pkr: 364999, original_price_pkr: 389999, pta_status: 'PTA Approved' }
    ]
  },
  {
    brandSlug: 'infinix',
    name: 'Infinix Zero 40 5G',
    model_name: 'X6861',
    slug: 'infinix-zero-40-5g',
    release_date: '2024-09-08',
    announcement_date: '2024-08-29',
    status: 'available',
    is_unconfirmed: false,
    is_featured: false,
    is_trending: true,
    pta_status: 'PTA Approved',
    warranty_info: '1 Year Carlcare Pakistan Official Warranty',
    base_price_pkr: 69999,
    specs: {
      display_type: 'Curved AMOLED, 1B colors, 144Hz, 1300 nits peak',
      display_size_inches: 6.78,
      resolution: '1080 x 2436 pixels (~393 ppi)',
      refresh_rate_hz: 144,
      peak_brightness_nits: 1300,
      display_protection: 'Corning Gorilla Glass 5',
      chipset: 'MediaTek Dimensity 8200 Ultimate (4nm)',
      cpu: 'Octa-core (1x3.1 GHz Cortex-A78 & 3x3.0 GHz & 4x2.0 GHz)',
      gpu: 'Mali-G610 MC6',
      os_name: 'Android 14, upgradable to Android 16 (XOS 14.5)',
      os_update_policy: '2 Major Android upgrades & 3 years security patches',
      rear_camera_setup: '108MP Main (OIS) + 50MP Ultra-Wide (120°) + 2MP Depth',
      rear_camera_features: '4K@60fps, GoPro mode integration, Dual LED Flash',
      front_camera_setup: '50MP Wide with PDAF and dual micro flash',
      front_camera_features: '4K@60fps Vlog Mode',
      battery_capacity_mah: 5000,
      wired_charging_watts: 45,
      wireless_charging_watts: 20,
      reverse_charging_supported: true,
      supports_5g: true,
      sim_type: 'Dual Nano-SIM',
      wifi_standard: 'Wi-Fi 6E (802.11ax)',
      bluetooth_version: '5.2, A2DP, LE',
      has_nfc: true,
      usb_type: 'USB Type-C 2.0, OTG',
      dimensions_mm: '164.3 x 74.5 x 7.9 mm',
      weight_grams: 195.0,
      ip_rating: 'IP54 splash and dust resistant',
      frame_material: 'Plastic frame, Glass or Eco-Leather back',
      speaker_type: 'Dual Stereo Speakers tuned by JBL',
      sensors: 'Under-Display Optical Fingerprint, Gyro, Compass'
    },
    variants: [
      { ram_gb: 12, storage_gb: 256, color_name: 'Violet Garden', color_hex: '#897594', price_pkr: 69999, original_price_pkr: 74999, pta_status: 'PTA Approved' },
      { ram_gb: 12, storage_gb: 512, color_name: 'Moving Titanium', color_hex: '#6b6e70', price_pkr: 76999, original_price_pkr: 82999, pta_status: 'PTA Approved' }
    ]
  },
  {
    brandSlug: 'vivo',
    name: 'Vivo X200 Pro',
    model_name: 'V2413A',
    slug: 'vivo-x200-pro',
    release_date: '2024-10-19',
    announcement_date: '2024-10-14',
    status: 'available',
    is_unconfirmed: false,
    is_featured: true,
    is_trending: true,
    pta_status: 'PTA Approved',
    warranty_info: '1 Year Vivo Pakistan Official Warranty',
    base_price_pkr: 284999,
    specs: {
      display_type: 'LTPO AMOLED, 1B colors, 120Hz, Dolby Vision, HDR10+',
      display_size_inches: 6.78,
      resolution: '1260 x 2800 pixels (~452 ppi)',
      refresh_rate_hz: 120,
      peak_brightness_nits: 4500,
      display_protection: 'Armor Glass / Schott Xensation',
      chipset: 'MediaTek Dimensity 9400 (3nm)',
      cpu: 'Octa-core (1x3.63 GHz Cortex-X925 & 3x3.3 GHz & 4x2.4 GHz)',
      gpu: 'Immortalis-G925',
      os_name: 'Funtouch 15 / OriginOS 5 (Android 15)',
      os_update_policy: '4 Major Android upgrades & 5 years security patches',
      rear_camera_setup: '50MP Main (Sony LYT-818 1/1.28" OIS) + 200MP ZEISS APO Telephoto (85mm OIS) + 50MP Ultra-Wide',
      rear_camera_features: '8K@30fps, 4K@120fps Cinema Portrait, ZEISS T* Coating, Vivo V3+ Imaging Chip',
      front_camera_setup: '32MP Wide with HDR',
      front_camera_features: '4K@60fps HDR',
      battery_capacity_mah: 6000,
      wired_charging_watts: 90,
      wireless_charging_watts: 30,
      reverse_charging_supported: true,
      supports_5g: true,
      sim_type: 'Dual Nano-SIM + eSIM',
      wifi_standard: 'Wi-Fi 7 (802.11be)',
      bluetooth_version: '5.4, aptX HD, LHDC',
      has_nfc: true,
      usb_type: 'USB Type-C 3.2 Gen 1',
      dimensions_mm: '162.4 x 76.0 x 8.2 mm',
      weight_grams: 223.0,
      ip_rating: 'IP68 / IP69 dust & high-pressure water resistant',
      frame_material: 'Aluminum frame, Glass back',
      speaker_type: 'Stereo Speakers with Hi-Res 24-bit audio',
      sensors: 'Under-Display Ultrasonic Fingerprint, Color Spectrum, Laser AF'
    },
    variants: [
      { ram_gb: 16, storage_gb: 512, color_name: 'Sapphire Blue', color_hex: '#1e3d59', price_pkr: 284999, original_price_pkr: 309999, pta_status: 'PTA Approved' },
      { ram_gb: 16, storage_gb: 1024, color_name: 'Titanium Grey', color_hex: '#474b4e', price_pkr: 319999, original_price_pkr: 349999, pta_status: 'PTA Approved' }
    ]
  }
];

const newsArticlesData = [
  {
    title: 'Snapdragon 8 Elite Benchmark Records Shattered: Next-Gen Flagships Lead in Pakistan',
    slug: 'snapdragon-8-elite-benchmark-records-shattered-2026',
    summary: 'Qualcomm’s custom Oryon CPU architecture delivers a 45% multi-core jump and 40% GPU enhancement, reshaping competitive mobile gaming in South Asia.',
    content: 'The launch of Snapdragon 8 Elite flagships across Pakistan has set unprecedented gaming benchmark scores exceeding 3,000,000 points on AnTuTu v10. Real-world testing shows sustained 120 FPS in AAA titles with 30% lower thermal throttling due to 3nm process node efficiencies.',
    source_name: 'TechRadar & MobileTech Pakistan',
    source_url: 'https://example.com/news/snapdragon-8-elite',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    published_at: new Date('2026-02-10')
  },
  {
    title: 'PTA Mobile Tax Reductions and Installment Plans Boost 5G Adoption in Islamabad and Lahore',
    slug: 'pta-mobile-tax-reductions-installment-plans-pakistan',
    summary: 'Federal authorities announce revised DIRBS tariff bands and easy 0% mark-up installment frameworks for certified 5G smartphones.',
    content: 'To accelerate digital transformation and telecom 5G spectrum rollouts, PTA along with major retail financing partners has introduced streamlined IMEI registrations and interest-free installment tenures up to 24 months for compliant handsets.',
    source_name: 'Dawn Tech / ProPakistani',
    source_url: 'https://example.com/news/pta-tax-update',
    image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
    published_at: new Date('2026-02-14')
  },
  {
    title: 'Periscope Zoom Breakthrough: How 200MP Sensors are Changing Mobile Concert Photography',
    slug: 'periscope-zoom-200mp-sensors-concert-photography',
    summary: 'From Vivo to Samsung, new prism optics and generative AI super-resolution allow clear stage portraits even from 30x digital zoom.',
    content: 'Mobile photography enthusiasts in Pakistan are experiencing a leap in telephoto capability. Groundbreaking quad-reflection periscope modules paired with AI edge enhancement produce clean, noise-free shots in dim lighting conditions.',
    source_name: 'GSMArena & Photography Weekly',
    source_url: 'https://example.com/news/periscope-zoom-2026',
    image_url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
    published_at: new Date('2026-02-15')
  }
];

async function seedDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL environment variable is not set. Seed script halted.');
    return;
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to database. Beginning safe seed transaction...');
    await client.query('BEGIN');

    // 1. Seed Users (Admin & Demo Customer)
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@PhoneVerse2026', salt);
    const customerPasswordHash = await bcrypt.hash('Customer@2026', salt);

    await client.query(`
      INSERT INTO users (email, password_hash, full_name, role)
      VALUES 
        ('admin@phoneverse.com', $1, 'System Administrator', 'super_admin'),
        ('customer@phoneverse.com', $2, 'Pakistani Tech Enthusiast', 'customer')
      ON CONFLICT (email) DO NOTHING;
    `, [adminPasswordHash, customerPasswordHash]);
    console.log('  ✔️ Users seeded.');

    // 2. Seed Brands
    const brandMap = new Map();
    for (const b of brandsData) {
      const res = await client.query(`
        INSERT INTO brands (name, slug, country_origin, website, description)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
        RETURNING id, slug;
      `, [b.name, b.slug, b.country, b.website, b.description]);
      brandMap.set(b.slug, res.rows[0].id);
    }
    console.log(`  ✔️ ${brandMap.size} Brands seeded.`);

    // 3. Seed Sellers
    const sellerMap = new Map();
    for (const s of sellersData) {
      const res = await client.query(`
        INSERT INTO sellers (name, slug, website_url, rating)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
        RETURNING id, slug;
      `, [s.name, s.slug, s.website_url, s.rating]);
      sellerMap.set(s.slug, res.rows[0].id);
    }
    console.log(`  ✔️ ${sellerMap.size} Sellers seeded.`);

    // 4. Seed Smartphones, Specs, Variants, Images, and Price History
    for (const phone of phonesData) {
      const brandId = brandMap.get(phone.brandSlug);
      if (!brandId) continue;

      const pRes = await client.query(`
        INSERT INTO smartphones (
          brand_id, name, model_name, slug, release_date, announcement_date,
          status, is_unconfirmed, is_featured, is_trending, pta_status,
          warranty_info, base_price_pkr
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (slug) DO UPDATE SET 
          base_price_pkr = EXCLUDED.base_price_pkr,
          is_featured = EXCLUDED.is_featured,
          is_trending = EXCLUDED.is_trending
        RETURNING id;
      `, [
        brandId, phone.name, phone.model_name, phone.slug, phone.release_date,
        phone.announcement_date, phone.status, phone.is_unconfirmed, phone.is_featured,
        phone.is_trending, phone.pta_status, phone.warranty_info, phone.base_price_pkr
      ]);
      const phoneId = pRes.rows[0].id;

      // Specifications
      const s = phone.specs;
      await client.query(`
        INSERT INTO specifications (
          smartphone_id, display_type, display_size_inches, resolution, refresh_rate_hz,
          peak_brightness_nits, display_protection, chipset, cpu, gpu, os_name,
          os_update_policy, rear_camera_setup, rear_camera_features, front_camera_setup,
          front_camera_features, battery_capacity_mah, wired_charging_watts,
          wireless_charging_watts, reverse_charging_supported, supports_5g, sim_type,
          wifi_standard, bluetooth_version, has_nfc, usb_type, dimensions_mm,
          weight_grams, ip_rating, frame_material, speaker_type, sensors
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
          $29, $30, $31, $32
        )
        ON CONFLICT (smartphone_id) DO UPDATE SET
          chipset = EXCLUDED.chipset,
          rear_camera_setup = EXCLUDED.rear_camera_setup,
          battery_capacity_mah = EXCLUDED.battery_capacity_mah;
      `, [
        phoneId, s.display_type, s.display_size_inches, s.resolution, s.refresh_rate_hz,
        s.peak_brightness_nits, s.display_protection, s.chipset, s.cpu, s.gpu, s.os_name,
        s.os_update_policy, s.rear_camera_setup, s.rear_camera_features, s.front_camera_setup,
        s.front_camera_features, s.battery_capacity_mah, s.wired_charging_watts,
        s.wireless_charging_watts, s.reverse_charging_supported, s.supports_5g, s.sim_type,
        s.wifi_standard, s.bluetooth_version, s.has_nfc, s.usb_type, s.dimensions_mm,
        s.weight_grams, s.ip_rating, s.frame_material, s.speaker_type, s.sensors
      ]);

      // Variants
      for (const v of phone.variants) {
        const sku = `${phone.slug}-${v.ram_gb}-${v.storage_gb}-${v.color_name.toLowerCase().replace(/\s+/g, '-')}`;
        const vRes = await client.query(`
          INSERT INTO smartphone_variants (
            smartphone_id, sku, ram_gb, storage_gb, color_name, color_hex,
            price_pkr, original_price_pkr, pta_status
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (sku) DO UPDATE SET price_pkr = EXCLUDED.price_pkr
          RETURNING id;
        `, [
          phoneId, sku, v.ram_gb, v.storage_gb, v.color_name, v.color_hex,
          v.price_pkr, v.original_price_pkr, v.pta_status
        ]);
        const variantId = vRes.rows[0].id;

        // Seed prices across sellers
        for (const [sellerSlug, sellerId] of sellerMap.entries()) {
          const delta = sellerSlug === 'priceoye' ? -2000 : (sellerSlug === 'daraz' ? 1000 : 0);
          const sellerPrice = Number(v.price_pkr) + delta;
          await client.query(`
            INSERT INTO prices (smartphone_id, variant_id, seller_id, price_pkr, previous_price_pkr)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT DO NOTHING;
          `, [phoneId, variantId, sellerId, sellerPrice, v.original_price_pkr]);

          // Price history points
          await client.query(`
            INSERT INTO price_history (smartphone_id, variant_id, seller_id, recorded_price_pkr, recorded_at)
            VALUES 
              ($1, $2, $3, $4, NOW() - INTERVAL '30 days'),
              ($1, $2, $3, $5, NOW() - INTERVAL '15 days'),
              ($1, $2, $3, $6, NOW());
          `, [phoneId, variantId, sellerId, Number(v.original_price_pkr), Number(v.price_pkr) + 1500, sellerPrice]);
        }
      }
    }
    console.log('  ✔️ Smartphones, specs, variants, prices & history seeded.');

    // 5. Seed News
    for (const news of newsArticlesData) {
      await client.query(`
        INSERT INTO news_articles (title, slug, summary, content, source_name, source_url, image_url, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO NOTHING;
      `, [news.title, news.slug, news.summary, news.content, news.source_name, news.source_url, news.image_url, news.published_at]);
    }
    console.log('  ✔️ News articles seeded.');

    // 6. Seed Coupons
    await client.query(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order_pkr, max_discount_pkr)
      VALUES 
        ('WELCOME2026', 'percentage', 5.0, 50000, 10000),
        ('PAKISTAN5000', 'fixed_pkr', 5000, 100000, 5000)
      ON CONFLICT (code) DO NOTHING;
    `);
    console.log('  ✔️ Promotional discount coupons seeded.');

    await client.query('COMMIT');
    console.log('🎉 Database seeding completed successfully!');
    client.release();
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await pool.end();
  }
}

seedDatabase();
