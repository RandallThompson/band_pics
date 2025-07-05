'use client';

import { useState } from 'react';

interface UploadUrlResponse {
  uploadUrl: string;
  blobUrl: string;
}

interface PhotoData {
  event_id?: number;
  blob_url: string;
  caption?: string;
  alt_text?: string;
  genre?: string;
  is_public?: boolean;
}

interface UsePhotoUploadResult {
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  uploadPhoto: (file: File, photoData: Omit<PhotoData, 'blob_url'>) => Promise<void>;
}

export function usePhotoUpload(token: string): UsePhotoUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadPhoto = async (file: File, photoData: Omit<PhotoData, 'blob_url'>) => {
    if (!token) {
      setUploadError('Authentication required');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Step 1: Get a secure upload URL
      const urlResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      });

      if (!urlResponse.ok) {
        const error = await urlResponse.json();
        throw new Error(error.error || 'Failed to get upload URL');
      }

      const { uploadUrl, blobUrl } = await urlResponse.json() as UploadUrlResponse;

      // Step 2: Upload the file directly to the blob storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      setUploadProgress(50);

      // Step 3: Save the photo information in our database
      const saveResponse = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...photoData,
          blob_url: blobUrl
        })
      });

      if (!saveResponse.ok) {
        const error = await saveResponse.json();
        throw new Error(error.error || 'Failed to save photo information');
      }

      setUploadProgress(100);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadError,
    uploadPhoto
  };
}