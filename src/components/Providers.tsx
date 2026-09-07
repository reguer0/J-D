'use client';

import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';
import { OrderProvider } from '@/context/OrderContext';
import { CardsProvider } from '@/context/CardsContext';
import PayPalWrapper from '@/components/PayPalWrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PayPalWrapper>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <OrderProvider>
              <CardsProvider>
                {children}
              </CardsProvider>
            </OrderProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </PayPalWrapper>
  );
}