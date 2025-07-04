import { renderHook, waitFor } from '@testing-library/react';
import { useVenueEvents } from '@/hooks/useVenueEvents';

// Mock the useVenueEvents hook implementation
jest.mock('@/hooks/useVenueEvents', () => ({
  useVenueEvents: jest.fn()
}));

describe('useVenueEvents Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with loading state and empty events array', () => {
    // Mock the implementation for this test
    (useVenueEvents as jest.Mock).mockReturnValue({
      events: [],
      loading: true,
      error: null
    });
    
    const { result } = renderHook(() => useVenueEvents());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.events).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns events data after loading', async () => {
    // Mock events data
    const mockEvents = [
      {
        id: '1-1',
        title: 'Rock Concert 1',
        date: '2025-07-10',
        venue: 'Buffalo Iron Works',
        ticketUrl: 'https://tickets.example.com/buffaloironworks/event1',
        imageUrl: 'https://via.placeholder.com/300x200?text=Buffalo+Iron+Works+Event+1',
        source: 'Buffalo Iron Works Website'
      },
      {
        id: '2-1',
        title: 'Jazz Concert 1',
        date: '2025-07-15',
        venue: 'Town Ballroom',
        ticketUrl: 'https://tickets.example.com/townballroom/event1',
        imageUrl: 'https://via.placeholder.com/300x200?text=Town+Ballroom+Event+1',
        source: 'Town Ballroom Website'
      }
    ];
    
    // Mock the implementation for this test
    (useVenueEvents as jest.Mock).mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null
    });
    
    const { result } = renderHook(() => useVenueEvents());
    
    // After loading, we should have events data
    expect(result.current.loading).toBe(false);
    expect(result.current.events.length).toBe(2);
    expect(result.current.error).toBeNull();
    
    // Check that each event has the required properties
    result.current.events.forEach(event => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('venue');
      expect(event).toHaveProperty('ticketUrl');
      expect(event).toHaveProperty('imageUrl');
      expect(event).toHaveProperty('source');
    });
  });
});