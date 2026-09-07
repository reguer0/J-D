'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { pokemonCards } from '@/data/cards';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const { items, total } = useCart();
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {isAdmin ? 'Panel de Administrador' : 'Mi perfil'}
          </h1>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-red-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
                <span className="inline-block mt-2 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </div>
            </div>

            {isAdmin ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{pokemonCards.length}</p>
                    <p className="text-gray-500 text-sm">Cartas disponibles</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">2</p>
                    <p className="text-gray-500 text-sm">Pedidos pendientes</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/admin/cards" className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center">
                    Gestionar cartas
                  </Link>
                  <Link href="/admin/orders" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-center">
                    Gestionar pedidos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{items.length}</p>
                    <p className="text-gray-500 text-sm">Artículos en carrito</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">€{total.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">Total en carrito</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-center">
                    Ver catálogo
                  </Link>
                  <Link href="/cart" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-center">
                    Ver carrito
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}