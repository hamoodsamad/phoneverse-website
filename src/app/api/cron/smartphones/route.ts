import { NextResponse } from 'next/server';
import { smartphoneDataService } from '@/lib/integrations/smartphone-data';
import { dataRepository } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const existing = await dataRepository.getSmartphones();
    const result = await smartphoneDataService.syncNewlyAnnouncedSmartphones(existing);

    await dataRepository.addAutomationJob({
      id: `cron-phone-${Date.now()}`,
      job_type: 'discover_phones',
      status: result.success ? 'completed' : 'failed',
      scheduled_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      items_processed: result.itemsDiscovered,
      items_added: result.itemsAdded,
      items_updated: result.itemsUpdated,
      details: { provider: result.provider }
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
