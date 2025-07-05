import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock the useImages hook
jest.mock('@/hooks/useImages', () => ({
  useImages: () => ({
    rock: [],
    jazz: [],
    pop: [],
    events: [
      {
        id: 1,
        src: 'https://via.placeholder.com/300x200?text=Test+Event',
        alt: 'Test Event',
        caption: 'Test Event'
      }
    ]
  })
}));

// Mock the useVenueEvents hook
jest.mock('@/hooks/useVenueEvents', () => ({
  useVenueEvents: () => ({
    events: [],
    loading: false,
    error: null
  })
}));

describe('Goo Goo Dolls Theme Implementation', () => {
  describe('Header Component', () => {
    it('should display Buffalo Music Scene title instead of Band Pics', () => {
      const mockOnSearch = jest.fn();
      const mockOnReset = jest.fn();
      
      render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
      
      expect(screen.getByText('Buffalo Music Scene')).toBeInTheDocument();
      expect(screen.queryByText('Band Pics')).not.toBeInTheDocument();
    });

    it('should display Buffalo-themed content in hero section', () => {
      const mockOnSearch = jest.fn();
      const mockOnReset = jest.fn();
      
      render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
      
      expect(screen.getByText("Discover Buffalo's Music Scene")).toBeInTheDocument();
      expect(screen.getByText(/From the Goo Goo Dolls to local venues/)).toBeInTheDocument();
      expect(screen.getByText('Explore Buffalo Music')).toBeInTheDocument();
    });
  });

  describe('Footer Component', () => {
    it('should display Buffalo Music Scene branding', () => {
      render(<Footer />);
      
      expect(screen.getByText('Buffalo Music Scene')).toBeInTheDocument();
      expect(screen.getByText(/Celebrating Buffalo's rich musical heritage/)).toBeInTheDocument();
    });

    it('should have Buffalo-themed navigation links', () => {
      render(<Footer />);
      
      expect(screen.getByText('Buffalo Venues')).toBeInTheDocument();
      expect(screen.getByText('Local Artists')).toBeInTheDocument();
      expect(screen.getByText('Music History')).toBeInTheDocument();
    });

    it('should display Buffalo-themed copyright', () => {
      render(<Footer />);
      
      expect(screen.getByText(/Buffalo Music Scene.*musical legacy/)).toBeInTheDocument();
    });
  });

  describe('Main Page', () => {
    it('should render without errors with new theme', () => {
      render(<Home />);
      
      // Check that key elements are present (using getAllByText since title appears multiple times)
      expect(screen.getAllByText('Buffalo Music Scene')).toHaveLength(2); // Header and Footer
      expect(screen.getByText("Last Night's Concerts")).toBeInTheDocument();
      expect(screen.getByText('Top Fan Contributions')).toBeInTheDocument();
    });

    it('should have dark theme styling applied', () => {
      const { container } = render(<Home />);
      
      // Check that the main container has the dark theme class
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('text-primary-100');
    });
  });

  describe('Theme Colors', () => {
    it('should use Goo Goo Dolls inspired color scheme', () => {
      // This test verifies that the theme is properly configured
      // by checking that the CSS classes are applied correctly
      const mockOnSearch = jest.fn();
      const mockOnReset = jest.fn();
      
      const { container } = render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
      
      // Check for accent color usage in title
      const title = screen.getByText('Buffalo Music Scene');
      expect(title).toHaveClass('text-accent-400');
      
      // Check for primary color usage in navigation
      const navLinks = container.querySelectorAll('a[href^="#"]');
      navLinks.forEach(link => {
        expect(link).toHaveClass('text-primary-200');
      });
    });
  });

  describe('Buffalo Music Theme Content', () => {
    it('should reference Buffalo music scene throughout the application', () => {
      render(<Home />);
      
      // Check for Buffalo-specific content
      expect(screen.getAllByText('Buffalo Music Scene')).toHaveLength(2); // Header and Footer
      expect(screen.getByText(/Buffalo's Music Scene/)).toBeInTheDocument();
      expect(screen.getByText('Buffalo Events')).toBeInTheDocument();
    });

    it('should mention Goo Goo Dolls in the theme', () => {
      const mockOnSearch = jest.fn();
      const mockOnReset = jest.fn();
      
      render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
      
      expect(screen.getByText(/Goo Goo Dolls/)).toBeInTheDocument();
    });
  });
});