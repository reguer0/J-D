'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Checkout from '@/components/checkout/Checkout';
import Link from 'next/link';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items } = useCart();
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
        {items.length === 0 ? (
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-500 mb-6">Añade cartas para poder finalizar la compra</p>
            <Link href="/" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block">
              Ver cartas
            </Link>
          </div>
        ) : (
          <Checkout />
        )}
      </main>
    </div>
  );
}