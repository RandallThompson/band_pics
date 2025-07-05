import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from '../src/components/AuthModal';

describe('AuthModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders login modal when open', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />);
    
    expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
  });

  it('renders signup modal when open', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="signup" />);
    
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<AuthModal isOpen={false} onClose={mockOnClose} mode="login" />);
    
    expect(screen.queryByRole('heading', { name: 'Log In' })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles login form submission', async () => {
    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="login" />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Login successful! (Demo mode)');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    
    alertSpy.mockRestore();
  });

  it('handles signup form submission with matching passwords', async () => {
    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="signup" />);
    
    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Sign up successful! (Demo mode)');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
    
    alertSpy.mockRestore();
  });

  it('shows error when signup passwords do not match', async () => {
    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<AuthModal isOpen={true} onClose={mockOnClose} mode="signup" />);
    
    const nameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Passwords do not match');
      expect(mockOnClose).not.toHaveBeenCalled();
    });
    
    alertSpy.mockRestore();
  });
});