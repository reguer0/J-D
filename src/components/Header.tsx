'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-white rounded-lg p-2 shadow-md">
              <span className="text-2xl font-black text-red-600">J&D</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">Cartas Pokémon</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-yellow-200 transition-colors font-medium">
              Home
            </Link>
            {user && !isAdmin && (
              <>
            <Link href="/favorites" className="text-white hover:text-yellow-200 transition-colors font-medium relative">
              ❤️ Favoritos
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-yellow-400 text-red-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="text-white hover:text-yellow-200 transition-colors font-medium relative">
              🛒 Carrito
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-yellow-400 text-red-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
              </>
            )}

            {isAdmin && (
              <Link href="/admin" className="text-white hover:text-yellow-200 transition-colors font-medium">
                ⚙️ Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium hidden sm:block">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:text-yellow-200 transition-colors text-sm font-medium"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-white text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-yellow-100 transition-colors">
                Iniciar sesión
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
