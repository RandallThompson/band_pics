import { renderHook, act } from '@testing-library/react';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';

// Mock fetch
global.fetch = jest.fn();

describe('usePhotoUpload Hook', () => {
  const mockToken = 'test-token';
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockPhotoData = {
    event_id: 123,
    caption: 'Test Caption',
    alt_text: 'Test Alt Text',
    genre: 'rock',
    is_public: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default values', () => {
    const { result } = renderHook(() => usePhotoUpload(mockToken));
    
    expect(result.current.isUploading).toBe(false);
    expect(result.current.uploadProgress).toBe(0);
    expect(result.current.uploadError).toBeNull();
    expect(typeof result.current.uploadPhoto).toBe('function');
  });

  test('handles successful upload', async () => {
    // Mock successful responses
    (global.fetch as jest.Mock)
      // First call - get upload URL
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          uploadUrl: 'https://upload.example.com/test.jpg',
          blobUrl: 'https://example.com/test.jpg'
        })
      })
      // Second call - upload to blob storage
      .mockResolvedValueOnce({
        ok: true
      })
      // Third call - save photo info
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          id: 1,
          blob_url: 'https://example.com/test.jpg'
        })
      });

    const { result } = renderHook(() => usePhotoUpload(mockToken));
    
    await act(async () => {
      await result.current.uploadPhoto(mockFile, mockPhotoData);
    });
    
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(result.current.uploadProgress).toBe(100);
    expect(result.current.isUploading).toBe(false);
    expect(result.current.uploadError).toBeNull();
  });

  test('handles error when getting upload URL', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: 'Failed to get upload URL'
      })
    });

    const { result } = renderHook(() => usePhotoUpload(mockToken));
    
    await act(async () => {
      await result.current.uploadPhoto(mockFile, mockPhotoData);
    });
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.uploadError).toBe('Failed to get upload URL');
    expect(result.current.isUploading).toBe(false);
  });

  test('handles error when uploading to blob storage', async () => {
    // Mock responses
    (global.fetch as jest.Mock)
      // First call - get upload URL (success)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          uploadUrl: 'https://upload.example.com/test.jpg',
          blobUrl: 'https://example.com/test.jpg'
        })
      })
      // Second call - upload to blob storage (fail)
      .mockResolvedValueOnce({
        ok: false
      });

    const { result } = renderHook(() => usePhotoUpload(mockToken));
    
    await act(async () => {
      await result.current.uploadPhoto(mockFile, mockPhotoData);
    });
    
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result.current.uploadError).toBe('Failed to upload file');
    expect(result.current.isUploading).toBe(false);
  });

  test('handles error when saving photo information', async () => {
    // Mock responses
    (global.fetch as jest.Mock)
      // First call - get upload URL (success)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          uploadUrl: 'https://upload.example.com/test.jpg',
          blobUrl: 'https://example.com/test.jpg'
        })
      })
      // Second call - upload to blob storage (success)
      .mockResolvedValueOnce({
        ok: true
      })
      // Third call - save photo info (fail)
      .mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: 'Failed to save photo information'
        })
      });

    const { result } = renderHook(() => usePhotoUpload(mockToken));
    
    await act(async () => {
      await result.current.uploadPhoto(mockFile, mockPhotoData);
    });
    
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(result.current.uploadError).toBe('Failed to save photo information');
    expect(result.current.isUploading).toBe(false);
  });
});