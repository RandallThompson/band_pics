'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';

interface PhotoUploadProps {
  token: string;
  eventId?: number;
  genre?: string;
  onUploadComplete?: () => void;
}

export default function PhotoUpload({ token, eventId, genre, onUploadComplete }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, uploadProgress, uploadError, uploadPhoto } = usePhotoUpload(token);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      return;
    }

    const success = await uploadPhoto(file, {
      event_id: eventId,
      caption,
      alt_text: altText,
      genre,
      is_public: isPublic
    });

    // Reset form after successful upload
    if (success) {
      setFile(null);
      setCaption('');
      setAltText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    }
  };

  return (
    <div className="p-6 card">
      <h3 className="text-xl font-bold text-primary-100 mb-4">Upload a Photo</h3>
      
      {uploadError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {uploadError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-primary-200 mb-2">
            Select Photo
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-primary-300 rounded"
            disabled={isUploading}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-primary-200 mb-2">
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2 border border-primary-300 rounded"
            disabled={isUploading}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-primary-200 mb-2">
            Alt Text
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full p-2 border border-primary-300 rounded"
            placeholder="Describe the image for accessibility"
            disabled={isUploading}
          />
        </div>
        
        <div className="mb-4">
          <label className="flex items-center text-primary-200">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2"
              disabled={isUploading}
            />
            Make this photo public
          </label>
        </div>
        
        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-primary-300 rounded-full h-2.5">
              <div 
                className="bg-accent-400 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-primary-200 mt-1">
              {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
}