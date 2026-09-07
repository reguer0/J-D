'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import PokemonCard from '@/components/PokemonCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tus favoritos ❤️</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tienes cartas favoritas aún</p>
            <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block">
              Explorar cartas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map(card => (
              <PokemonCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
