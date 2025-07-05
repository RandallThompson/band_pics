import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home Page', () => {
  it('renders all sections', async () => {
    render(<Home />);
    
    // Check for main sections
    expect(screen.getByRole('heading', { level: 1, name: 'Buffalo Music Scene' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Upcoming Events in Buffalo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Buffalo Music Venue Social Feed' })).toBeInTheDocument();
    expect(screen.getByText("© 2025 Buffalo Music Scene. Celebrating the city's musical legacy.")).toBeInTheDocument();
    
    // Check for new Bandsintown-like sections
    expect(screen.getByText('Last Night\'s Concerts')).toBeInTheDocument();
    expect(screen.getByText('Top Fan Contributions')).toBeInTheDocument();
  });

  it('displays upcoming events', async () => {
    render(<Home />);
    
    // Wait for the useEffect to load the events
    await waitFor(() => {
      // Check for venue events (using getAllByText since venues appear multiple times)
      expect(screen.getAllByText('Buffalo Iron Works').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Town Ballroom').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Mohawk Place').length).toBeGreaterThan(0);
    });
  });

  it('has search functionality', () => {
    render(<Home />);
    
    const input = screen.getByPlaceholderText('Search for artists, concerts, venues...');
    const searchButton = screen.getByText('Search');
    const resetButton = screen.getByText('Reset');
    
    expect(input).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });

  it('shows alert when searching with empty input', () => {
    // Mock window.alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Home />);
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Please enter a search term');
    
    alertSpy.mockRestore();
  });
  
  it('renders Bandsintown-inspired UI elements', () => {
    render(<Home />);
    
    // Check for header elements
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Discover Live Music Near You')).toBeInTheDocument();
    
    // Check for recent concerts section
    expect(screen.getByText('Check out these amazing performances from yesterday. Our community has shared their favorite moments and photos from these unforgettable shows.')).toBeInTheDocument();
    expect(screen.getByText('View All Recent Concerts')).toBeInTheDocument();
    
    // Check for fan contributions section
    expect(screen.getByText('Submit Your Photos')).toBeInTheDocument();
    
    // Check for footer elements
    expect(screen.getByText('Your ultimate destination for discovering live music and sharing concert experiences.')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });
});