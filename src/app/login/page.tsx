'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(email, password)) {
      router.push('/');
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-black text-red-600">J&D</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Iniciar sesión</h1>
          <p className="text-gray-500 mt-2">Accede a tu cuenta para comprar cartas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-gray-900"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-gray-900"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-red-600 hover:text-red-700 font-medium">
              Regístrate
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-400 text-center mb-2">Cuentas de prueba:</p>
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
            <p><strong>Admin:</strong> admin@jd.com / admin123</p>
            <p><strong>Usuario:</strong> user@jd.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
