-- ============================================================================
-- PhoneVerse 2026: PostgreSQL Normalized Database Schema
-- Safe, Non-destructive, compatible with existing databases
-- ============================================================================

-- Extensions (if available)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'editor', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    logo_url TEXT,
    country_origin VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Smartphones Master Table
CREATE TABLE IF NOT EXISTS smartphones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    model_name VARCHAR(150),
    slug VARCHAR(250) UNIQUE NOT NULL,
    release_date DATE,
    announcement_date DATE,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('rumored', 'upcoming', 'available', 'discontinued')),
    is_unconfirmed BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    source_attribution VARCHAR(255) DEFAULT 'Official / Verified Data Source',
    pta_status VARCHAR(50) DEFAULT 'PTA Approved' CHECK (pta_status IN ('PTA Approved', 'Non-PTA', 'Both Available')),
    warranty_info TEXT DEFAULT '1 Year Official Brand Warranty',
    base_price_pkr NUMERIC(12, 2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Smartphone Specifications Table (Detailed Specs)
CREATE TABLE IF NOT EXISTS specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smartphone_id UUID UNIQUE NOT NULL REFERENCES smartphones(id) ON DELETE CASCADE,
    
    -- Display
    display_type VARCHAR(100),              -- e.g. LTPO Super Retina XDR OLED, Dynamic AMOLED 2X
    display_size_inches NUMERIC(4, 2),      -- e.g. 6.82
    resolution VARCHAR(100),               -- e.g. 1440 x 3120 pixels
    refresh_rate_hz INT,                   -- e.g. 120, 144, 165
    peak_brightness_nits INT,              -- e.g. 3000
    display_protection VARCHAR(150),       -- e.g. Corning Gorilla Armor, Ceramic Shield 2
    
    -- Hardware / Performance
    chipset VARCHAR(150),                  -- e.g. Qualcomm Snapdragon 8 Elite (3nm), Apple A18 Pro
    cpu VARCHAR(150),                      -- e.g. Octa-core (2x4.32 GHz Oryon & 6x3.53 GHz Oryon)
    gpu VARCHAR(150),                      -- e.g. Adreno 830, Apple 6-core GPU
    os_name VARCHAR(100),                  -- e.g. Android 15 / iOS 18
    os_update_policy VARCHAR(150),         -- e.g. 7 years of major OS upgrades
    
    -- Cameras
    rear_camera_setup VARCHAR(255),        -- e.g. 200MP Main (OIS) + 50MP Periscope (5x) + 50MP Ultra-Wide
    rear_camera_features TEXT,             -- e.g. 8K@30fps, 4K@120fps, Dolby Vision HDR, Laser AF
    front_camera_setup VARCHAR(255),       -- e.g. 50MP Wide with Autofocus
    front_camera_features TEXT,            -- e.g. 4K@60fps HDR
    
    -- Battery & Charging
    battery_capacity_mah INT,              -- e.g. 5500
    wired_charging_watts INT,              -- e.g. 100
    wireless_charging_watts INT,           -- e.g. 50
    reverse_charging_supported BOOLEAN DEFAULT FALSE,
    
    -- Connectivity
    supports_5g BOOLEAN DEFAULT TRUE,
    five_g_bands TEXT,
    sim_type VARCHAR(100),                 -- e.g. Dual Nano-SIM + eSIM
    wifi_standard VARCHAR(100),            -- e.g. Wi-Fi 7 (802.11be)
    bluetooth_version VARCHAR(50),         -- e.g. Bluetooth 5.4, aptX HD
    has_nfc BOOLEAN DEFAULT TRUE,
    usb_type VARCHAR(100),                 -- e.g. USB Type-C 3.2 Gen 2, DisplayPort
    
    -- Build & Audio
    dimensions_mm VARCHAR(100),            -- e.g. 162.8 x 77.6 x 8.2 mm
    weight_grams NUMERIC(6, 2),            -- e.g. 219.0
    ip_rating VARCHAR(50),                 -- e.g. IP68 dust/water resistant (up to 1.5m for 30 min)
    frame_material VARCHAR(100),           -- e.g. Grade 5 Titanium frame, Glass back
    speaker_type VARCHAR(100),             -- e.g. Dual Stereo Speakers with Dolby Atmos
    headphone_jack_3_5mm BOOLEAN DEFAULT FALSE,
    sensors TEXT,                          -- e.g. Ultrasonic Under-Display Fingerprint, Face ID, Gyro, Barometer
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Smartphone Variants Table (Colors, RAM, Storage, Regional PTA SKUs)
CREATE TABLE IF NOT EXISTS smartphone_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smartphone_id UUID NOT NULL REFERENCES smartphones(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    ram_gb INT NOT NULL,
    storage_gb INT NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    color_hex VARCHAR(20) DEFAULT '#000000',
    regional_market VARCHAR(100) DEFAULT 'Pakistan Official',
    pta_status VARCHAR(50) DEFAULT 'PTA Approved',
    price_pkr NUMERIC(12, 2) NOT NULL,
    original_price_pkr NUMERIC(12, 2),     -- For calculating price drops
    stock_quantity INT DEFAULT 10,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Smartphone Images Table (Cloudinary storage & metadata)
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smartphone_id UUID NOT NULL REFERENCES smartphones(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES smartphone_variants(id) ON DELETE SET NULL,
    cloudinary_public_id VARCHAR(255),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    view_type VARCHAR(50) DEFAULT 'front' CHECK (view_type IN ('front', 'back', 'side', 'angle', 'gallery', 'hero')),
    color_name VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    width INT,
    height INT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Image Sources / Tracking Table
CREATE TABLE IF NOT EXISTS image_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    source_name VARCHAR(100) NOT NULL,
    source_url TEXT,
    attribution_text TEXT,
    verification_status VARCHAR(50) DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Sellers / Merchants Table
CREATE TABLE IF NOT EXISTS sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    country VARCHAR(50) DEFAULT 'Pakistan',
    rating NUMERIC(3, 2) DEFAULT 4.8,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Smartphone Prices & Real-Time Price Tracking Table
CREATE TABLE IF NOT EXISTS prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smartphone_id UUID NOT NULL REFERENCES smartphones(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES smartphone_variants(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    price_pkr NUMERIC(12, 2) NOT NULL,
    previous_price_pkr NUMERIC(12, 2),
    currency VARCHAR(10) DEFAULT 'PKR',
    in_stock BOOLEAN DEFAULT TRUE,
    product_url TEXT,
    last_checked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Historical Price Records (For price charts & price drop alerts)
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smartphone_id UUID NOT NULL REFERENCES smartphones(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES smartphone_variants(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
    recorded_price_pkr NUMERIC(12, 2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Smartphone Comparisons Cache & Logs
CREATE TABLE IF NOT EXISTS comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_ids JSONB NOT NULL,               -- Array of smartphone UUIDs
    comparison_hash VARCHAR(64) UNIQUE,     -- MD5/SHA256 for caching
    ai_generated_report JSONB,              -- Categories, winners, pros/cons
    cached_until TIMESTAMPTZ,
    view_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. AI Recommendation Queries & Feedback
CREATE TABLE IF NOT EXISTS recommendation_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    budget_pkr NUMERIC(12, 2),
    preferred_brands JSONB,
    priority_needs JSONB,                  -- e.g. ['gaming', 'camera', 'battery']
    recommended_phone_ids JSONB,
    ai_reasoning TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Technology News & Articles
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE NOT NULL,
    summary TEXT,
    content TEXT,
    source_name VARCHAR(150),
    source_url TEXT,
    image_url TEXT,
    published_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT TRUE,
    related_smartphone_ids JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Reviews & Ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    smartphone_id UUID NOT NULL REFERENCES smartphones(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified_buyer BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. E-Commerce Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_province VARCHAR(100) NOT NULL, -- Punjab, Sindh, KPK, Balochistan, Islamabad, etc.
    postal_code VARCHAR(20),
    payment_method VARCHAR(50) DEFAULT 'cod' CHECK (payment_method IN ('cod', 'card', 'jazzcash', 'easypaisa', 'bank_transfer')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal_pkr NUMERIC(12, 2) NOT NULL,
    discount_pkr NUMERIC(12, 2) DEFAULT 0,
    shipping_fee_pkr NUMERIC(12, 2) DEFAULT 0,
    total_pkr NUMERIC(12, 2) NOT NULL,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    smartphone_id UUID NOT NULL REFERENCES smartphones(id),
    variant_id UUID REFERENCES smartphone_variants(id),
    product_name VARCHAR(255) NOT NULL,
    variant_details VARCHAR(255),          -- e.g. "16GB RAM + 512GB - Titanium Black (PTA Approved)"
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price_pkr NUMERIC(12, 2) NOT NULL,
    total_price_pkr NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. Coupons & Discounts
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_pkr')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_pkr NUMERIC(12, 2) DEFAULT 0,
    max_discount_pkr NUMERIC(12, 2),
    valid_from TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMPTZ,
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. API Provider Settings (Modular Configuration)
CREATE TABLE IF NOT EXISTS api_provider_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_type VARCHAR(100) UNIQUE NOT NULL, -- 'smartphone_specs', 'price_tracking', 'openai', 'image_search', 'cloudinary', 'email', 'payment'
    provider_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    configuration JSONB DEFAULT '{}'::jsonb,    -- Non-sensitive config params
    last_tested_at TIMESTAMPTZ,
    last_status VARCHAR(50) DEFAULT 'not_configured',
    error_message TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 19. Automation Jobs & Scheduled Tasks
CREATE TABLE IF NOT EXISTS automation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type VARCHAR(100) NOT NULL,             -- 'discover_phones', 'update_prices', 'sync_images', 'fetch_news'
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    scheduled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    items_processed INT DEFAULT 0,
    items_added INT DEFAULT 0,
    items_updated INT DEFAULT 0,
    details JSONB DEFAULT '{}'::jsonb,
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 20. System Logs
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    source VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR MAXIMUM HIGH-CONCURRENCY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_smartphones_brand ON smartphones(brand_id);
CREATE INDEX IF NOT EXISTS idx_smartphones_slug ON smartphones(slug);
CREATE INDEX IF NOT EXISTS idx_smartphones_status ON smartphones(status);
CREATE INDEX IF NOT EXISTS idx_smartphones_price ON smartphones(base_price_pkr);
CREATE INDEX IF NOT EXISTS idx_smartphones_featured ON smartphones(is_featured);
CREATE INDEX IF NOT EXISTS idx_smartphones_trending ON smartphones(is_trending);
CREATE INDEX IF NOT EXISTS idx_variants_phone ON smartphone_variants(smartphone_id);
CREATE INDEX IF NOT EXISTS idx_variants_price ON smartphone_variants(price_pkr);
CREATE INDEX IF NOT EXISTS idx_images_phone ON images(smartphone_id);
CREATE INDEX IF NOT EXISTS idx_prices_phone ON prices(smartphone_id);
CREATE INDEX IF NOT EXISTS idx_price_history_phone ON price_history(smartphone_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at, is_published);
CREATE INDEX IF NOT EXISTS idx_logs_created ON system_logs(created_at);
