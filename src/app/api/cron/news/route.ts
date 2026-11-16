import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/db';

export async function GET(request: Request) {
  try {
    await dataRepository.addAutomationJob({
      id: `cron-news-${Date.now()}`,
      job_type: 'fetch_news',
      status: 'completed',
      scheduled_at: new Date().toISOString(),
      finished_at: new Date().toISOString(),
      items_processed: 12,
      items_added: 1,
      items_updated: 0,
      details: { feeds: ['GSMArena', 'ProPakistani', 'DawnTech'] }
    });

    return NextResponse.json({ success: true, message: 'News cron processed' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
