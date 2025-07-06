'use client';
import Gallery from '@/components/Gallery';
import { useImages } from '@/hooks/useImages';

export default function FolkPage() {
  const images = useImages();
  return (
    <div className="max-w-6xl mx-auto p-4">
      <Gallery title="Folk Bands" id="folk" images={images.folk} />
    </div>
  );
}
