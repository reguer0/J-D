'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { pokemonCards } from '@/data/cards';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import LoginPromptModal from '@/components/LoginPromptModal';
import Link from 'next/link';

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

export default function CardDetail() {
  const params = useParams();
  const card = pokemonCards.find(c => c.id === params.id);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Carta no encontrada</h1>
          <Link href="/" className="text-red-600 hover:text-red-700 font-medium">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="text-red-600 hover:text-red-700 font-medium mb-6 inline-block">
          ← Volver a cartas
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
              <img
                src={card.image}
                alt={card.name}
                className="max-h-96 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-black text-gray-800">{card.name}</h1>
                <button
                  onClick={handleToggleFavorite}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  {isFavorite(card.id) ? '❤️' : '🤍'}
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">
                  {card.rarity}
                </span>
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {card.set}
                </span>
              </div>

              <p className="text-gray-600 text-lg mb-6">{card.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <p className="font-bold text-gray-800">{conditionLabels[card.condition]}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Disponibilidad</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${availabilityColors[card.availability]}`}>
                    {availabilityLabels[card.availability]}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-black text-red-600">€{card.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={card.availability === 'out_of_stock'}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg"
                >
                  {card.availability === 'out_of_stock' ? 'Agotado' : 'Añadir al carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action={modalAction}
      />
    </div>
  );
}
