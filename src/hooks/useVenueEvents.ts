'use client';

import { useState, useEffect } from 'react';

export interface VenueEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  ticketUrl: string;
  imageUrl: string;
  source: string;
}

// Venue sources are stored in the database; this constant remains for fallback labels
const VENUE_SOURCES = [
  { name: 'Buffalo Iron Works', source: 'Buffalo Iron Works Website' },
  { name: 'Town Ballroom', source: 'Town Ballroom Website' },
  { name: 'Mohawk Place', source: 'Mohawk Place Website' },
  { name: "Sportsmen's Tavern", source: "Sportsmen's Tavern Website" },
  { name: 'Kleinhans Music Hall', source: 'Kleinhans Music Hall Website' }
];

export function useVenueEvents() {
  const [events, setEvents] = useState<VenueEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Request failed');
        const data = await res.json();
        const eventsFromApi: VenueEvent[] = data.events.map((e: any) => ({
          id: e.id.toString(),
          title: e.title,
          date: e.date,
          venue: e.venue,
          ticketUrl: '',
          imageUrl: e.image_url || '/images/events/events1.svg',
          source: 'Local Database'
        }));
        setEvents(eventsFromApi);
      } catch (err) {
        console.error('Error fetching venue events:', err);
        setError('Failed to load upcoming events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}