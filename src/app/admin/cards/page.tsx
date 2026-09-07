'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { pokemonCards } from '@/data/cards';
import { Card } from '@/types';
import Header from '@/components/Header';

export default function AdminCardsPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>(pokemonCards);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    description: '',
    condition: 'new' as Card['condition'],
    availability: 'in_stock' as Card['availability'],
    rarity: '',
    set: '',
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      price: '',
      description: '',
      condition: 'new',
      availability: 'in_stock',
      rarity: '',
      set: '',
    });
    setEditingCard(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCard) {
      setCards(cards.map(c =>
        c.id === editingCard.id
          ? { ...c, ...formData, price: parseFloat(formData.price) }
          : c
      ));
    } else {
      const newCard: Card = {
        id: String(Date.now()),
        ...formData,
        price: parseFloat(formData.price),
        category: 'pokemon',
      };
      setCards([...cards, newCard]);
    }

    resetForm();
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      image: card.image,
      price: String(card.price),
      description: card.description,
      condition: card.condition,
      availability: card.availability,
      rarity: card.rarity,
      set: card.set,
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta carta?')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestionar Cartas</h1>
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            + Añadir carta
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingCard ? 'Editar carta' : 'Añadir nueva carta'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Set</label>
                <input
                  type="text"
                  value={formData.set}
                  onChange={(e) => setFormData({ ...formData, set: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rareza</label>
                <input
                  type="text"
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as Card['condition'] })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value="new">Nuevo</option>
                  <option value="mint">Mint</option>
                  <option value="good">Buen estado</option>
                  <option value="used">Usado</option>
                  <option value="poor">Regular</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value as Card['availability'] })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value="in_stock">En stock</option>
                  <option value="low_stock">Pocas unidades</option>
                  <option value="out_of_stock">Agotado</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                  rows={3}
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  {editingCard ? 'Guardar cambios' : 'Añadir carta'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Set</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cards.map(card => (
                <tr key={card.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={card.image} alt={card.name} className="w-10 h-10 object-contain mr-3" />
                      <span className="font-medium text-gray-800">{card.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{card.set}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">€{card.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      card.availability === 'in_stock' ? 'bg-green-100 text-green-800' :
                      card.availability === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {card.availability === 'in_stock' ? 'En stock' :
                       card.availability === 'low_stock' ? 'Pocas' : 'Agotado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(card)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
