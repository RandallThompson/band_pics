import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with title and navigation', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    expect(screen.getByText('Band Pics')).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('Jazz')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('renders search input and buttons', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    expect(screen.getByPlaceholderText('Search for bands or events...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('calls onSearch when search button is clicked with valid input', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    const input = screen.getByPlaceholderText('Search for bands or events...');
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(input, { target: { value: 'rock band' } });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('rock band');
  });

  it('shows alert when search button is clicked with empty input', () => {
    // Mock window.alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Please enter a search term');
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  it('calls onSearch when Enter key is pressed', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    const input = screen.getByPlaceholderText('Search for bands or events...');
    
    fireEvent.change(input, { target: { value: 'jazz' } });
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
    
    expect(mockOnSearch).toHaveBeenCalledWith('jazz');
  });

  it('calls onReset when reset button is clicked', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('clears input after search', () => {
    render(<Header onSearch={mockOnSearch} onReset={mockOnReset} />);
    
    const input = screen.getByPlaceholderText('Search for bands or events...') as HTMLInputElement;
    const searchButton = screen.getByText('Search');
    
    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.click(searchButton);
    
    expect(input.value).toBe('');
  });
});