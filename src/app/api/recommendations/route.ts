import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/db';
import { aiService } from '@/lib/integrations/ai-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const allPhones = await dataRepository.getSmartphones();

    const result = await aiService.generateRecommendations(
      {
        budget_pkr: Number(body.budget_pkr) || 200000,
        preferred_brand: body.preferred_brand,
        usage_priorities: body.usage_priorities || ['gaming', 'camera'],
        minimum_ram_gb: Number(body.minimum_ram_gb) || 8,
        needs_5g: Boolean(body.needs_5g)
      },
      allPhones
    );

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
