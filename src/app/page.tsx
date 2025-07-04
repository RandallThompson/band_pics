'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import { useImages } from '@/hooks/useImages';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const images = useImages();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  return (
    <div className="font-sans leading-relaxed text-gray-800 bg-gray-50">
      <Header onSearch={handleSearch} onReset={handleReset} />
      
      <main className="max-w-6xl mx-auto px-5">
        {/* Recent Concerts Section */}
        <section id="recent-concerts" className="mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Last Night's Concerts</h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              Check out these amazing performances from yesterday. Our community has shared their favorite moments and photos from these unforgettable shows.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {images.events.slice(0, 3).map((image) => (
                <div key={image.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative w-full h-48 overflow-hidden">
                    <img 
                      src={image.src} 
                      alt={`Recent concert: ${image.caption}`}
                      className="w-full h-full object-cover"
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
                      <span className="text-sm font-medium text-pink-600">42 fan photos</span>
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Sold Out</span>
                    </div>
                    <div className="flex -space-x-2 mb-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                          <img 
                            src={`https://via.placeholder.com/50?text=Fan${i}`} 
                            alt={`Fan ${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-500 flex items-center justify-center text-white text-xs">
                        +38
                      </div>
                    </div>
                    <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                      View Gallery
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button className="bg-white text-pink-600 font-bold py-2 px-6 rounded-full border border-pink-600 hover:bg-pink-50 transition-colors">
                View All Recent Concerts
              </button>
            </div>
          </div>
          
          {/* Fan Contributions Collage */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Top Fan Contributions</h2>
              <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">
                Submit Your Photos
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="relative group overflow-hidden rounded-md">
                  <div className="aspect-square bg-gray-200 relative">
                    <img 
                      src={`https://via.placeholder.com/300x300?text=Fan+Photo+${i+1}`} 
                      alt={`Fan contribution ${i+1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-pink-600 text-white py-1 px-3 rounded-full text-sm">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Regular Genre Sections */}
        <Gallery 
          title="Rock Bands" 
          id="rock" 
          images={images.rock} 
          searchTerm={searchTerm}
        />
        <Gallery 
          title="Jazz Bands" 
          id="jazz" 
          images={images.jazz} 
          searchTerm={searchTerm}
        />
        <Gallery 
          title="Pop Bands" 
          id="pop" 
          images={images.pop} 
          searchTerm={searchTerm}
        />
        <Gallery 
          title="Events" 
          id="events" 
          images={images.events} 
          searchTerm={searchTerm}
        />
      </main>

      <Footer />
    </div>
  );
}
