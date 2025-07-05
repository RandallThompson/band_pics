import { getDatabase } from '../connection';

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  imageUrl: string;
  photoCount: number;
}

// Get all past events
export async function getPastEvents(): Promise<Event[]> {
  try {
    // In a real application, this would query the database
    // For now, we'll return mock data
    const pastEvents: Event[] = [
      {
        id: '1',
        title: 'Rock Night at Buffalo Iron Works',
        date: '2025-07-02',
        venue: 'Buffalo Iron Works',
        imageUrl: 'https://via.placeholder.com/300x200?text=Rock+Night',
        photoCount: 42
      },
      {
        id: '2',
        title: 'Jazz Evening at Town Ballroom',
        date: '2025-07-01',
        venue: 'Town Ballroom',
        imageUrl: 'https://via.placeholder.com/300x200?text=Jazz+Evening',
        photoCount: 28
      },
      {
        id: '3',
        title: 'Pop Concert at Mohawk Place',
        date: '2025-06-30',
        venue: 'Mohawk Place',
        imageUrl: 'https://via.placeholder.com/300x200?text=Pop+Concert',
        photoCount: 67
      },
      {
        id: '4',
        title: 'Blues Night at Sportsmen\'s Tavern',
        date: '2025-06-29',
        venue: 'Sportsmen\'s Tavern',
        imageUrl: 'https://via.placeholder.com/300x200?text=Blues+Night',
        photoCount: 35
      },
      {
        id: '5',
        title: 'Classical Performance at Kleinhans Music Hall',
        date: '2025-06-28',
        venue: 'Kleinhans Music Hall',
        imageUrl: 'https://via.placeholder.com/300x200?text=Classical+Performance',
        photoCount: 19
      },
      {
        id: '6',
        title: 'Indie Rock Show at Buffalo Iron Works',
        date: '2025-06-27',
        venue: 'Buffalo Iron Works',
        imageUrl: 'https://via.placeholder.com/300x200?text=Indie+Rock',
        photoCount: 53
      }
    ];
    
    return pastEvents;
  } catch (error) {
    console.error('Error fetching past events:', error);
    throw new Error('Failed to fetch past events');
  }
}

// Get a single event by ID
export async function getEventById(id: string): Promise<Event | null> {
  try {
    const events = await getPastEvents();
    return events.find(event => event.id === id) || null;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw new Error(`Failed to fetch event with ID ${id}`);
  }
}