'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import SocialFeed from '@/components/SocialFeed';
import UpcomingEvents from '@/components/UpcomingEvents';
import PastEvents from '@/components/PastEvents';
import { useImages } from '@/hooks/useImages';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false);
  const images = useImages();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  const handleShowPastEvents = () => {
    setShowPastEvents(true);
  };

  const handleBackToMain = () => {
    setShowPastEvents(false);
  };

  return (
    <div className="font-sans leading-relaxed text-primary-100 min-h-screen">
      <Header 
        onSearch={handleSearch} 
        onReset={handleReset} 
        onShowPastEvents={handleShowPastEvents}
      />
      
      <main className="max-w-6xl mx-auto px-5">
        {showPastEvents ? (
          <div>
            <div className="mb-6">
              <button
                onClick={handleBackToMain}
                className="bg-primary-700 text-primary-100 py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
              >
                ← Back to Main
              </button>
            </div>
            <PastEvents />
          </div>
        ) : (
          <>
            {/* New component for upcoming events in Buffalo */}
            <UpcomingEvents />
            
            {/* Recent Concerts Section */}
            <section id="recent-concerts" className="mb-16">
          <div className="card p-6 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-primary-100">Last Night&apos;s Concerts</h2>
            <p className="text-primary-300 mb-8 max-w-3xl">
              Check out these amazing performances from yesterday. Our community has shared their favorite moments and photos from these unforgettable shows.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {images.events.slice(0, 3).map((image) => (
                <div key={image.id} className="card">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image 
                      src={image.src} 
                      alt={`Recent concert: ${image.caption}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h3 className="font-bold text-lg">{image.caption} Live</h3>
                        <p className="text-sm">July 3, 2025 • New York, NY</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-accent-400">42 fan photos</span>
                      <span className="badge">Sold Out</span>
                    </div>
                    <div className="flex -space-x-2 mb-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                          <Image 
                            src={`https://via.placeholder.com/50?text=Fan${i}`} 
                            alt={`Fan ${i}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 20px, 32px"
                          />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-primary-700 bg-accent-500 flex items-center justify-center text-white text-xs">
                        +38
                      </div>
                    </div>
                    <button className="btn-primary w-full">
                      View Gallery
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleShowPastEvents}
                className="btn-secondary font-bold"
              >
                View All Recent Concerts
              </button>
            </div>
          </div>
          
          {/* Fan Contributions Collage */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-100">Top Fan Contributions</h2>
              <a href="#" className="text-accent-400 hover:text-accent-300 font-medium">
                Submit Your Photos
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="relative group overflow-hidden rounded-md">
                  <div className="aspect-square bg-gray-200 relative">
                    <Image 
                      src={`https://via.placeholder.com/300x300?text=Fan+Photo+${i+1}`} 
                      alt={`Fan contribution ${i+1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-accent-500 text-white py-1 px-3 rounded-full text-sm hover:bg-accent-700 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Social Media Feed Section */}
        <SocialFeed />
        </>
        )}
      </main>

      <Footer />
    </div>
  );
}
