import React from 'react';
import { dataRepository } from '@/lib/db';
import { SmartphoneCatalog } from '@/components/smartphones/SmartphoneCatalog';

export const revalidate = 60;

export default async function NewlyLaunchedSmartphonesPage() {
  const [phones, brands] = await Promise.all([
    dataRepository.getSmartphones(),
    dataRepository.getBrands()
  ]);

  const newLaunches = phones.filter(p => p.status === 'available');

  return (
    <SmartphoneCatalog
      initialPhones={newLaunches}
      brands={brands}
      pageTitle="Newly Launched Smartphones"
      pageSubtitle="Fresh arrivals across authorized Pakistani electronics retailers and brand stores."
    />
  );
}
