'use client';

import { useState, useEffect } from 'react';
import { SearchResults } from '@/components/SearchResults';

export function SearchClient({ query }: { query: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      if (!query) {
        setEvents([]);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setEvents([]);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [query]);

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>;
  }

  return <SearchResults query={query} events={events} error={error} />;
}