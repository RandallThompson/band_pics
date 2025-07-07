import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

const events = [
  {
    id: 1,
    title: 'Buffalo Summer Jam',
    date: '2025-07-12',
    venue: 'Canalside Buffalo',
    description: 'A celebration of Buffalo bands and summer vibes on the waterfront.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: "Rockin' at Town Ballroom",
    date: '2025-08-05',
    venue: 'Town Ballroom',
    description: "Buffalo's best rock bands take the stage for a night of unforgettable music.",
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Jazz Under the Stars',
    date: '2025-09-01',
    venue: 'Delaware Park',
    description: "Smooth jazz and cool breezes in Buffalo's beautiful park setting.",
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-72 md:h-96 flex items-center justify-center text-center mb-12">
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80"
          alt="Buffalo Concert Crowd"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10" />
        <div className="relative z-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">Buffalo Concert Events</h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto mb-6">Experience the best live music Buffalo has to offer. Discover upcoming concerts, venues, and more!</p>
          <Link href="/" className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Home
          </Link>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-100 mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <div key={event.id} className="bg-white/90 rounded-xl shadow-lg overflow-hidden flex flex-col">
              <img
                src={event.image}
                alt={event.title}
                className="h-48 w-full object-cover object-center"
              />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <CalendarIcon className="w-5 h-5 mr-1" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <MapPinIcon className="w-5 h-5 mr-1" />
                  {event.venue}
                </div>
                <p className="text-gray-700 flex-1 mb-4">{event.description}</p>
                <Link
                  href={`/events/${event.id}`}
                  className="mt-auto inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 