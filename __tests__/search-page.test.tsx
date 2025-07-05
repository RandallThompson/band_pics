import { render, screen } from '@testing-library/react';
import { SearchResults } from '@/components/SearchResults';
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

describe('Search Page', () => {
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
});