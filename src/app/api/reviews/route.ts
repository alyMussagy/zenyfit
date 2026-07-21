import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'O parâmetro productId é obrigatório' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('Review')
      .select('*')
      .eq('productId', productId)
      .eq('approved', true)
      .order('createdAt', { ascending: false });

    if (error) throw error;

    const reviews = Array.isArray(data) ? data : [];

    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
        : 0;

    return NextResponse.json({
      reviews,
      average: Math.round(average * 10) / 10,
      count: reviews.length,
    });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao buscar avaliações', details: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerName, rating, comment } = body;

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
    if (!comment?.trim()) {
      return NextResponse.json(
        { error: 'O campo comment é obrigatório' },
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
        comment: comment.trim(),
        approved: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase ao criar avaliação:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar avaliação', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao enviar avaliação', details: msg },
      { status: 500 }
    );
  }
}