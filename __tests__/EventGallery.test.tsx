import { render, screen } from '@testing-library/react';
import EventGalleryPage from '@/app/events/[id]/page';
import * as eventModel from '@/lib/database/models/event';
import * as photoModel from '@/lib/database/models/photo';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => null)
}));

// Mock the database models
jest.mock('@/lib/database/models/event', () => ({
  getPastEvents: jest.fn()
}));

jest.mock('@/lib/database/models/photo', () => ({
  getEventPhotos: jest.fn()
}));

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={props.src} alt={props.alt} />;
  }
}));

describe('EventGalleryPage', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Event',
    date: '2025-07-01',
    venue: 'Test Venue',
    imageUrl: 'https://example.com/image.jpg',
    photoCount: 5
  };

  const mockPhotos = [
    {
      id: 'photo1',
      eventId: '1',
      url: 'https://example.com/photo1.jpg',
      caption: 'Photo 1',
      timestamp: '2025-07-01T12:00:00Z',
      username: 'user1',
      source: 'user-upload'
    },
    {
      id: 'photo2',
      eventId: '1',
      url: 'https://example.com/photo2.jpg',
      caption: null,
      timestamp: '2025-07-01T13:00:00Z',
      username: 'user2',
      source: 'Instagram'
    },
    {
      id: 'photo3',
      eventId: '1',
      url: 'https://example.com/photo3.jpg',
      caption: 'Photo 3',
      timestamp: '2025-07-01T11:00:00Z',
      username: null,
      source: 'Twitter'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (eventModel.getPastEvents as jest.Mock).mockResolvedValue([mockEvent]);
    (photoModel.getEventPhotos as jest.Mock).mockResolvedValue(mockPhotos);
  });

  it('renders event details and photos', async () => {
    const page = await EventGalleryPage({ params: { id: '1' } });
    render(page);

    // Check event details
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText(/Test Venue/)).toBeInTheDocument();
    
    // Check photos
    expect(screen.getByText('Photo 1')).toBeInTheDocument();
    expect(screen.getByText('Photo 3')).toBeInTheDocument();
    expect(screen.getByText(/By: user1/)).toBeInTheDocument();
    expect(screen.getByText(/By: user2/)).toBeInTheDocument();
    
    // Check sources
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('user-upload')).toBeInTheDocument();
  });

  it('sorts photos chronologically by timestamp', async () => {
    const page = await EventGalleryPage({ params: { id: '1' } });
    render(page);
    
    // The photos should be sorted by timestamp (earliest first)
    // We can check this by verifying the order of captions in the document
    const captions = screen.getAllByText(/Photo [13]/);
    expect(captions[0].textContent).toBe('Photo 3'); // 11:00
    expect(captions[1].textContent).toBe('Photo 1'); // 12:00
  });

  it('displays a message when no photos are available', async () => {
    (photoModel.getEventPhotos as jest.Mock).mockResolvedValue([]);
    
    const page = await EventGalleryPage({ params: { id: '1' } });
    render(page);
    
    expect(screen.getByText('No photos available for this event yet.')).toBeInTheDocument();
    expect(screen.getByText('Be the first to upload your photos!')).toBeInTheDocument();
  });
});