import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paypalOrderId, items, total, user, shippingAddress } = body;

    if (!paypalOrderId || !items || !total || !user) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const orderCode = `JD-${Date.now()}`;
    const serviceClient = createServiceClient();

    // Insertar la orden
    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .insert({
        order_code: orderCode,
        user_id: user.id || null,
        user_email: user.email,
        user_name: user.name || user.email,
        total,
        status: 'pending',
        paypal_order_id: paypalOrderId,
        shipping_address: shippingAddress || null,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Insertar los items
    const itemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      card_id: item.card.id,
      card_name: item.card.name,
      card_image: item.card.image || null,
      unit_price: item.card.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await serviceClient
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ ...order, items: [] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const serviceClient = createServiceClient();

    let query = serviceClient.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });

    if (email) {
      query = query.eq('user_email', email);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const { data, error } = await serviceClient
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}