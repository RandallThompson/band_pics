import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { put } from '@vercel/blob';
import { PhotoModel, SessionModel } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

// Mock the database models
vi.mock('@/lib/database', () => ({
  PhotoModel: vi.fn().mockImplementation(() => ({
    createPhoto: vi.fn().mockReturnValue({
      id: 1,
      user_id: 1,
      blob_url: 'https://example.com/test.jpg',
      caption: 'Test Caption',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: true
    }),
    getPhotoById: vi.fn().mockReturnValue({
      id: 1,
      user_id: 1,
      blob_url: 'https://example.com/test.jpg',
      caption: 'Test Caption',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: true
    })
  })),
  SessionModel: vi.fn().mockImplementation(() => ({
    getSessionByToken: vi.fn().mockReturnValue({
      id: 1,
      user_id: 1,
      session_token: 'test-token',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString()
    })
  }))
}));

// Mock the Vercel Blob SDK
vi.mock('@vercel/blob', () => ({
  put: vi.fn().mockResolvedValue({
    url: 'https://example.com/test.jpg',
    uploadUrl: 'https://upload.example.com/test.jpg'
  })
}));

// Mock NextRequest and NextResponse
vi.mock('next/server', () => {
  const originalModule = vi.importActual('next/server');
  return {
    ...originalModule,
    NextRequest: vi.fn().mockImplementation((input, init) => ({
      headers: {
        get: vi.fn().mockImplementation((name) => {
          if (name === 'authorization') return 'Bearer test-token';
          return null;
        })
      },
      json: vi.fn().mockResolvedValue({
        filename: 'test.jpg',
        contentType: 'image/jpeg',
        blob_url: 'https://example.com/test.jpg',
        caption: 'Test Caption',
        alt_text: 'Test Alt Text',
        genre: 'rock',
        is_public: true
      }),
      url: 'https://example.com/api/upload'
    })),
    NextResponse: {
      json: vi.fn().mockImplementation((body, options) => ({
        body,
        options
      }))
    }
  };
});

describe('Photo Upload API', () => {
  let uploadHandler;
  let photoHandler;
  
  beforeEach(async () => {
    // Import the handlers dynamically to ensure mocks are applied
    const uploadModule = await import('@/app/api/upload/route');
    const photoModule = await import('@/app/api/photos/route');
    
    uploadHandler = uploadModule.POST;
    photoHandler = photoModule.POST;
    
    // Reset mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should generate a secure upload URL', async () => {
    const request = new NextRequest('https://example.com/api/upload');
    const response = await uploadHandler(request);
    
    expect(put).toHaveBeenCalled();
    expect(response.body).toHaveProperty('uploadUrl');
    expect(response.body).toHaveProperty('blobUrl');
  });
  
  it('should save photo information after upload', async () => {
    const request = new NextRequest('https://example.com/api/photos');
    const response = await photoHandler(request);
    
    const photoModel = new PhotoModel();
    expect(photoModel.createPhoto).toHaveBeenCalled();
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('blob_url');
    expect(response.options.status).toBe(201);
  });
  
  it('should require authentication for upload', async () => {
    // Override the mock to simulate missing auth token
    vi.mocked(NextRequest).mockImplementationOnce(() => ({
      headers: {
        get: vi.fn().mockReturnValue(null)
      },
      json: vi.fn(),
      url: 'https://example.com/api/upload'
    }));
    
    const request = new NextRequest('https://example.com/api/upload');
    const response = await uploadHandler(request);
    
    expect(response.body).toHaveProperty('error');
    expect(response.options.status).toBe(401);
  });
  
  it('should require blob_url when saving photo information', async () => {
    // Override the mock to simulate missing blob_url
    vi.mocked(NextRequest).mockImplementationOnce(() => ({
      headers: {
        get: vi.fn().mockReturnValue('Bearer test-token')
      },
      json: vi.fn().mockResolvedValue({
        caption: 'Test Caption',
        alt_text: 'Test Alt Text'
      }),
      url: 'https://example.com/api/photos'
    }));
    
    const request = new NextRequest('https://example.com/api/photos');
    const response = await photoHandler(request);
    
    expect(response.body).toHaveProperty('error');
    expect(response.options.status).toBe(400);
  });
});