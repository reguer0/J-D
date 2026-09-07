import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/client';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, image, price, description, condition, availability, rarity, set_name } = body;

    const serviceClient = createServiceClient();
    const { data, error } = await serviceClient
      .from('cards')
      .update({
        name,
        image,
        price,
        description,
        condition,
        availability,
        rarity,
        set_name,
        updated_at: new Date().toISOString(),
      })
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const serviceClient = createServiceClient();
    const { error } = await serviceClient
      .from('cards')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}