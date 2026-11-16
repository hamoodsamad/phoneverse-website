import React, { Suspense } from 'react';
import { dataRepository } from '@/lib/db';
import { CompareView } from '@/components/compare/CompareView';

export const revalidate = 60;

export default async function ComparePage() {
  const allPhones = await dataRepository.getSmartphones();

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading comparison matrix...</div>}>
      <CompareView allPhones={allPhones} />
    </Suspense>
  );
}
