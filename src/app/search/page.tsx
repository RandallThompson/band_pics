import Link from 'next/link';

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-100">
        Search for Events
      </h1>
      
      <div className="text-center py-12 bg-primary-800/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-md border border-primary-700">
        <h2 className="text-xl font-semibold mb-4 text-primary-200">
          Enter an artist name in the search box above to find upcoming events
        </h2>
        <p className="text-primary-400 mb-6">
          Search for your favorite artists to discover when they&apos;re playing near you
        </p>
        <Link 
          href="/"
          className="bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 transition-colors inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}