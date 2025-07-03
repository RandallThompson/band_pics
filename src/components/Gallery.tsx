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
    <section id={id} className="mb-8 p-5 bg-gray-50 rounded-md">
      <h2 className="mb-4 pb-2 border-b border-gray-300 text-xl font-semibold">
        {title}
      </h2>
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div 
              key={image.id} 
              className="flex flex-col items-center mb-4"
              style={{ display: searchTerm && !filteredImages.includes(image) ? 'none' : 'flex' }}
            >
              <div className="relative w-full h-48 overflow-hidden rounded-md">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p className="mt-2 text-sm text-center font-bold">
                {image.caption}
              </p>
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