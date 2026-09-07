'use client';

import Link from 'next/link';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string;
}

export default function LoginPromptModal({ isOpen, onClose, action = 'guardar o comprar' }: LoginPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Necesitas iniciar sesión!</h2>
        <p className="text-gray-500 mb-8">
          Para poder {action} tienes que estar registrado. Inicia sesión o crea una cuenta gratuita.
        </p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}