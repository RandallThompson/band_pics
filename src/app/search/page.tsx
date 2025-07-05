import { Suspense } from 'react';
import { SearchResults } from '@/components/SearchResults';
import { fetchBandsInTownEvents } from '@/lib/api/bandsintown';
import { SearchParams } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = searchParams.q || '';
  
  // Only fetch data if there's a query
  let events: any[] = [];
  let error: string | null = null;
  
  if (query) {
    try {
      const fetchedEvents = fetchBandsInTownEvents(query);
      events = [];
      error = null;
    } catch (err) {
      console.error('Error fetching events:', err);
      error = 'Failed to load events. Please try again later.';
    }
  }

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