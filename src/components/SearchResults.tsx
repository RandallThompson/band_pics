'use client';

import Image from 'next/image';
import Link from 'next/link';
import { EventDisplay } from '@/lib/types';

interface SearchResultsProps {
  query: string;
  events: EventDisplay[];
  error: string | null;
}

export function SearchResults({ query, events, error }: SearchResultsProps) {
  // If there's no query, show a search prompt
  if (!query) {
    return (
      <div className="text-center py-12 card">
        <h2 className="text-xl font-semibold mb-4 text-primary-200">
          Enter an artist name in the search box above to find upcoming events
        </h2>
        <p className="text-primary-400 mb-6">
          Search for your favorite artists to discover when they&apos;re playing near you
        </p>
        <Link 
          href="/"
          className="btn-primary inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // If there's an error, show the error message
  if (error) {
    return (
      <div className="text-center py-8 card">
        <p className="text-red-400 mb-4">{error}</p>
        <Link 
          href="/"
          className="btn-primary inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // If there are no events, show a message
  if (events.length === 0) {
    return (
      <div className="text-center py-8 card">
        <h2 className="text-xl font-semibold mb-4 text-primary-200">
          No events found for &quot;{query}&quot;
        </h2>
        <p className="text-primary-400 mb-6">
          Try searching for a different artist or check back later
        </p>
        <Link 
          href="/"
          className="btn-primary inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format the time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show the events
  return (
    <div>
      <p className="mb-6 text-primary-300">
        Found {events.length} upcoming events for &quot;{query}&quot;
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="card flex flex-col">
            <div className="relative w-full h-48">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg">{event.artist}</h3>
                  <p className="text-sm">{event.venue}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex-grow">
              <h3 className="font-bold text-lg mb-2 text-primary-100">{event.title}</h3>
              <p className="text-sm text-primary-300 mb-1">
                <span className="font-semibold">Date:</span> {formatDate(event.date)}
              </p>
              <p className="text-sm text-primary-300 mb-1">
                <span className="font-semibold">Time:</span> {formatTime(event.date)}
              </p>
              <p className="text-sm text-primary-300 mb-1">
                <span className="font-semibold">Venue:</span> {event.venue}
              </p>
              <p className="text-sm text-primary-300 mb-3">
                <span className="font-semibold">Location:</span> {event.location}
              </p>
            </div>
            
            <div className="p-4 pt-0 mt-auto">
              {event.ticketUrl ? (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary block w-full text-center"
                >
                  Get Tickets
                </a>
              ) : (
                <button
                  disabled
                  className="btn-disabled block w-full text-center"
                >
                  Tickets Unavailable
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/"
          className="btn-secondary inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}