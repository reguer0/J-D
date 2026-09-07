'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { PayPalButtons } from '@paypal/react-paypal-js';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    zipCode: '',
    country: 'España',
  });

  if (!user) return null;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const validateShipping = (): string | null => {
    if (!shippingAddress.fullName.trim()) return 'Introduce tu nombre completo';
    if (!shippingAddress.street.trim()) return 'Introduce la dirección';
    if (!shippingAddress.city.trim()) return 'Introduce la ciudad';
    if (!shippingAddress.zipCode.trim()) return 'Introduce el código postal';
    return null;
  };

  const OnApprove = async (data: unknown, actions: Record<string, any>) => {
    const order = await actions.order.capture();
    setIsProcessing(true);
    const paypalOrderId = order.id || 'PAYPAL-' + Date.now();
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paypalOrderId,
        items,
        total,
        user: { id: user.id, email: user.email, name: user.name },
        shippingAddress,
      }),
    });
    if (response.ok) {
      const savedOrder = await response.json();
      createOrder(user.id, user.email, items, total);
      clearCart();
      router.push(`/orders/confirmation?id=${savedOrder.id}`);
    } else {
      setError('Hubo un error al registrar tu pedido. Contacta con soporte.');
    }
    setIsProcessing(false);
  };

  const validationError = validateShipping();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar compra</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Datos de envío */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Datos de envío</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleShippingChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleShippingChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-gray-900"
                placeholder="Calle, número, piso"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código postal</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleShippingChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-gray-900"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
              <select
                name="country"
                value={shippingAddress.country}
                onChange={handleShippingChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 text-gray-900"
              >
                <option>España</option>
                <option>Francia</option>
                <option>Italia</option>
                <option>Alemania</option>
                <option>Portugal</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resumen del pedido y PayPal */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.card.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.card.name} x{item.quantity}</span>
                  <span className="font-medium">€{(item.card.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-red-600">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pago con PayPal</h2>
            {validationError ? (
              <p className="text-gray-500 text-sm mb-4">
                Completa primero los datos de envío para poder pagar.
              </p>
            ) : null}
            <PayPalButtons
              style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
              disabled={!!validationError || isProcessing}
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [{
                    amount: { value: total.toFixed(2), currency_code: 'EUR' },
                    description: items.map(i => i.card.name).join(', '),
                  }],
                });
              }}
              onApprove={OnApprove}
              onError={() => setError('Ocurrió un error con PayPal. Inténtalo de nuevo.')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}