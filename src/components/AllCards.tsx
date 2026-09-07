'use client';

import { useCards } from '@/context/CardsContext';
import PokemonCard from './PokemonCard';

interface AllCardsProps {
  searchQuery?: string;
}

export default function AllCards({ searchQuery = '' }: AllCardsProps) {
  const { cards, loading } = useCards();

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.set.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.rarity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron cartas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCards.map(card => (
            <PokemonCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}