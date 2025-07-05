import { getDatabase } from '../connection';
import { v4 as uuidv4 } from 'uuid';

export interface Photo {
  id: string;
  eventId: string;
  url: string;
  caption: string | null;
  timestamp: string;
  username: string | null;
  source: string | null; // 'user-upload' or social media platform name
}

// Get all photos for a specific event
export async function getEventPhotos(eventId: string): Promise<Photo[]> {
  try {
    // In a real application, this would query the database
    // For now, we'll return mock data
    
    // Generate a mix of user-uploaded and social media photos
    const mockPhotos: Photo[] = [];
    
    // User-uploaded photos (more recent)
    for (let i = 1; i <= 8; i++) {
      const date = new Date();
      // Random time within the last 24 hours
      date.setHours(date.getHours() - Math.floor(Math.random() * 24));
      
      mockPhotos.push({
        id: uuidv4(),
        eventId,
        url: `https://via.placeholder.com/800x600?text=User+Photo+${i}`,
        caption: i % 3 === 0 ? `Great moment from the show! #${i}` : null,
        timestamp: date.toISOString(),
        username: `user${Math.floor(Math.random() * 100)}`,
        source: 'user-upload'
      });
    }
    
    // Social media photos (older)
    const socialSources = ['Instagram', 'Twitter', 'Facebook'];
    for (let i = 1; i <= 12; i++) {
      const date = new Date();
      // Random time within the last 48 hours, but before user uploads
      date.setHours(date.getHours() - (24 + Math.floor(Math.random() * 24)));
      
      const sourceIndex = Math.floor(Math.random() * socialSources.length);
      
      mockPhotos.push({
        id: uuidv4(),
        eventId,
        url: `https://via.placeholder.com/800x600?text=${socialSources[sourceIndex]}+Photo+${i}`,
        caption: i % 2 === 0 ? `Amazing concert! #music #live #${eventId}` : null,
        timestamp: date.toISOString(),
        username: `social_user${Math.floor(Math.random() * 100)}`,
        source: socialSources[sourceIndex]
      });
    }
    
    return mockPhotos;
  } catch (error) {
    console.error(`Error fetching photos for event ${eventId}:`, error);
    throw new Error(`Failed to fetch photos for event ${eventId}`);
  }
}

// Add a new photo
export async function addPhoto(photo: Omit<Photo, 'id'>): Promise<Photo> {
  try {
    const newPhoto: Photo = {
      ...photo,
      id: uuidv4()
    };
    
    // In a real application, this would insert into the database
    console.log('Adding new photo:', newPhoto);
    
    return newPhoto;
  } catch (error) {
    console.error('Error adding photo:', error);
    throw new Error('Failed to add photo');
  }
}