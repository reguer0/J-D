'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';
import Header from '@/components/Header';

const mockOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [
      { card: { id: '1', name: 'Charizard VMAX', image: 'https://images.pokemontcg.io/swsh35/010_hires.png', price: 89.99, description: '', condition: 'mint', availability: 'in_stock', category: 'pokemon', rarity: 'Rare Ultra', set: 'Shining Fates' }, quantity: 1 },
      { card: { id: '2', name: 'Pikachu VMAX', image: 'https://images.pokemontcg.io/swsh4/044_hires.png', price: 45.50, description: '', condition: 'new', availability: 'in_stock', category: 'pokemon', rarity: 'Rare Ultra', set: 'Vivid Voltage' }, quantity: 2 },
    ],
    total: 180.99,
    status: 'pending',
    createdAt: new Date('2026-09-05'),
  },
  {
    id: '2',
    userId: '2',
    items: [
      { card: { id: '8', name: 'Umbreon VMAX', image: 'https://images.pokemontcg.io/swsh6/095_hires.png', price: 120.00, description: '', condition: 'mint', availability: 'in_stock', category: 'pokemon', rarity: 'Rare Ultra', set: 'Evolving Skies' }, quantity: 1 },
    ],
    total: 120.00,
    status: 'pending',
    createdAt: new Date('2026-09-06'),
  },
];

const statusLabels = {
  pending: 'Pendiente',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  const handleStatusChange = (orderId: string, status: 'accepted' | 'rejected') => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status } : o
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestionar Pedidos</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No hay pedidos pendientes</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Pedido #{order.id}</h2>
                    <p className="text-gray-500 text-sm">
                      {order.createdAt.toLocaleDateString('es-ES')} • Usuario ID: {order.userId}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.card.id} className="flex items-center gap-3">
                        <img src={item.card.image} alt={item.card.name} className="w-12 h-12 object-contain" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.card.name}</p>
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                        <span className="font-bold text-gray-800">
                          €{(item.card.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-red-600">Total: €{order.total.toFixed(2)}</span>
                  {order.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleStatusChange(order.id, 'accepted')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
