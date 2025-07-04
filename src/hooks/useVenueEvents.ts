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

// List of Buffalo music venues and their APIs/sources
const VENUE_SOURCES = [
  {
    name: 'Buffalo Iron Works',
    apiUrl: 'https://api.example.com/buffaloironworks/events', // Example API URL
    source: 'Buffalo Iron Works Website'
  },
  {
    name: 'Town Ballroom',
    apiUrl: 'https://api.example.com/townballroom/events', // Example API URL
    source: 'Town Ballroom Website'
  },
  {
    name: 'Mohawk Place',
    apiUrl: 'https://api.example.com/mohawkplace/events', // Example API URL
    source: 'Mohawk Place Website'
  },
  {
    name: 'Sportsmen\'s Tavern',
    apiUrl: 'https://api.example.com/sportsmenstavern/events', // Example API URL
    source: 'Sportsmen\'s Tavern Website'
  },
  {
    name: 'Kleinhans Music Hall',
    apiUrl: 'https://api.example.com/kleinhans/events', // Example API URL
    source: 'Kleinhans Music Hall Website'
  }
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
        // In a real application, we would fetch from actual APIs
        // For now, we'll simulate API responses with mock data
        
        // Simulated API response data
        const mockEvents: VenueEvent[] = [];
        
        // Generate mock events for each venue
        VENUE_SOURCES.forEach((venue, venueIndex) => {
          // Create 3 events for each venue
          for (let i = 1; i <= 3; i++) {
            // Generate a date within the next 30 days
            const eventDate = new Date();
            eventDate.setDate(eventDate.getDate() + (venueIndex * 3) + i);
            
            mockEvents.push({
              id: `${venueIndex}-${i}`,
              title: `${['Rock', 'Jazz', 'Pop', 'Folk', 'Blues'][Math.floor(Math.random() * 5)]} Concert ${i}`,
              date: eventDate.toISOString().split('T')[0],
              venue: venue.name,
              ticketUrl: `https://tickets.example.com/${venue.name.toLowerCase().replace(/\s+/g, '')}/event${i}`,
              imageUrl: `https://via.placeholder.com/300x200?text=${venue.name.replace(/\s+/g, '+')}+Event+${i}`,
              source: venue.source
            });
          }
        });
        
        // Sort events by date (closest first)
        mockEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setEvents(mockEvents);
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