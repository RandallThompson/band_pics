'use client';

import { useState, useEffect } from 'react';

export interface ImageData {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

export interface GenreImages {
  rock: ImageData[];
  jazz: ImageData[];
  pop: ImageData[];
  events: ImageData[];
}

export function useImages() {
  const [images, setImages] = useState<GenreImages>({
    rock: [],
    jazz: [],
    pop: [],
    events: []
  });

  useEffect(() => {
    // Simulate loading images - in a real app, this would fetch from an API
    const loadImages = () => {
      const genres = ['rock', 'jazz', 'pop', 'events'] as const;
      const newImages: GenreImages = {
        rock: [],
        jazz: [],
        pop: [],
        events: []
      };

      genres.forEach(genre => {
        for (let i = 1; i <= 4; i++) {
          newImages[genre].push({
            id: i,
            src: `https://via.placeholder.com/300x200?text=${genre.charAt(0).toUpperCase() + genre.slice(1)}+Band+${i}`,
            alt: `${genre} band ${i}`,
            caption: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Band ${i}`
          });
        }
      });

      setImages(newImages);
    };

    loadImages();
  }, []);

  return images;
}