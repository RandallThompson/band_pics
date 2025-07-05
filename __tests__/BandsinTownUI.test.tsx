import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Bandsintown UI', () => {
  it('renders the redesigned header with Bandsintown-like elements', () => {
    render(<Home />);
    
    // Check for the new header elements
    expect(screen.getByRole('heading', { level: 1, name: 'Buffalo Music Scene' })).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Discover Live Music Near You')).toBeInTheDocument();
    expect(screen.getByText('Track your favorite artists and never miss a show')).toBeInTheDocument();
    expect(screen.getByText('Find Concerts')).toBeInTheDocument();
  });

  it('renders the Recent Concerts section', () => {
    render(<Home />);
    
    // Check for the recent concerts section
    expect(screen.getByText('Last Night\'s Concerts')).toBeInTheDocument();
    expect(screen.getByText('Check out these amazing performances from yesterday. Our community has shared their favorite moments and photos from these unforgettable shows.')).toBeInTheDocument();
    expect(screen.getByText('View All Recent Concerts')).toBeInTheDocument();
  });

  it('renders the Fan Contributions section', () => {
    render(<Home />);
    
    // Check for the fan contributions section
    expect(screen.getByText('Top Fan Contributions')).toBeInTheDocument();
    expect(screen.getByText('Submit Your Photos')).toBeInTheDocument();
  });

  it('renders the redesigned footer with Bandsintown-like elements', () => {
    render(<Home />);
    
    // Check for the new footer elements
    expect(screen.getByText('Your ultimate destination for discovering live music and sharing concert experiences.')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Concerts Near Me')).toBeInTheDocument();
    expect(screen.getByText('Fan Photos')).toBeInTheDocument();
    expect(screen.getAllByText('Instagram')).toHaveLength(2); // One in social feed, one in footer
  });
});