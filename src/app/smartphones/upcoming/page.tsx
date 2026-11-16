import React from 'react';
import { dataRepository } from '@/lib/db';
import { SmartphoneCatalog } from '@/components/smartphones/SmartphoneCatalog';

export const revalidate = 60;

export default async function UpcomingSmartphonesPage() {
  const [phones, brands] = await Promise.all([
    dataRepository.getSmartphones(),
    dataRepository.getBrands()
  ]);

  const upcomingPhones = phones.filter(p => p.status === 'upcoming' || p.is_unconfirmed);

  return (
    <SmartphoneCatalog
      initialPhones={upcomingPhones}
      brands={brands}
      pageTitle="Upcoming & Rumored Smartphones"
      pageSubtitle="Anticipated next-generation mobile devices. All speculative or unverified specifications are clearly flagged."
    />
  );
}
