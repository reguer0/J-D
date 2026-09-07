import { NextResponse } from 'next/server';

let persistedOrders: any[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paypalOrderId, items, total, user, shippingAddress } = body;

    if (!paypalOrderId || !items || !total || !user || !shippingAddress) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const order = {
      id: `JD-${Date.now()}`,
      paypalOrderId,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: new Date(),
    };

    persistedOrders = [order, ...persistedOrders];

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(persistedOrders);
}