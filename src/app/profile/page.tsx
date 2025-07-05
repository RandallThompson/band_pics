'use server';

import Image from 'next/image';
import { UserModel, PhotoModel } from '@/lib/database';

export default async function ProfilePage() {
  const userId = 1; // Demo user
  const userModel = new UserModel();
  const photoModel = new PhotoModel();

  const user = userModel.getUserById(userId);
  const photos = photoModel.getPhotosByUser(userId);

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary-100">My Profile</h1>
      {user && (
        <div className="flex items-center mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4">
            <Image
              src={user.profile_image_url || 'https://via.placeholder.com/80'}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary-100">
              {user.username}
            </h2>
            {user.bio && (
              <p className="text-primary-300">{user.bio}</p>
            )}
            <p className="text-primary-300 mt-1">
              Total Photos Uploaded: {photos.length}
            </p>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4 text-primary-100">My Photos</h3>
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="card relative group">
              <div className="relative w-full h-40">
                <Image
                  src={photo.blob_url}
                  alt={photo.alt_text || 'User photo'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                {photo.caption && (
                  <p className="text-sm text-primary-200 mb-2">{photo.caption}</p>
                )}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-700 text-white text-xs py-1 rounded hover:bg-gray-600 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-600 text-white text-xs py-1 rounded hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-primary-300">You haven&apos;t uploaded any photos yet.</p>
      )}
    </div>
  );
}
