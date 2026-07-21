import { validateAdmin, unauthorizedResponse } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

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
      return NextResponse.json({ error: 'Tipo de ficheiro não suportado. Use JPEG, PNG, WebP ou GIF.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Ficheiro demasiado grande. Máximo 5MB.' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'webp';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `products/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Erro ao fazer upload da imagem', details: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(uploadData.path);

    return NextResponse.json({ url: urlData.publicUrl, path: uploadData.path });
  } catch (error) {
    console.error('Upload error:', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: 'Erro ao processar upload', details: msg }, { status: 500 });
  }
}