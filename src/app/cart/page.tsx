'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-500 mb-6">Añade algunas cartas Pokémon para empezar</p>
          <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block">
            Ver cartas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tu carrito</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.card.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4">
                <img src={item.card.image} alt={item.card.name} className="w-24 h-24 object-contain" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.card.name}</h3>
                  <p className="text-gray-500 text-sm">{item.card.set}</p>
                  <p className="text-red-600 font-bold mt-1">€{item.card.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.card.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.card.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.card.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.card.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.card.name} x{item.quantity}</span>
                  <span className="font-medium">€{(item.card.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-red-600">€{total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-3">
              Comprar
            </button>
            <button
              onClick={clearCart}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
