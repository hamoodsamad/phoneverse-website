# PhoneVerse 2026: AI-Powered Smartphone Discovery, Comparison, Price Tracking & E-Commerce Platform

PhoneVerse is a production-ready, commercial-grade smartphone technology and e-commerce platform built for 2026. Designed for international audiences with **Pakistan as the primary market** and **PKR (₨) as the default currency**, it provides real-time retail price tracking, verified PTA Approved status, deep hardware silicon comparisons, and OpenAI GPT-4o recommendations.

---

## 🌟 Key Features

1. **2026 Premium Design & UI/UX**:
   - Modern glassmorphism aesthetic with responsive layouts for mobile, tablet, and desktop.
   - Interactive flagship showcase with hardware specs switcher.
   - Live global search with instant autocomplete.
   - Real-time multi-currency switcher (**PKR default**, USD, EUR, AED, GBP, SAR).

2. **Smartphone Discovery & Verified Data Collection**:
   - Covers all major brands: Apple, Samsung, Google Pixel, Xiaomi, Redmi, POCO, Infinix, Tecno, Vivo, OPPO, OnePlus, Realme, Motorola, Huawei, Honor, Sony, Nokia.
   - Automatic detection of new and rumored smartphones with deduplication.
   - Unconfirmed specifications and leaks clearly tagged with a "Rumored" badge.

3. **Complete Technical Specifications**:
   - Chipset (Snapdragon 8 Elite, A18 Pro, Dimensity 9400), CPU, GPU, OS update policies.
   - Display type (LTPO OLED, Dynamic AMOLED 2X, 120Hz/144Hz, peak brightness nits).
   - Camera optics (Main, Periscope zoom, Ultra-wide, 4K/8K video features).
   - Battery & fast charging (mAh, wired/wireless wattage).
   - Pakistan PTA approval status (PTA Approved, Non-PTA, Both Available).
   - Multiple RAM, storage, and official color variants per device.

4. **Automated Price Tracking in Pakistan (PKR)**:
   - Tracks retailer prices across PriceOye, Daraz Mall, Telemart, Shophive, and official brand stores.
   - Chronological historical price logs, lowest and highest recorded prices.
   - Automatic percentage price drop calculations and email price drop alert subscriptions.

5. **AI Smartphone Comparison**:
   - Powered by OpenAI GPT-4o with deterministic hardware rule engine fallback.
   - Compares 2 to 4 devices across optics, gaming silicon, battery endurance, and value for money in PKR.
   - Highlights category winners, key advantages (pros), and drawbacks (cons).

6. **AI Smartphone Recommendation Wizard**:
   - Interactive questionnaire assessing maximum PKR budget, usage priorities (gaming, photography, battery, compact), minimum RAM, and 5G needs.
   - Recommends real smartphones from the catalog with compatibility scores and reasoning.

7. **Automated Technology News**:
   - Curated news articles and AI-generated summaries with full source attribution.

8. **Full E-Commerce Portal**:
   - Persistent Cart & Wishlist with local storage.
   - Coupon promo code engine (`WELCOME2026`, `PAKISTAN5000`).
   - Pakistan nationwide checkout with all provinces and major cities.
   - Modular payment options: **Cash on Delivery (COD)**, Direct Bank Transfer (IBFT), and Mobile Wallets (JazzCash / EasyPaisa).
   - Order tracking with parcel consignment tracking numbers.

9. **Secure Admin Dashboard**:
   - Overview metrics, smartphone catalog management, price modifier, Cloudinary asset viewer.
   - Manual synchronization buttons to run background phone discovery, price updates, image uploads, and news collection on demand.
   - System audit telemetry logs and API provider status indicators.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React.
* **Backend**: Rust with Axum REST API server (`backend-rust/`).
* **Database**: PostgreSQL (Normalized 20-table schema with safe non-destructive migration runner).
* **AI Engine**: OpenAI API (GPT-4o) with deterministic rule-based fallback.
* **Image Management**: Cloudinary API with responsive CDN transformations (`f_auto,q_auto,w_*`).
* **Background Automation**: Vercel Cron Jobs (`vercel.json`) & Tokio asynchronous workers.
* **Deployment**: Frontend deployable on **Vercel**; Backend deployable via Docker on **Fly.io** or **Render**.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* Node.js v18+ (tested on Node.js v26.13)
* npm v9+

### 2. Installation
```bash
# Clone the repository
git clone <your-github-repo-url>
cd "mobile website"

# Install frontend dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Database Setup & Non-Destructive Migrations
Before applying migrations, you can inspect your existing PostgreSQL database:
```bash
npm run db:inspect
```
Run the safe, non-destructive migration (uses `CREATE TABLE IF NOT EXISTS`):
```bash
npm run db:migrate
```
Seed verified Pakistani market smartphones, PKR prices, PTA status, and coupons:
```bash
npm run db:seed
```

### 5. Running the Application
```bash
# Start local development server
npm run dev

# Or build and launch production server
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

### 6. Demo Accounts for Instant Testing
* **Admin Access**: `admin@phoneverse.com` (password: `Admin@PhoneVerse2026` or use 1-click button on `/account`)
* **Customer Access**: `customer@phoneverse.com` (password: `Customer@2026` or use 1-click button on `/account`)

---

## 📦 Pushing to GitHub

To push this entire project to your GitHub repository:

```bash
git init
git add .
git commit -m "feat: complete PhoneVerse 2026 smartphone platform"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```
