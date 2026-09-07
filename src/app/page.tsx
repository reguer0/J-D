'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import AllCards from '@/components/AllCards';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="bg-gradient-to-b from-red-500 to-red-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              J&D Cartas Pokémon
            </h1>
            <p className="text-xl text-red-100 mb-6">
              Las mejores cartas Pokémon al mejor precio
            </p>
          </div>
        </div>
        <SearchBar onSearch={setSearchQuery} />
        <AllCards searchQuery={searchQuery} />
      </main>
    </div>
  );
}
