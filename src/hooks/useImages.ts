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
  folk: ImageData[];
  events: ImageData[];
}

export function useImages() {
  const [images, setImages] = useState<GenreImages>({
    rock: [],
    jazz: [],
    pop: [],
    folk: [],
    events: []
  });

  useEffect(() => {
    // Load images from the local public/images directory
    const loadImages = () => {
      const genres = ['rock', 'jazz', 'pop', 'folk', 'events'] as const;
      const newImages: GenreImages = {
        rock: [],
        jazz: [],
        pop: [],
        folk: [],
        events: []
      };

      genres.forEach((genre) => {
        for (let i = 1; i <= 4; i++) {
          newImages[genre].push({
            id: i,
            src: `/images/${genre}/${genre}${i}.svg`,
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