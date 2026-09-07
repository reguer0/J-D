'use client';

import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/admin/cards" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow block">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">🃏</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Gestionar Cartas</h2>
                <p className="text-gray-500">Añadir, editar y eliminar cartas del catálogo</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow block">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Gestionar Pedidos</h2>
                <p className="text-gray-500">Aceptar o rechazar pedidos pendientes</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
