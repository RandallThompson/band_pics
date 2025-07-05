import { NextRequest, NextResponse } from 'next/server';
import * as socialMediaClient from '@/lib/social-media/client';
import { PostModel } from '@/lib/database';

// Mock the NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      json: async () => body,
      status: init?.status || 200
    }))
  }
}));

// Mock the database
jest.mock('@/lib/database', () => ({
  PostModel: jest.fn().mockImplementation(() => ({
    createPost: jest.fn().mockReturnValue({ id: 1 })
  }))
}));

// Mock the social media client
jest.mock('@/lib/social-media/client', () => ({
  getRecentEventPosts: jest.fn()
}));

describe('Social Media Cron Job API', () => {
  it('should process social media posts', async () => {
    // Import the route handler after mocks are set up
    const { GET } = require('@/app/api/cron/social-media/route');
    
    // Setup mocks
    const mockRequest = {
      headers: { get: jest.fn().mockReturnValue('test-token') }
    } as unknown as NextRequest;
    
    const mockPosts = [
      { id: 'post1', platform: 'instagram', content: 'Test post', externalUrl: 'https://example.com', tags: [] }
    ];
    
    (socialMediaClient.getRecentEventPosts as jest.Mock).mockResolvedValue(mockPosts);
    
    // Call the handler
    const response = await GET(mockRequest);
    const data = await response.json();
    
    // Verify response
    expect(data.success).toBe(true);
    expect(data.message).toContain('Social media aggregation complete');
    
    // Verify the API was called
    expect(socialMediaClient.getRecentEventPosts).toHaveBeenCalled();
  });
  
  it('should handle errors', async () => {
    // Import the route handler after mocks are set up
    const { GET } = require('@/app/api/cron/social-media/route');
    
    // Setup mocks
    const mockRequest = {
      headers: { get: jest.fn().mockReturnValue('test-token') }
    } as unknown as NextRequest;
    
    (socialMediaClient.getRecentEventPosts as jest.Mock).mockRejectedValue(new Error('API error'));
    
    // Call the handler
    const response = await GET(mockRequest);
    
    // Verify error response
    expect(response.status).toBe(500);
  });
});