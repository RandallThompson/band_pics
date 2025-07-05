import { BandsInTownEvent, EventDisplay } from '@/lib/types';

// Bandsintown API app_id - in a real app, this would be in an environment variable
const APP_ID = 'band_pics';

/**
 * Fetches events for an artist from the Bandsintown API
 * @param artist The artist name to search for
 * @returns Array of formatted events
 */
export async function fetchBandsInTownEvents(artist: string): Promise<EventDisplay[]> {
  try {
    // Encode the artist name for the URL
    const encodedArtist = encodeURIComponent(artist);
    
    // Make the API request
    const response = await fetch(
      `https://rest.bandsintown.com/artists/${encodedArtist}/events?app_id=${APP_ID}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Bandsintown API error: ${response.status}`);
    }
    
    const events: BandsInTownEvent[] = await response.json();
    
    // Transform the API response to our internal format
    return events.map(event => ({
      id: event.id,
      title: event.title || `${event.lineup[0]} at ${event.venue.name}`,
      date: event.datetime,
      venue: event.venue.name,
      location: `${event.venue.city}, ${event.venue.region || event.venue.country}`,
      ticketUrl: event.offers && event.offers.length > 0 ? event.offers[0].url : '',
      imageUrl: event.image_url || `https://via.placeholder.com/300x200?text=${encodeURIComponent(event.lineup[0])}`,
      artist: event.lineup[0]
    }));
  } catch (error) {
    console.error('Error fetching Bandsintown events:', error);
    throw error;
  }
}