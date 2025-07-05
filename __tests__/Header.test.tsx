import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnShowPastEvents = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with title and navigation', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    expect(screen.getByRole('heading', { name: 'Buffalo Music Scene' })).toBeInTheDocument();
    expect(screen.getByText('Buffalo Events')).toBeInTheDocument();
    expect(screen.getByText('Social Feed')).toBeInTheDocument();
    expect(screen.getByText('Recent Concerts')).toBeInTheDocument();
    
    // These should no longer be present
    expect(screen.queryByText('Rock')).not.toBeInTheDocument();
    expect(screen.queryByText('Jazz')).not.toBeInTheDocument();
    expect(screen.queryByText('Pop')).not.toBeInTheDocument();
    expect(screen.queryByText('Events')).not.toBeInTheDocument();
  });

  it('renders search input and buttons', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    expect(screen.getByPlaceholderText('Search for artists, concerts, venues...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked with valid input', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    const input = screen.getByPlaceholderText('Search for artists, concerts, venues...');
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(input, { target: { value: 'rock band' } });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('rock band');
  });

  it('shows alert when search button is clicked with empty input', () => {
    // Mock window.alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Please enter a search term');
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  it('calls onSearch when Enter key is pressed', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    const input = screen.getByPlaceholderText('Search for artists, concerts, venues...');
    
    fireEvent.change(input, { target: { value: 'jazz' } });
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
    
    expect(mockOnSearch).toHaveBeenCalledWith('jazz');
  });

  it('calls onReset when reset button is clicked', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('clears input after search', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    const input = screen.getByPlaceholderText('Search for artists, concerts, venues...') as HTMLInputElement;
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.click(searchButton);
    
    expect(input.value).toBe('');
  });
  
  it('renders Bandsintown-like UI elements', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Discover Live Music Near You')).toBeInTheDocument();
    expect(screen.getByText('Track your favorite artists and never miss a show')).toBeInTheDocument();
    expect(screen.getByText('Find Concerts')).toBeInTheDocument();
  });

  it('opens auth modal when Sign Up button is clicked', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    const signUpButtons = screen.getAllByText('Sign Up');
    const headerSignUpButton = signUpButtons.find(button => 
      button.classList.contains('text-white')
    );
    fireEvent.click(headerSignUpButton!);
    
    // The modal should appear
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('opens auth modal when Log In button is clicked', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    const logInButtons = screen.getAllByText('Log In');
    const headerLogInButton = logInButtons.find(button => 
      button.classList.contains('text-white')
    );
    fireEvent.click(headerLogInButton!);
    
    // The modal should appear
    expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
  });

  it('calls onShowPastEvents when Recent Concerts button is clicked', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} onShowPastEvents={mockOnShowPastEvents} />);
    
    const recentConcertsButton = screen.getByText('Recent Concerts');
    fireEvent.click(recentConcertsButton);
    
    expect(mockOnShowPastEvents).toHaveBeenCalled();
  });
});