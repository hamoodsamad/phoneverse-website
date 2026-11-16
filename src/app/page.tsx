import React from 'react';
import { dataRepository } from '@/lib/db';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { LatestLaunchesSection } from '@/components/home/LatestLaunchesSection';
import { UpcomingSection } from '@/components/home/UpcomingSection';
import { BrandsSection } from '@/components/home/BrandsSection';
import { PriceDropsSection } from '@/components/home/PriceDropsSection';
import { AiRecommendationsBanner } from '@/components/home/AiRecommendationsBanner';
import { TechNewsSection } from '@/components/home/TechNewsSection';

export const revalidate = 60; // ISR for performance on Vercel

export default async function HomePage() {
  const [phones, brands, news] = await Promise.all([
    dataRepository.getSmartphones(),
    dataRepository.getBrands(),
    dataRepository.getNews()
  ]);

  const flagships = phones.filter(p => p.is_featured).slice(0, 4);

  return (
    <div>
      <HeroSection flagships={flagships} />
      <FeaturedSection phones={phones} />
      <LatestLaunchesSection phones={phones} />
      <UpcomingSection phones={phones} />
      <BrandsSection brands={brands} />
      <PriceDropsSection phones={phones} />
      <AiRecommendationsBanner />
      <TechNewsSection news={news} />
    </div>
  );
}
