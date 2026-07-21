import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'O ID da avaliação é obrigatório' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { approved, comment } = body;

    if (approved === undefined && comment === undefined) {
      return NextResponse.json(
        { error: 'Envie pelo menos um campo para atualizar (approved ou comment)' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (typeof approved === 'boolean') updates.approved = approved;
    if (typeof comment === 'string') updates.comment = comment.trim();

    const { data, error } = await supabase
      .from('Review')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase ao atualizar avaliação:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar avaliação', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao atualizar avaliação', details: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'O ID da avaliação é obrigatório' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('Review')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro Supabase ao excluir avaliação:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir avaliação', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir avaliação:', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao excluir avaliação', details: msg },
      { status: 500 }
    );
  }
}