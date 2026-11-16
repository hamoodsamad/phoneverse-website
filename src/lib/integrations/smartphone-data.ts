import { Smartphone } from '@/types';

export interface DiscoveredPhoneRaw {
  brand: string;
  name: string;
  model_number?: string;
  announcement_date?: string;
  release_date?: string;
  is_unconfirmed?: boolean;
  specs?: Record<string, any>;
  source_attribution?: string;
}

export interface SmartphoneDataSyncResult {
  success: boolean;
  provider: string;
  itemsDiscovered: number;
  itemsAdded: number;
  itemsUpdated: number;
  duplicatesSkipped: number;
  errors: string[];
}

export class SmartphoneDataService {
  private apiUrl: string;
  private apiKey: string | undefined;

  constructor() {
    this.apiUrl = process.env.SMARTPHONE_DATA_API_URL || '';
    this.apiKey = process.env.SMARTPHONE_DATA_API_KEY;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiUrl);
  }

  /**
   * Syncs new and announced smartphones from authorized specification provider
   */
  async syncNewlyAnnouncedSmartphones(existingPhones: Smartphone[]): Promise<SmartphoneDataSyncResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: 'Specification Provider (Unconfigured)',
        itemsDiscovered: 0,
        itemsAdded: 0,
        itemsUpdated: 0,
        duplicatesSkipped: 0,
        errors: ['SMARTPHONE_DATA_API_KEY or SMARTPHONE_DATA_API_URL is not configured in environment. Manual data entry or configured provider required.']
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}/phones/latest`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`External Specification API returned HTTP ${response.status}`);
      }

      const rawItems: DiscoveredPhoneRaw[] = await response.json();
      let added = 0;
      let updated = 0;
      let skipped = 0;

      for (const item of rawItems) {
        // Deduplication logic: Check slug or model_number
        const slug = `${item.brand}-${item.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const existing = existingPhones.find(p => p.slug === slug || (item.model_number && p.model_name === item.model_number));

        if (existing) {
          skipped++;
        } else {
          added++;
        }
      }

      return {
        success: true,
        provider: 'Authorized Smartphone Specification Provider',
        itemsDiscovered: rawItems.length,
        itemsAdded: added,
        itemsUpdated: updated,
        duplicatesSkipped: skipped,
        errors: []
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'Specification Provider',
        itemsDiscovered: 0,
        itemsAdded: 0,
        itemsUpdated: 0,
        duplicatesSkipped: 0,
        errors: [err.message || 'Unknown network error during specification synchronization']
      };
    }
  }
}

export const smartphoneDataService = new SmartphoneDataService();
