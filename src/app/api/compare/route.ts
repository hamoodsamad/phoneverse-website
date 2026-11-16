import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/db';
import { aiService } from '@/lib/integrations/ai-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phoneIds: string[] = body.phoneIds || [];

    if (phoneIds.length < 2) {
      return NextResponse.json({ success: false, error: 'At least 2 phoneIds required' }, { status: 400 });
    }

    const allPhones = await dataRepository.getSmartphones();
    const selected = allPhones.filter(p => phoneIds.includes(p.id) || phoneIds.includes(p.slug));

    if (selected.length < 2) {
      return NextResponse.json({ success: false, error: 'Could not resolve at least 2 valid phones' }, { status: 400 });
    }

    const result = await aiService.compareSmartphones(selected);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
