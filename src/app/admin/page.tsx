import React from 'react';
import { dataRepository } from '@/lib/db';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';

export const revalidate = 0; // Dynamic for administrative real-time management

export default async function AdminPage() {
  const [phones, brands, jobs, logs] = await Promise.all([
    dataRepository.getSmartphones(),
    dataRepository.getBrands(),
    dataRepository.getAutomationJobs(),
    dataRepository.getSystemLogs()
  ]);

  return (
    <AdminDashboardView
      initialPhones={phones}
      initialBrands={brands}
      initialJobs={jobs}
      initialLogs={logs}
    />
  );
}
