import { render, screen, waitFor } from '@testing-library/react';
import UpcomingEvents from '@/components/UpcomingEvents';
import { useVenueEvents } from '@/hooks/useVenueEvents';

// Mock the useVenueEvents hook
jest.mock('@/hooks/useVenueEvents');

const mockUseVenueEvents = useVenueEvents as jest.MockedFunction<typeof useVenueEvents>;

describe('UpcomingEvents Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    mockUseVenueEvents.mockReturnValue({
      events: [],
      loading: true,
      error: null
    });

    render(<UpcomingEvents />);
    
    expect(screen.getByText('Upcoming Events in Buffalo')).toBeInTheDocument();
    expect(screen.getByText('Loading upcoming events...')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to load upcoming events';
    mockUseVenueEvents.mockReturnValue({
      events: [],
      loading: false,
      error: errorMessage
    });

    render(<UpcomingEvents />);
    
    expect(screen.getByText('Upcoming Events in Buffalo')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows message when no events are available', () => {
    mockUseVenueEvents.mockReturnValue({
      events: [],
      loading: false,
      error: null
    });

    render(<UpcomingEvents />);
    
    expect(screen.getByText('Upcoming Events in Buffalo')).toBeInTheDocument();
    expect(screen.getByText('No upcoming events found.')).toBeInTheDocument();
  });

  it('renders events correctly when data is available', () => {
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

    mockUseVenueEvents.mockReturnValue({
      events: mockEvents,
      loading: false,
      error: null
    });

    render(<UpcomingEvents />);
    
    expect(screen.getByText('Upcoming Events in Buffalo')).toBeInTheDocument();
    expect(screen.getByText('Rock Concert 1')).toBeInTheDocument();
    expect(screen.getByText('Jazz Concert 1')).toBeInTheDocument();
    expect(screen.getByText('Buffalo Iron Works')).toBeInTheDocument();
    expect(screen.getByText('Town Ballroom')).toBeInTheDocument();
    
    // Check for data sources
    expect(screen.getByText(/Data sources:/)).toBeInTheDocument();
    expect(screen.getByText(/Buffalo Iron Works Website, Town Ballroom Website/)).toBeInTheDocument();
    
    // Check for ticket links
    const ticketLinks = screen.getAllByText('Get Tickets');
    expect(ticketLinks).toHaveLength(2);
  });
});