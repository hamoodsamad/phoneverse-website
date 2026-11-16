# PhoneVerse 2026 - Deployment Guide

This document provides step-by-step instructions for deploying PhoneVerse on **Vercel** (Frontend & Serverless API Routes) and cloud infrastructure for the **Rust Axum Backend** and **PostgreSQL Database**.

---

## 1. Frontend & Serverless Deployment on Vercel

### Step 1: Push Project to GitHub
Push this codebase to your GitHub repository:
```bash
git init
git add .
git commit -m "feat: initial PhoneVerse release"
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New** > **Project** and select your GitHub repository.
3. Keep the default settings:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `next build`
   - Output Directory: `.next`

### Step 3: Configure Environment Variables in Vercel
Add the following keys in **Settings** > **Environment Variables**:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | Platform Name | `PhoneVerse 2026` |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | Default Currency | `PKR` |
| `NEXT_PUBLIC_PRIMARY_MARKET` | Market Region | `Pakistan` |
| `NEXT_PUBLIC_PORTFOLIO_URL` | Back to Portfolio Link | `https://my-portfolio-ten-zeta-3wnea5nse7.vercel.app/` |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET` | 32+ character authentication secret | `your-secure-jwt-secret-key-32-chars` |
| `CRON_SECRET` | Vercel Cron protection secret | `your-cron-secret-2026` |
| `OPENAI_API_KEY` | Optional OpenAI API Key (GPT-4o) | `sk-...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Account Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary Secret | `abc...` |
| `PAYMENT_GATEWAY_PROVIDER` | Active Payment Provider | `cod` |

### Step 4: Vercel Cron Jobs Verification
`vercel.json` is configured with 3 automatic scheduled tasks:
* `0 2 * * *`: Smartphone Discovery (`/api/cron/smartphones`)
* `0 */4 * * *`: Retailer Price Tracker (`/api/cron/prices`)
* `30 */6 * * *`: Technology News Feed Collection (`/api/cron/news`)

Vercel activates these automatically upon deployment.

---

## 2. Rust Axum Backend Deployment

If you wish to run the persistent Rust REST API backend on cloud infrastructure:

### Option A: Fly.io Deployment
```bash
cd backend-rust
fly launch
fly deploy
```

### Option B: Render Deployment
1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Choose **Docker** as the runtime environment.
4. Set the Docker context to `./backend-rust`.
5. Connect your `DATABASE_URL` and `JWT_SECRET` environment variables.

---

## 3. PostgreSQL Database Hosting

Compatible managed PostgreSQL providers:
* **Neon.tech**: Serverless PostgreSQL with instant autoscaling.
* **Supabase**: Managed PostgreSQL with SSL enabled.
* **AWS RDS / DigitalOcean Managed DB**: High-throughput database clusters.

Run migrations against your remote database from your computer:
```bash
DATABASE_URL="postgres://user:password@remote-host:5432/dbname?sslmode=require" npm run db:migrate
DATABASE_URL="postgres://user:password@remote-host:5432/dbname?sslmode=require" npm run db:seed
```
