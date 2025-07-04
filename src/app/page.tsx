'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import UpcomingEvents from '@/components/UpcomingEvents';
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
    <div className="max-w-6xl mx-auto p-5 font-sans leading-relaxed text-gray-800">
      <Header onSearch={handleSearch} onReset={handleReset} />
      
      <main>
        {/* New component for upcoming events in Buffalo */}
        <UpcomingEvents />
        
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
