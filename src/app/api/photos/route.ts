import { NextRequest, NextResponse } from 'next/server';
import { PhotoModel, SessionModel } from '@/lib/database';

const photoModel = new PhotoModel();
const sessionModel = new SessionModel();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const genre = searchParams.get('genre');
    const eventId = searchParams.get('eventId');
    const search = searchParams.get('search');
    
    let photos;
    
    if (search) {
      photos = photoModel.searchPhotos(search, limit, offset);
    } else if (genre) {
      photos = photoModel.getPhotosByGenre(genre, limit, offset);
    } else if (eventId) {
      photos = photoModel.getPhotosByEvent(parseInt(eventId), limit, offset);
    } else {
      photos = photoModel.getAllPhotos(limit, offset);
    }
    
    const totalCount = photoModel.getPhotoCount();
    
    return NextResponse.json({
      photos,
      totalCount,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

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
    
    const userId = session.user_id;
    const photoData = await request.json();
    
    if (!photoData.blob_url) {
      return NextResponse.json(
        { error: 'Blob URL is required' },
        { status: 400 }
      );
    }
    
    // Create photo record
    const photo = photoModel.createPhoto({
      user_id: userId,
      event_id: photoData.event_id,
      blob_url: photoData.blob_url,
      caption: photoData.caption,
      alt_text: photoData.alt_text,
      genre: photoData.genre,
      is_public: photoData.is_public
    });
    
    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}