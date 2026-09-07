'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem } from '@/types';

interface OrderContextType {
  orders: Order[];
  createOrder: (userId: string, userEmail: string, items: CartItem[], total: number) => Order;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

let orderCounter = 1000;

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = (userId: string, userEmail: string, items: CartItem[], total: number): Order => {
    const newOrder: Order = {
      id: `JD-${++orderCounter}`,
      userId,
      userEmail,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
    };
    setOrders(current => [newOrder, ...current]);
    return newOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}