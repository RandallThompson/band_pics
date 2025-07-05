import { NextRequest, NextResponse } from 'next/server';
import { PhotoModel, SessionModel } from '@/lib/database';

const photoModel = new PhotoModel();
const sessionModel = new SessionModel();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }
    
    const photo = photoModel.getPhotoById(id);
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const userId = session.user_id;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }
    
    // Check if photo exists and belongs to the user
    const existingPhoto = photoModel.getPhotoById(id);
    if (!existingPhoto) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    if (existingPhoto.user_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to update this photo' },
        { status: 403 }
      );
    }
    
    const photoData = await request.json();
    const updatedPhoto = photoModel.updatePhoto(id, {
      caption: photoData.caption,
      alt_text: photoData.alt_text,
      genre: photoData.genre,
      is_public: photoData.is_public
    });
    
    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const userId = session.user_id;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }
    
    // Check if photo exists and belongs to the user
    const existingPhoto = photoModel.getPhotoById(id);
    if (!existingPhoto) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    if (existingPhoto.user_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this photo' },
        { status: 403 }
      );
    }
    
    const success = photoModel.deletePhoto(id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete photo' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}