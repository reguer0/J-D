import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const serviceClient = createServiceClient();
    const { data, error } = await serviceClient
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, image, price, description, condition, availability, rarity, set_name } = body;

    if (!name || !image || !price) {
      return NextResponse.json({ error: 'Campos obligatorios: name, image, price' }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    const { data, error } = await serviceClient
      .from('cards')
      .insert({
        name,
        image,
        price,
        description: description || '',
        condition: condition || 'new',
        availability: availability || 'in_stock',
        rarity: rarity || '',
        set_name: set_name || '',
        category: 'pokemon',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}