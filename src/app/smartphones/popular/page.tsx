import React from 'react';
import { dataRepository } from '@/lib/db';
import { SmartphoneCatalog } from '@/components/smartphones/SmartphoneCatalog';

export const revalidate = 60;

export default async function PopularSmartphonesPage() {
  const [phones, brands] = await Promise.all([
    dataRepository.getSmartphones(),
    dataRepository.getBrands()
  ]);

  const popularPhones = phones.filter(p => p.is_featured || p.is_trending);

  return (
    <SmartphoneCatalog
      initialPhones={popularPhones}
      brands={brands}
      pageTitle="Popular Smartphones"
      pageSubtitle="Top trending smartphones in Pakistan based on consumer demand, reviews, and community interest."
    />
  );
}
