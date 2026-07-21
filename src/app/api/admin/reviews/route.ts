import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('Review')
      .select('*, Product:productId(name)')
      .order('createdAt', { ascending: false });

    if (status === 'pending') {
      query = query.eq('approved', false);
    } else if (status === 'approved') {
      query = query.eq('approved', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Erro ao buscar avaliações (admin):', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao buscar avaliações', details: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const body = await request.json();
    const { productId, customerName, rating, comment, approved } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'O campo productId é obrigatório' },
        { status: 400 }
      );
    }
    if (!customerName?.trim()) {
      return NextResponse.json(
        { error: 'O campo customerName é obrigatório' },
        { status: 400 }
      );
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'A avaliação deve ser entre 1 e 5' },
        { status: 400 }
      );
    }


    const { data, error } = await supabase
      .from('Review')
      .insert({
        id: randomUUID(),
        productId,
        customerName: customerName.trim(),
        rating: Math.round(rating),
        comment: comment?.trim() || '',
        approved: approved ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase ao criar avaliação (admin):', error);
      return NextResponse.json(
        { error: 'Erro ao criar avaliação', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar avaliação (admin):', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao criar avaliação', details: msg },
      { status: 500 }
    );
  }
}