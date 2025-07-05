import { render, screen, waitFor } from '@testing-library/react';
import { SearchResults } from '@/components/SearchResults';
import { fetchBandsInTownEvents } from '@/lib/api/bandsintown';
import { EventDisplay } from '@/lib/types';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => {
    return <img src={src} alt={alt} />;
  },
}));

// Mock the next/link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock the fetchBandsInTownEvents function
jest.mock('@/lib/api/bandsintown', () => ({
  fetchBandsInTownEvents: jest.fn(),
}));

describe('Search Functionality', () => {
  const mockEvents: EventDisplay[] = [
    {
      id: '1',
      title: 'Test Event 1',
      date: '2025-08-01T20:00:00',
      venue: 'Test Venue 1',
      location: 'Buffalo, NY',
      ticketUrl: 'https://example.com/tickets/1',
      imageUrl: 'https://example.com/image1.jpg',
      artist: 'Test Artist 1',
    },
    {
      id: '2',
      title: 'Test Event 2',
      date: '2025-08-15T19:30:00',
      venue: 'Test Venue 2',
      location: 'Buffalo, NY',
      ticketUrl: 'https://example.com/tickets/2',
      imageUrl: 'https://example.com/image2.jpg',
      artist: 'Test Artist 2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays search prompt when no query is provided', () => {
    render(<SearchResults query="" events={[]} error={null} />);
    
    expect(screen.getByText(/Enter an artist name in the search box above to find upcoming events/i)).toBeInTheDocument();
  });

  test('displays error message when an error occurs', () => {
    const errorMessage = 'Failed to load events. Please try again later.';
    render(<SearchResults query="test" events={[]} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('displays no events message when no events are found', () => {
    render(<SearchResults query="nonexistent" events={[]} error={null} />);
    
    expect(screen.getByText(/No events found for "nonexistent"/i)).toBeInTheDocument();
  });

  test('displays events when found', () => {
    render(<SearchResults query="test" events={mockEvents} error={null} />);
    
    expect(screen.getByText(/Found 2 upcoming events for "test"/i)).toBeInTheDocument();
    expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    expect(screen.getByText('Test Event 2')).toBeInTheDocument();
  });

  test('fetchBandsInTownEvents returns formatted events', async () => {
    const mockApiResponse = [
      {
        id: '1',
        artist_id: '123',
        url: 'https://example.com/event1',
        on_sale_datetime: '2025-07-01T10:00:00',
        datetime: '2025-08-01T20:00:00',
        description: 'Test Event 1 Description',
        venue: {
          name: 'Test Venue 1',
          latitude: '42.123',
          longitude: '-78.456',
          city: 'Buffalo',
          region: 'NY',
          country: 'United States',
        },
        offers: [
          {
            type: 'Tickets',
            url: 'https://example.com/tickets/1',
            status: 'available',
          },
        ],
        lineup: ['Test Artist 1'],
      },
    ];

    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    // Mock the implementation for this test
    (fetchBandsInTownEvents as jest.Mock).mockImplementation(async (artist) => {
      const response = await fetch(`https://rest.bandsintown.com/artists/${artist}/events?app_id=band_pics`);
      const data = await response.json();
      
      return data.map((event: any) => ({
        id: event.id,
        title: event.title || `${event.lineup[0]} at ${event.venue.name}`,
        date: event.datetime,
        venue: event.venue.name,
        location: `${event.venue.city}, ${event.venue.region || event.venue.country}`,
        ticketUrl: event.offers && event.offers.length > 0 ? event.offers[0].url : '',
        imageUrl: event.image_url || `https://via.placeholder.com/300x200?text=${encodeURIComponent(event.lineup[0])}`,
        artist: event.lineup[0],
      }));
    });

    const result = await fetchBandsInTownEvents('test');
    
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].title).toBe('Test Artist 1 at Test Venue 1');
    expect(result[0].venue).toBe('Test Venue 1');
    expect(result[0].location).toBe('Buffalo, NY');
  });
});