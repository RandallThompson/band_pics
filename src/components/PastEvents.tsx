'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PastEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  imageUrl: string;
  photoCount: number;
}

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

function PhotoUploadModal({ isOpen, onClose, eventId, eventTitle }: PhotoUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select at least one photo to upload');
      return;
    }
    
    // In a real app, this would upload to a server
    console.log('Uploading photos for event:', eventId, {
      files: Array.from(selectedFiles).map(f => f.name),
      description
    });
    
    alert(`Successfully uploaded ${selectedFiles.length} photo(s) for ${eventTitle}!`);
    
    // Reset form
    setSelectedFiles(null);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upload Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">Upload your photos from: <strong>{eventTitle}</strong></p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">
              Select Photos
            </label>
            <input
              type="file"
              id="photos"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {selectedFiles && (
              <p className="text-sm text-gray-500 mt-1">
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Tell us about your experience at this concert..."
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
          >
            Upload Photos
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PastEvents() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string } | null>(null);

  // Mock data for past events
  const pastEvents: PastEvent[] = [
    {
      id: '1',
      title: 'Rock Night at Buffalo Iron Works',
      date: '2025-07-02',
      venue: 'Buffalo Iron Works',
      imageUrl: 'https://via.placeholder.com/300x200?text=Rock+Night',
      photoCount: 42
    },
    {
      id: '2',
      title: 'Jazz Evening at Town Ballroom',
      date: '2025-07-01',
      venue: 'Town Ballroom',
      imageUrl: 'https://via.placeholder.com/300x200?text=Jazz+Evening',
      photoCount: 28
    },
    {
      id: '3',
      title: 'Pop Concert at Mohawk Place',
      date: '2025-06-30',
      venue: 'Mohawk Place',
      imageUrl: 'https://via.placeholder.com/300x200?text=Pop+Concert',
      photoCount: 67
    },
    {
      id: '4',
      title: 'Blues Night at Sportsmen\'s Tavern',
      date: '2025-06-29',
      venue: 'Sportsmen\'s Tavern',
      imageUrl: 'https://via.placeholder.com/300x200?text=Blues+Night',
      photoCount: 35
    },
    {
      id: '5',
      title: 'Classical Performance at Kleinhans Music Hall',
      date: '2025-06-28',
      venue: 'Kleinhans Music Hall',
      imageUrl: 'https://via.placeholder.com/300x200?text=Classical+Performance',
      photoCount: 19
    },
    {
      id: '6',
      title: 'Indie Rock Show at Buffalo Iron Works',
      date: '2025-06-27',
      venue: 'Buffalo Iron Works',
      imageUrl: 'https://via.placeholder.com/300x200?text=Indie+Rock',
      photoCount: 53
    }
  ];

  const handleUploadClick = (event: PastEvent) => {
    setSelectedEvent({ id: event.id, title: event.title });
    setUploadModalOpen(true);
  };

  return (
    <section id="past-events" className="mb-8 p-5 bg-white rounded-md shadow-sm">
      <h2 className="mb-4 pb-2 border-b border-gray-300 text-2xl font-bold text-gray-800">
        Past Concerts
      </h2>
      
      <p className="text-gray-600 mb-6">
        Browse through recent concerts and upload your photos to share with the community!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastEvents.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full h-48">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {event.photoCount} photos
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Venue:</span> {event.venue}
              </p>
              
              <div className="flex space-x-2">
                <a 
                  href={`/events/${event.id}`}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
                >
                  View Gallery
                </a>
                <button
                  onClick={() => handleUploadClick(event)}
                  className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
                >
                  Upload Photos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedEvent && (
        <PhotoUploadModal
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setSelectedEvent(null);
          }}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
        />
      )}
    </section>
  );
}