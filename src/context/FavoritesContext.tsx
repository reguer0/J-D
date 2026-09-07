'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Card } from '@/types';

interface FavoritesContextType {
  favorites: Card[];
  toggleFavorite: (card: Card) => void;
  isFavorite: (cardId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Card[]>([]);

  const toggleFavorite = (card: Card) => {
    setFavorites(current => {
      const exists = current.find(f => f.id === card.id);
      if (exists) {
        return current.filter(f => f.id !== card.id);
      }
      return [...current, card];
    });
  };

  const isFavorite = (cardId: string) => favorites.some(f => f.id === cardId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
