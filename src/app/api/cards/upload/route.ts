import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido. Usa JPG, PNG, WEBP o GIF' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;

    const serviceClient = createServiceClient();

    const { error: uploadError } = await serviceClient.storage
      .from('cards')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = serviceClient.storage
      .from('cards')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}