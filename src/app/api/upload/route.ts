import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { SessionModel } from '@/lib/database';

const sessionModel = new SessionModel();

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const session = sessionModel.getSessionByToken(token);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }
    
    // Get file information from request
    const { filename, contentType } = await request.json();
    
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and content type are required' },
        { status: 400 }
      );
    }
    
    // Generate a unique upload URL
    const blob = await put(filename, null, {
      access: 'public',
      contentType,
      multipart: true,
    });
    
    return NextResponse.json({
      uploadUrl: blob.uploadUrl,
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}