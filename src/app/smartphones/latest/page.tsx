import React from 'react';
import { dataRepository } from '@/lib/db';
import { SmartphoneCatalog } from '@/components/smartphones/SmartphoneCatalog';

export const revalidate = 60;

export default async function LatestSmartphonesPage() {
  const [phones, brands] = await Promise.all([
    dataRepository.getSmartphones(),
    dataRepository.getBrands()
  ]);

  const latestPhones = phones.filter(p => p.status === 'available');

  return (
    <SmartphoneCatalog
      initialPhones={latestPhones}
      brands={brands}
      pageTitle="Latest Smartphones 2026"
      pageSubtitle="Browse the newest officially released smartphones with verified technical specifications in Pakistan."
    />
  );
}
