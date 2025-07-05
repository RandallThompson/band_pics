'use client';

import { Suspense } from 'react';
import { SearchResults } from '@/components/SearchResults';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // Initialize with empty values
  const events = [];
  const error = null;

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-100">
        {query ? `Search Results for "${query}"` : 'Search for Events'}
      </h1>
      
      <Suspense fallback={<div className="text-center py-8">Loading results...</div>}>
        <SearchResults query={query} events={events} error={error} />
      </Suspense>
    </div>
  );
}