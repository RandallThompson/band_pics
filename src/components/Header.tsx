'use client';

import { useState } from 'react';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onReset: () => void;
}

export default function Header({ onSearch, onReset }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <header className="bg-gray-100 p-5 mb-5 rounded-md">
      <h1 className="mb-4 text-center text-2xl font-bold">Band Pics</h1>
      
      <nav className="mb-4">
        <ul className="flex justify-center list-none">
          <li className="mx-2">
            <a href="#rock" className="text-gray-800 font-bold hover:text-blue-600 no-underline">
              Rock
            </a>
          </li>
          <li className="mx-2">
            <a href="#jazz" className="text-gray-800 font-bold hover:text-blue-600 no-underline">
              Jazz
            </a>
          </li>
          <li className="mx-2">
            <a href="#pop" className="text-gray-800 font-bold hover:text-blue-600 no-underline">
              Pop
            </a>
          </li>
          <li className="mx-2">
            <a href="#events" className="text-gray-800 font-bold hover:text-blue-600 no-underline">
              Events
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex justify-center mb-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for bands or events..."
          className="p-2 w-80 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white border-none rounded-r-md cursor-pointer hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 text-white border-none rounded-md cursor-pointer ml-1 hover:bg-gray-700"
        >
          Reset
        </button>
      </div>
    </header>
  );
}