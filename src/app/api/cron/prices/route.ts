import { NextResponse } from 'next/server';
import { priceTrackingService } from '@/lib/integrations/price-tracking';
import { dataRepository } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const result = await priceTrackingService.runScheduledPriceCheck();

    await dataRepository.addAutomationJob({
      id: `cron-price-${Date.now()}`,
      job_type: 'update_prices',
      status: result.success ? 'completed' : 'failed',
      scheduled_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      items_processed: result.pricesChecked,
      items_added: 0,
      items_updated: result.priceDropsDetected,
      details: { currency: 'PKR', provider: result.provider }
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
