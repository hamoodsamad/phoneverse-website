import { NextResponse } from 'next/server';
import { smartphoneDataService } from '@/lib/integrations/smartphone-data';
import { priceTrackingService } from '@/lib/integrations/price-tracking';
import { dataRepository } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // 1. Sync newly announced smartphones
    const existing = await dataRepository.getSmartphones();
    const phoneResult = await smartphoneDataService.syncNewlyAnnouncedSmartphones(existing);

    // 2. Run scheduled retail price check
    const priceResult = await priceTrackingService.runScheduledPriceCheck();

    // 3. Log unified automation job
    await dataRepository.addAutomationJob({
      id: `cron-daily-${Date.now()}`,
      job_type: 'discover_phones',
      status: 'completed',
      scheduled_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      items_processed: phoneResult.itemsDiscovered + priceResult.pricesChecked,
      items_added: phoneResult.itemsAdded,
      items_updated: phoneResult.itemsUpdated + priceResult.priceDropsDetected,
      details: {
        source: 'vercel_hobby_daily_cron',
        phones: phoneResult,
        prices: priceResult
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Daily PhoneVerse synchronization executed successfully on Vercel Hobby scheduler.',
      smartphones: phoneResult,
      prices: priceResult
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
