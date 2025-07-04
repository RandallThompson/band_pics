'use client';

import Image from 'next/image';

interface ImageData {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

interface GalleryProps {
  title: string;
  id: string;
  images: ImageData[];
  searchTerm?: string;
}

export default function Gallery({ title, id, images, searchTerm }: GalleryProps) {
  const filteredImages = searchTerm 
    ? images.filter(image => 
        image.caption.toLowerCase().includes(searchTerm) || 
        image.alt.toLowerCase().includes(searchTerm)
      )
    : images;

  return (
    <section id={id} className="mb-12 p-6 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {title}
        </h2>
        {id !== 'recent-concerts' && (
          <a href={`#${id}`} className="text-pink-600 hover:text-pink-700 font-medium">
            View All {title}
          </a>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ display: searchTerm && !filteredImages.includes(image) ? 'none' : 'flex' }}
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-lg font-bold text-gray-800 mb-1">
                  {image.caption}
                </p>
                {id === 'recent-concerts' && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">July 3, 2025</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full mr-2">Fan Favorite</span>
                      <span className="text-xs text-gray-500">42 contributions</span>
                    </div>
                  </div>
                )}
                {id !== 'recent-concerts' && (
                  <button className="mt-3 w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors">
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-600">
            {searchTerm 
              ? `No results found for: ${searchTerm}` 
              : `No images yet. Add your ${title.toLowerCase()} pictures to the /${id} directory.`
            }
          </p>
        )}
      </div>
    </section>
  );
}