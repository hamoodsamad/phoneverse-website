import React from 'react';
import { notFound } from 'next/navigation';
import { dataRepository } from '@/lib/db';
import { SmartphoneCatalog } from '@/components/smartphones/SmartphoneCatalog';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [brand, allBrands, allPhones] = await Promise.all([
    dataRepository.getBrandBySlug(slug),
    dataRepository.getBrands(),
    dataRepository.getSmartphones()
  ]);

  if (!brand) {
    notFound();
  }

  const brandPhones = allPhones.filter(
    p => p.brand_slug === brand.slug || p.brand_name.toLowerCase() === brand.name.toLowerCase()
  );

  return (
    <SmartphoneCatalog
      initialPhones={brandPhones}
      brands={allBrands}
      initialBrand={brand.slug}
      pageTitle={`${brand.name} Smartphones in Pakistan`}
      pageSubtitle={brand.description || `Browse the full verified lineup of ${brand.name} mobile phones in Pakistan with PKR pricing and PTA Approved status.`}
    />
  );
}
