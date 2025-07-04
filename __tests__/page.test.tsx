import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home Page', () => {
  it('renders all sections', async () => {
    render(<Home />);
    
    expect(screen.getByText('Band Pics')).toBeInTheDocument();
    expect(screen.getByText('Rock Bands')).toBeInTheDocument();
    expect(screen.getByText('Jazz Bands')).toBeInTheDocument();
    expect(screen.getByText('Pop Bands')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Buffalo Music Venue Social Feed' })).toBeInTheDocument();
    expect(screen.getByText('© 2025 Band Pics. All rights reserved.')).toBeInTheDocument();
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
    
    const input = screen.getByPlaceholderText('Search for bands or events...');
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
});