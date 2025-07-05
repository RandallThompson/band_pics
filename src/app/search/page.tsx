import { Suspense } from 'react';
import { SearchResults } from '@/components/SearchResults';

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  
  // Initialize with empty values
  const events: any[] = [];
  const error: string | null = null;
  
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