import React from 'react';

export function PhoneCardSkeleton() {
  return (
    <div className="rounded-2xl glass-panel p-4 flex flex-col justify-between animate-pulse">
      <div className="w-full h-52 bg-gray-800/60 rounded-xl mb-4" />
      <div className="h-4 bg-gray-800/80 rounded w-1/3 mb-2" />
      <div className="h-6 bg-gray-800/80 rounded w-3/4 mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-3 bg-gray-800/60 rounded" />
        <div className="h-3 bg-gray-800/60 rounded" />
        <div className="h-3 bg-gray-800/60 rounded" />
        <div className="h-3 bg-gray-800/60 rounded" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-800">
        <div className="h-6 bg-gray-800/80 rounded w-1/3" />
        <div className="h-8 bg-gray-800/80 rounded w-16" />
      </div>
    </div>
  );
}

export function GridSkeletonLoader({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <PhoneCardSkeleton key={idx} />
      ))}
    </div>
  );
}
