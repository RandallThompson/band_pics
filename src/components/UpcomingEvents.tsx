'use client';

import Image from 'next/image';
import { useVenueEvents, VenueEvent } from '@/hooks/useVenueEvents';

export default function UpcomingEvents() {
  const { events, loading, error } = useVenueEvents();

  if (loading) {
    return (
      <section id="upcoming-events" className="mb-8 p-5 bg-gray-50 rounded-md">
        <h2 className="mb-4 pb-2 border-b border-gray-300 text-xl font-semibold">
          Upcoming Events in Buffalo
        </h2>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600">Loading upcoming events...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="upcoming-events" className="mb-8 p-5 bg-gray-50 rounded-md">
        <h2 className="mb-4 pb-2 border-b border-gray-300 text-xl font-semibold">
          Upcoming Events in Buffalo
        </h2>
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // Group events by source
  const eventsBySource: Record<string, VenueEvent[]> = {};
  events.forEach(event => {
    if (!eventsBySource[event.source]) {
      eventsBySource[event.source] = [];
    }
    eventsBySource[event.source].push(event);
  });

  return (
    <section id="upcoming-events" className="mb-8 p-5 bg-gray-50 rounded-md">
      <h2 className="mb-4 pb-2 border-b border-gray-300 text-xl font-semibold">
        Upcoming Events in Buffalo
      </h2>
      
      {events.length === 0 ? (
        <p className="text-gray-600">No upcoming events found.</p>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Data sources: {Object.keys(eventsBySource).join(', ')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="flex flex-col border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Venue:</span> {event.venue}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Source: {event.source}
                  </p>
                </div>
                <div className="p-4 pt-0">
                  <a 
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Get Tickets
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}