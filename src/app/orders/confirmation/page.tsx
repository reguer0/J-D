'use client';

import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto">
        <div className="text-7xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pago completado!</h1>
        <p className="text-gray-500 mb-4">
          Tu pedido <strong className="text-gray-800">{orderId}</strong> ha sido registrado correctamente.
        </p>
        <p className="text-gray-500 mb-2">
          Hemos enviado la confirmación a tu email. Un administrador revisará y aceptará tu pedido en breve.
        </p>
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6">
          Redirigiendo al inicio en {countdown} segundos...
        </div>
        <Link
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<div className="text-center py-16">Cargando...</div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}