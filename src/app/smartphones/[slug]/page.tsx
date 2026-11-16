import React from 'react';
import { notFound } from 'next/navigation';
import { dataRepository } from '@/lib/db';
import { SmartphoneDetailView } from '@/components/smartphones/SmartphoneDetailView';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SmartphonePage({ params }: PageProps) {
  const { slug } = await params;
  const phone = await dataRepository.getSmartphoneBySlug(slug);

  if (!phone) {
    notFound();
  }

  const reviews = await dataRepository.getReviews(phone.id);

  return <SmartphoneDetailView phone={phone} reviews={reviews} />;
}
