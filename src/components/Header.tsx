'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onReset: () => void;
  onShowPastEvents: () => void;
}

export default function Header({ onSearch, onReset, onShowPastEvents }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      alert('Please enter a search term');
      return;
    }
    
    // Navigate to the search page with the query parameter
    router.push(`/search?q=${encodeURIComponent(searchTerm.toLowerCase())}`);
    setSearchTerm('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    onReset();
  };

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <header className="bg-primary-900/90 backdrop-blur-sm text-white p-5 mb-5 border-b border-primary-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-accent-400">Band Pics</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleAuthClick('signup')}
              className="text-primary-200 hover:text-accent-400 transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => handleAuthClick('login')}
              className="text-primary-200 hover:text-accent-400 transition-colors"
            >
              Log In
            </button>
            <Link
              href="/profile"
              className="text-primary-200 hover:text-accent-400 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <nav className="mb-4 md:mb-0">
            <ul className="flex space-x-6 list-none">
              <li>
                <a href="#upcoming-events" className="text-primary-200 font-medium hover:text-accent-400 transition-colors no-underline">
                  Buffalo Events
                </a>
              </li>
              <li>
                <a href="#rock" className="text-primary-200 font-medium hover:text-accent-400 transition-colors no-underline">
                  Rock
                </a>
              </li>
              <li>
                <a href="#jazz" className="text-primary-200 font-medium hover:text-accent-400 transition-colors no-underline">
                  Jazz
                </a>
              </li>
              <li>
                <a href="#pop" className="text-primary-200 font-medium hover:text-accent-400 transition-colors no-underline">
                  Pop
                </a>
              </li>
              <li>
                <a href="#events" className="text-primary-200 font-medium hover:text-accent-400 transition-colors no-underline">
                  Events
                </a>
              </li>
              <li>
                <button 
                  onClick={onShowPastEvents}
                  className="text-primary-200 font-medium hover:text-accent-400 transition-colors no-underline"
                >
                  Recent Concerts
                </button>
              </li>
              <li>
                <a href="#social-feed" className="text-primary-200 font-medium hover:text-accent-400 transition-colors no-underline">
                  Social Feed
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for artists, concerts, venues..."
              className="p-3 w-full md:w-80 bg-gray-800 text-gray-100 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-blue-500 text-white border-none rounded-r-md cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-primary-700 text-primary-200 border-none rounded-md cursor-pointer ml-2 hover:bg-primary-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent-800 to-primary-800 p-8 rounded-lg text-center border border-primary-600">
          <h2 className="text-2xl font-bold mb-2 text-primary-100">Discover Live Music Near You</h2>
          <p className="text-lg mb-4 text-primary-200">Track your favorite artists and never miss a show</p>
          <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors">
            Find Concerts
          </button>
        </div>
      </div>
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
      />
    </header>
  );
}