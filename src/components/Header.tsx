'use client';

import { useState } from 'react';
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

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      alert('Please enter a search term');
      return;
    }
    onSearch(searchTerm.toLowerCase());
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
    <header className="bg-black text-white p-5 mb-5">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-pink-500">Band Pics</h1>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleAuthClick('signup')}
              className="text-white hover:text-pink-500 transition-colors"
            >
              Sign Up
            </button>
            <button 
              onClick={() => handleAuthClick('login')}
              className="text-white hover:text-pink-500 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <nav className="mb-4 md:mb-0">
            <ul className="flex space-x-6 list-none">
              <li>
                <a href="#upcoming-events" className="text-white font-medium hover:text-pink-500 transition-colors no-underline">
                  Buffalo Events
                </a>
              </li>
              <li>
                <button 
                  onClick={onShowPastEvents}
                  className="text-white font-medium hover:text-pink-500 transition-colors no-underline"
                >
                  Recent Concerts
                </button>
              </li>
              <li>
                <a href="#social-feed" className="text-white font-medium hover:text-pink-500 transition-colors no-underline">
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
              className="p-3 w-full md:w-80 bg-gray-800 text-white border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-pink-600 text-white border-none rounded-r-md cursor-pointer hover:bg-pink-700 transition-colors"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-gray-700 text-white border-none rounded-md cursor-pointer ml-2 hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Discover Live Music Near You</h2>
          <p className="text-lg mb-4">Track your favorite artists and never miss a show</p>
          <button className="bg-white text-pink-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
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