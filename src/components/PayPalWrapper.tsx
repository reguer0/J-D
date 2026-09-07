'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function PayPalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider options={{
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb',
      currency: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'EUR',
      intent: 'capture',
    }}>
      {children}
    </PayPalScriptProvider>
  );
}