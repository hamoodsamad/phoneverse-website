import React, { Suspense } from 'react';
import { dataRepository } from '@/lib/db';
import { SmartphoneCatalog } from '@/components/smartphones/SmartphoneCatalog';
import { GridSkeletonLoader } from '@/components/common/SkeletonLoader';

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SmartphonesPage({ searchParams }: PageProps) {
  const [phones, brands] = await Promise.all([
    dataRepository.getSmartphones(),
    dataRepository.getBrands()
  ]);

  const params = await searchParams;
  const initialSearch = typeof params.search === 'string' ? params.search : '';
  const initialBrand = typeof params.brand === 'string' ? params.brand : '';

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8"><GridSkeletonLoader /></div>}>
      <SmartphoneCatalog
        initialPhones={phones}
        brands={brands}
        initialSearch={initialSearch}
        initialBrand={initialBrand}
      />
    </Suspense>
  );
}
