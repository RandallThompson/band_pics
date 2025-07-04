import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home Page', () => {
  it('renders all sections', async () => {
    render(<Home />);
    
    // Check for main sections
    expect(screen.getByRole('heading', { level: 1, name: 'Band Pics' })).toBeInTheDocument();
    expect(screen.getByText('Rock Bands')).toBeInTheDocument();
    expect(screen.getByText('Jazz Bands')).toBeInTheDocument();
    expect(screen.getByText('Pop Bands')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument();
    expect(screen.getByText('© 2025 Band Pics. All rights reserved.')).toBeInTheDocument();
    
    // Check for new Bandsintown-like sections
    expect(screen.getByText('Last Night\'s Concerts')).toBeInTheDocument();
    expect(screen.getByText('Top Fan Contributions')).toBeInTheDocument();
  });

  it('displays placeholder images from all genres', async () => {
    render(<Home />);
    
    // Wait for the useEffect to load the images
    await waitFor(() => {
      expect(screen.getByText('Rock Band 1')).toBeInTheDocument();
      expect(screen.getByText('Jazz Band 1')).toBeInTheDocument();
      expect(screen.getByText('Pop Band 1')).toBeInTheDocument();
      expect(screen.getByText('Events Band 1')).toBeInTheDocument();
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