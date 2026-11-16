import { NextResponse } from 'next/server';
import { dataRepository } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const brand = searchParams.get('brand')?.toLowerCase();

    let phones = await dataRepository.getSmartphones();

    if (search) {
      phones = phones.filter(
        p => p.name.toLowerCase().includes(search) || p.brand_name.toLowerCase().includes(search)
      );
    }

    if (brand) {
      phones = phones.filter(
        p => p.brand_slug.toLowerCase() === brand || p.brand_name.toLowerCase() === brand
      );
    }

    return NextResponse.json({
      success: true,
      count: phones.length,
      data: phones
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
