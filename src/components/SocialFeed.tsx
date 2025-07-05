'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram';
  content: string;
  imageUrl: string;
  postUrl: string;
  date: string;
  author: string;
  venue: string;
}

export default function SocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVenue, setActiveVenue] = useState<string>('all');

  useEffect(() => {
    // In a real application, this would fetch from an actual API
    // For demonstration purposes, we're using mock data
    const fetchSocialPosts = () => {
      setLoading(true);
      
      try {
        // Mock data for demonstration with venue-specific posts
        const mockPosts: SocialPost[] = [
          {
            id: 'fb1',
            platform: 'facebook',
            content: 'Amazing show tonight at Buffalo Iron Works! #livemusic #buffalo',
            imageUrl: 'https://via.placeholder.com/400x300?text=Buffalo+Iron+Works+Event',
            postUrl: 'https://facebook.com/post/1',
            date: '2025-07-03',
            author: 'Buffalo Music Lovers',
            venue: 'Buffalo Iron Works'
          },
          {
            id: 'ig1',
            platform: 'instagram',
            content: 'Incredible performance at @TownBallroom last night! #musicscene',
            imageUrl: 'https://via.placeholder.com/400x400?text=Town+Ballroom+Performance',
            postUrl: 'https://instagram.com/p/1',
            date: '2025-07-02',
            author: '@music_photographer',
            venue: 'Town Ballroom'
          },
          {
            id: 'fb2',
            platform: 'facebook',
            content: 'Don\'t miss our upcoming show at Mohawk Place this weekend! #buffalony',
            imageUrl: 'https://via.placeholder.com/400x300?text=Mohawk+Place+Show',
            postUrl: 'https://facebook.com/post/2',
            date: '2025-07-01',
            author: 'Local Band',
            venue: 'Mohawk Place'
          },
          {
            id: 'ig2',
            platform: 'instagram',
            content: 'Great crowd tonight at @SportsmensTavern! Thanks for coming out! #livemusic',
            imageUrl: 'https://via.placeholder.com/400x400?text=Sportsmens+Tavern+Crowd',
            postUrl: 'https://instagram.com/p/2',
            date: '2025-06-30',
            author: '@venue_official',
            venue: 'Sportsmen\'s Tavern'
          },
          {
            id: 'fb3',
            platform: 'facebook',
            content: 'Beautiful classical performance at Kleinhans Music Hall tonight! #classical #buffalo',
            imageUrl: 'https://via.placeholder.com/400x300?text=Kleinhans+Classical',
            postUrl: 'https://facebook.com/post/3',
            date: '2025-06-29',
            author: 'Classical Music Buffalo',
            venue: 'Kleinhans Music Hall'
          },
          {
            id: 'ig3',
            platform: 'instagram',
            content: 'Another epic night at @BuffaloIronWorks! The energy was incredible! 🔥',
            imageUrl: 'https://via.placeholder.com/400x400?text=Iron+Works+Epic+Night',
            postUrl: 'https://instagram.com/p/3',
            date: '2025-06-28',
            author: '@concert_fan_buffalo',
            venue: 'Buffalo Iron Works'
          }
        ];
        
        setPosts(mockPosts);
        setError(null);
      } catch (err) {
        console.error('Error fetching social posts:', err);
        setError('Failed to load social media posts');
      } finally {
        setLoading(false);
      }
    };

    fetchSocialPosts();
  }, []);

  // Get unique venues for filtering
  const venues = ['all', ...Array.from(new Set(posts.map(post => post.venue)))];
  
  const filteredPosts = activeVenue === 'all' 
    ? posts 
    : posts.filter(post => post.venue === activeVenue);

  return (
    <section id="social-feed" className="mb-8 p-5 bg-gray-50 rounded-md">
      <h2 className="mb-4 pb-2 border-b border-gray-300 text-xl font-semibold">
        Buffalo Music Venue Social Feed
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          Filter by venue to see posts tagged at specific locations:
        </p>
        <div className="flex flex-wrap gap-2">
          {venues.map((venue) => (
            <button 
              key={venue}
              onClick={() => setActiveVenue(venue)}
              className={`px-4 py-2 rounded-md text-sm ${
                activeVenue === venue 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {venue === 'all' ? 'All Venues' : venue}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading social media posts...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredPosts.length === 0 && (
        <div className="text-center py-8">
          <p>No posts found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="p-3 bg-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                  {post.platform === 'facebook' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E1306C">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{post.author}</span>
                  <span className="text-xs text-gray-500">at {post.venue}</span>
                </div>
              </div>
              <span className="text-xs text-gray-500">{post.date}</span>
            </div>
            
            <div className="relative w-full h-48">
              <Image
                src={post.imageUrl}
                alt={`${post.platform} post by ${post.author}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            <div className="p-4">
              <p className="text-sm mb-2">{post.content}</p>
              <a 
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View original post
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}