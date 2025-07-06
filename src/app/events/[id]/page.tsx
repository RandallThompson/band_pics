'use server';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPastEvents } from '@/lib/database/models/event';
import { PhotoModel } from '@/lib/database/models/photo';
import Button from '@/components/Button';

export default async function EventGalleryPage({ params }) {
  const eventId = params.id;

  // Fetch event details
  const events = await getPastEvents();
  const event = events.find(e => e.id === Number(eventId));
  
  if (!event) {
    return notFound();
  }
  
  // Fetch all photos for this event (both user-uploaded and social media)
  const photoModel = new PhotoModel();
  const photos = await photoModel.getMockEventPhotos(eventId);
  
  // Sort photos chronologically by timestamp
  const sortedPhotos = [...photos].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600">
          <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Venue:</span> {event.venue}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Photos:</span> {sortedPhotos.length}
        </p>
      </div>
      
      {sortedPhotos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedPhotos.map((photo) => (
            <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-full h-64">
                <Image
                  src={photo.url}
                  alt={photo.caption || `Photo from ${event.title}`}
                  fill={true}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {photo.source && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {photo.source}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {photo.caption && (
                  <p className="font-medium mb-1">{photo.caption}</p>
                )}
                <p className="text-sm text-gray-600">
                  {new Date(photo.timestamp).toLocaleString()}
                </p>
                {photo.username && (
                  <p className="text-sm text-gray-600">
                    By: {photo.username}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No photos available for this event yet.</p>
          <p className="mt-2">Be the first to upload your photos!</p>
        </div>
      )}
    </div>
  );
}