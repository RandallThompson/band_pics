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
    
    // For file uploads, we need to handle the actual file data
    // This endpoint should receive the file data directly
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Upload the file to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });
    
    return NextResponse.json({
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