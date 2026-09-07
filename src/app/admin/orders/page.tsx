'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

interface OrderRow {
  id: string;
  order_code: string;
  user_email: string;
  user_name: string;
  total: number;
  status: string;
  shipping_address: any;
  created_at: string;
  order_items: Array<{
    id: string;
    card_id: string;
    card_name: string;
    card_image: string | null;
    unit_price: number;
    quantity: number;
  }>;
}

export default function AdminOrdersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch {
      // sin datos
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
      return;
    }
    loadOrders();
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  const handleStatusChange = async (orderId: string, status: 'accepted' | 'rejected') => {
    const response = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status }),
    });

    if (response.ok) {
      setMessage(`Pedido ${status === 'accepted' ? 'aceptado' : 'rechazado'} correctamente`);
      await loadOrders();
    } else {
      const data = await response.json();
      setMessage(`Error: ${data.error || 'No se pudo actualizar'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestionar Pedidos</h1>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No hay pedidos registrados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Pedido #{order.order_code}</h2>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString('es-ES')} • {order.user_name} ({order.user_email})
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="space-y-3">
                    {order.order_items?.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.card_image && (
                          <img src={item.card_image} alt={item.card_name} className="w-12 h-12 object-contain" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.card_name}</p>
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                        <span className="font-bold text-gray-800">
                          €{(item.unit_price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.shipping_address && (
                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">Datos de envío:</p>
                    <p className="text-sm text-gray-700">
                      {order.shipping_address.fullName} • {order.shipping_address.street}, {order.shipping_address.city} ({order.shipping_address.zipCode}), {order.shipping_address.country}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 flex flex-wrap justify-between items-center gap-4">
                  <span className="text-xl font-bold text-red-600">Total: €{Number(order.total).toFixed(2)}</span>
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