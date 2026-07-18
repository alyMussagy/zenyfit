import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro enviado' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de ficheiro não permitido. Use JPEG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ficheiro demasiado grande. Máximo 5MB.' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Erro ao fazer upload da imagem' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Erro no upload' }, { status: 500 });
  }
}