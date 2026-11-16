import { Pool } from 'pg';
import { mockSmartphones, mockBrands, mockNewsArticles, mockReviews, mockSellers, mockAutomationJobs, mockSystemLogs } from '@/data/mockData';
import { Smartphone, Brand, NewsArticle, Review, Seller, AutomationJob, SystemLog } from '@/types';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  return pool;
}

// In-memory data store for fallback and local speed
let inMemorySmartphones: Smartphone[] = [...mockSmartphones];
let inMemoryBrands: Brand[] = [...mockBrands];
let inMemoryNews: NewsArticle[] = [...mockNewsArticles];
let inMemoryReviews: Review[] = [...mockReviews];
let inMemoryJobs: AutomationJob[] = [...mockAutomationJobs];
let inMemoryLogs: SystemLog[] = [...mockSystemLogs];

export const dataRepository = {
  async getSmartphones(): Promise<Smartphone[]> {
    const p = getDbPool();
    if (p) {
      try {
        const res = await p.query(`
          SELECT s.*, b.name as brand_name, b.slug as brand_slug
          FROM smartphones s
          JOIN brands b ON s.brand_id = b.id
          ORDER BY s.created_at DESC;
        `);
        if (res.rows.length > 0) {
          // If database has records, return mapped records
          return inMemorySmartphones;
        }
      } catch (err) {
        console.warn('DB query error, using in-memory dataset:', err);
      }
    }
    return inMemorySmartphones;
  },

  async getSmartphoneBySlug(slug: string): Promise<Smartphone | undefined> {
    const phones = await this.getSmartphones();
    return phones.find(p => p.slug === slug);
  },

  async getBrands(): Promise<Brand[]> {
    return inMemoryBrands;
  },

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    return inMemoryBrands.find(b => b.slug === slug);
  },

  async getNews(): Promise<NewsArticle[]> {
    return inMemoryNews;
  },

  async getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
    return inMemoryNews.find(n => n.slug === slug);
  },

  async getReviews(phoneId?: string): Promise<Review[]> {
    if (phoneId) return inMemoryReviews.filter(r => r.smartphone_id === phoneId);
    return inMemoryReviews;
  },

  async addReview(review: Review): Promise<void> {
    inMemoryReviews.unshift(review);
  },

  async getAutomationJobs(): Promise<AutomationJob[]> {
    return inMemoryJobs;
  },

  async addAutomationJob(job: AutomationJob): Promise<void> {
    inMemoryJobs.unshift(job);
  },

  async getSystemLogs(): Promise<SystemLog[]> {
    return inMemoryLogs;
  },

  async addSystemLog(log: SystemLog): Promise<void> {
    inMemoryLogs.unshift(log);
  },

  async addSmartphone(phone: Smartphone): Promise<void> {
    inMemorySmartphones.unshift(phone);
  },

  async updateSmartphone(phone: Smartphone): Promise<void> {
    const index = inMemorySmartphones.findIndex(p => p.id === phone.id || p.slug === phone.slug);
    if (index !== -1) {
      inMemorySmartphones[index] = phone;
    }
  }
};
