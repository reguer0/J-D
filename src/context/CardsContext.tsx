'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card } from '@/types';
import { pokemonCards } from '@/data/cards';

interface CardsContextType {
  cards: Card[];
  loading: boolean;
  reloadCards: () => Promise<void>;
}

const CardsContext = createContext<CardsContextType | undefined>(undefined);

function mapCard(row: any): Card {
  return {
    id: row.id,
    name: row.name,
    image: row.image,
    price: Number(row.price),
    description: row.description || '',
    condition: row.condition as Card['condition'],
    availability: row.availability as Card['availability'],
    category: (row.category as Card['category']) || 'pokemon',
    rarity: row.rarity || '',
    set: row.set_name || '',
  };
}

export function CardsProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Card[]>(pokemonCards);
  const [loading, setLoading] = useState(true);

  const reloadCards = async () => {
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!hasSupabase) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/cards');
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setCards(data.map(mapCard));
      } else {
        setCards(pokemonCards);
      }
    } catch {
      setCards(pokemonCards);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadCards();
  }, []);

  return (
    <CardsContext.Provider value={{ cards, loading, reloadCards }}>
      {children}
    </CardsContext.Provider>
  );
}

export function useCards() {
  const context = useContext(CardsContext);
  if (!context) throw new Error('useCards must be used within CardsProvider');
  return context;
}