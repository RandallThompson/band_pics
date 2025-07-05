import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhotoUpload from '@/components/PhotoUpload';

// Mock the usePhotoUpload hook
jest.mock('@/hooks/usePhotoUpload', () => ({
  usePhotoUpload: jest.fn(() => ({
    isUploading: false,
    uploadProgress: 0,
    uploadError: null,
    uploadPhoto: jest.fn().mockResolvedValue(undefined)
  }))
}));

describe('PhotoUpload Component', () => {
  const mockToken = 'test-token';
  const mockEventId = 123;
  const mockGenre = 'rock';
  const mockOnUploadComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the photo upload form', () => {
    render(
      <PhotoUpload 
        token={mockToken} 
        eventId={mockEventId} 
        genre={mockGenre} 
        onUploadComplete={mockOnUploadComplete} 
      />
    );

    expect(screen.getByText('Upload a Photo')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Photo')).toBeInTheDocument();
    expect(screen.getByLabelText('Caption')).toBeInTheDocument();
    expect(screen.getByLabelText('Alt Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Make this photo public')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload Photo' })).toBeInTheDocument();
  });

  test('handles file selection', () => {
    render(
      <PhotoUpload 
        token={mockToken} 
        eventId={mockEventId} 
        genre={mockGenre} 
        onUploadComplete={mockOnUploadComplete} 
      />
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Select Photo');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    expect(screen.getByRole('button', { name: 'Upload Photo' })).not.toBeDisabled();
  });

  test('disables upload button when no file is selected', () => {
    render(
      <PhotoUpload 
        token={mockToken} 
        eventId={mockEventId} 
        genre={mockGenre} 
        onUploadComplete={mockOnUploadComplete} 
      />
    );
    
    expect(screen.getByRole('button', { name: 'Upload Photo' })).toBeDisabled();
  });

  test('shows error message when upload fails', () => {
    // Mock the hook to return an error
    require('@/hooks/usePhotoUpload').usePhotoUpload.mockReturnValue({
      isUploading: false,
      uploadProgress: 0,
      uploadError: 'Failed to upload photo',
      uploadPhoto: jest.fn().mockResolvedValue(undefined)
    });

    render(
      <PhotoUpload 
        token={mockToken} 
        eventId={mockEventId} 
        genre={mockGenre} 
        onUploadComplete={mockOnUploadComplete} 
      />
    );
    
    expect(screen.getByText('Failed to upload photo')).toBeInTheDocument();
  });

  test('shows progress bar during upload', () => {
    // Mock the hook to show uploading state
    require('@/hooks/usePhotoUpload').usePhotoUpload.mockReturnValue({
      isUploading: true,
      uploadProgress: 50,
      uploadError: null,
      uploadPhoto: jest.fn().mockResolvedValue(undefined)
    });

    render(
      <PhotoUpload 
        token={mockToken} 
        eventId={mockEventId} 
        genre={mockGenre} 
        onUploadComplete={mockOnUploadComplete} 
      />
    );
    
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Uploading...' })).toBeDisabled();
  });
});