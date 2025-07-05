import { SearchResults } from '@/components/SearchResults';

export const dynamic = 'force-dynamic';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  
  // Initialize with empty values
  const events: any[] = [];
  const error: string | null = null;
  
  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-100">
        {query ? `Search Results for "${query}"` : 'Search for Events'}
      </h1>
      
      <SearchResults query={query} events={events} error={error} />
    </div>
  );
}