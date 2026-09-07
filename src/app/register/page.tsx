'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/validation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const emailValid = isValidEmail(email.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = register(name, email, password);
    if (result.ok) {
      router.push('/');
    } else {
      setError(result.error || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-4xl font-black text-red-600">J&D</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Crear cuenta</h1>
          <p className="text-gray-500 mt-2">Regístrate para comprar cartas Pokémon</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-gray-900"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                emailTouched && email && !emailValid
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-red-500 focus:ring-red-200'
              }`}
              placeholder="tu@email.com"
              required
            />
            {emailTouched && email && !emailValid && (
              <p className="text-red-500 text-xs mt-1">Formato de email no válido. Ejemplo: tu@email.com</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                password && password.length < 6
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-red-500 focus:ring-red-200'
              }`}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <p className="text-xs text-gray-400 mt-1">La contraseña debe tener al menos 6 caracteres</p>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Crear cuenta
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-red-600 hover:text-red-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
