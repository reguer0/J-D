'use client';

import { useState } from 'react';
import { Card } from '@/types';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import LoginPromptModal from './LoginPromptModal';
import Link from 'next/link';

interface PokemonCardProps {
  card: Card;
}

const conditionLabels = {
  new: 'Nuevo',
  used: 'Usado',
  mint: 'Mint',
  good: 'Buen estado',
  poor: 'Regular',
};

const availabilityLabels = {
  in_stock: 'En stock',
  low_stock: 'Pocas unidades',
  out_of_stock: 'Agotado',
};

const availabilityColors = {
  in_stock: 'bg-green-100 text-green-800',
  low_stock: 'bg-yellow-100 text-yellow-800',
  out_of_stock: 'bg-red-100 text-red-800',
};

export default function PokemonCard({ card }: PokemonCardProps) {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  const handleAddToCart = () => {
    if (!user) {
      setModalAction('comprar');
      setShowLoginModal(true);
      return;
    }
    addToCart(card);
  };

  const handleToggleFavorite = () => {
    if (!user) {
      setModalAction('guardar en favoritos');
      setShowLoginModal(true);
      return;
    }
    toggleFavorite(card);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <Link href={`/card/${card.id}`}>
        <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 p-4 cursor-pointer">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-contain drop-shadow-lg"
          />
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            {card.rarity}
          </span>
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/card/${card.id}`} className="hover:text-red-600 transition-colors">
            <h3 className="font-bold text-lg text-gray-800">{card.name}</h3>
          </Link>
          <button
            onClick={handleToggleFavorite}
            className="text-2xl transition-transform hover:scale-110"
            title={user ? 'Añadir a favoritos' : 'Inicia sesión para guardar'}
          >
            {isFavorite(card.id) ? '❤️' : '🤍'}
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-2">{card.set}</p>

        <div className="flex gap-2 mb-3">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {conditionLabels[card.condition]}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${availabilityColors[card.availability]}`}>
            {availabilityLabels[card.availability]}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{card.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-red-600">€{card.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={card.availability === 'out_of_stock'}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Añadir al carrito
          </button>
        </div>
      </div>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action={modalAction}
      />
    </div>
  );
}
