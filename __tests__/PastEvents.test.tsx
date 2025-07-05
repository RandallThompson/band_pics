import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PastEvents from '../src/components/PastEvents';

describe('PastEvents', () => {
  it('renders past events section', () => {
    render(<PastEvents />);
    
    expect(screen.getByText('Past Concerts')).toBeInTheDocument();
    expect(screen.getByText('Browse through recent concerts and upload your photos to share with the community!')).toBeInTheDocument();
  });

  it('displays past events with correct information', () => {
    render(<PastEvents />);
    
    // Check for some expected events
    expect(screen.getByText('Rock Night at Buffalo Iron Works')).toBeInTheDocument();
    expect(screen.getByText('Jazz Evening at Town Ballroom')).toBeInTheDocument();
    expect(screen.getByText('Pop Concert at Mohawk Place')).toBeInTheDocument();
    
    // Check for venue information (using getAllByText since venues appear multiple times)
    expect(screen.getAllByText('Buffalo Iron Works').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Town Ballroom').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mohawk Place').length).toBeGreaterThan(0);
  });

  it('shows photo counts for events', () => {
    render(<PastEvents />);
    
    // Check for photo count displays
    expect(screen.getByText('42 photos')).toBeInTheDocument();
    expect(screen.getByText('28 photos')).toBeInTheDocument();
    expect(screen.getByText('67 photos')).toBeInTheDocument();
  });

  it('has upload photos buttons for each event', () => {
    render(<PastEvents />);
    
    const uploadButtons = screen.getAllByText('Upload Photos');
    expect(uploadButtons.length).toBeGreaterThan(0);
  });

  it('has view gallery buttons for each event', () => {
    render(<PastEvents />);
    
    const viewButtons = screen.getAllByText('View Gallery');
    expect(viewButtons.length).toBeGreaterThan(0);
  });

  it('opens photo upload modal when upload button is clicked', async () => {
    render(<PastEvents />);
    
    const uploadButtons = screen.getAllByText('Upload Photos');
    fireEvent.click(uploadButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Upload Photos' })).toBeInTheDocument();
      expect(screen.getByText(/Upload your photos from:/)).toBeInTheDocument();
    });
  });

  it('closes photo upload modal when close button is clicked', async () => {
    render(<PastEvents />);
    
    const uploadButtons = screen.getAllByText('Upload Photos');
    fireEvent.click(uploadButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Upload Photos' })).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/Upload your photos from:/)).not.toBeInTheDocument();
    });
  });

  it('handles photo upload form submission', async () => {
    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PastEvents />);
    
    const uploadButtons = screen.getAllByText('Upload Photos');
    fireEvent.click(uploadButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Upload Photos' })).toBeInTheDocument();
    });
    
    // Create a mock file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Select Photos');
    
    // Mock the file input
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    const descriptionInput = screen.getByLabelText('Description (optional)');
    fireEvent.change(descriptionInput, { target: { value: 'Great concert!' } });
    
    const submitButtons = screen.getAllByRole('button', { name: 'Upload Photos' });
    const modalSubmitButton = submitButtons.find(button => 
      button.classList.contains('w-full')
    );
    fireEvent.click(modalSubmitButton!);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Successfully uploaded 1 photo(s)'));
    });
    
    alertSpy.mockRestore();
  });

  it('shows error when trying to upload without selecting files', async () => {
    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<PastEvents />);
    
    const uploadButtons = screen.getAllByText('Upload Photos');
    fireEvent.click(uploadButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Upload Photos' })).toBeInTheDocument();
    });
    
    const submitButtons = screen.getAllByRole('button', { name: 'Upload Photos' });
    const modalSubmitButton = submitButtons.find(button => 
      button.classList.contains('w-full')
    );
    fireEvent.click(modalSubmitButton!);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Please select at least one photo to upload');
    });
    
    alertSpy.mockRestore();
  });
});