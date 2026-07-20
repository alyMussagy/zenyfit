import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';

// PUT /api/popups/[id] — actualizar popup (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.subtitle !== undefined) updateData.subtitle = body.subtitle?.trim() || '';
    if (body.benefits !== undefined) updateData.benefits = Array.isArray(body.benefits) ? body.benefits : [];
    if (body.stockAlert !== undefined) updateData.stockAlert = body.stockAlert?.trim() || '';
    if (body.ctaText !== undefined) updateData.ctaText = body.ctaText?.trim() || 'VER OFERTAS';
    if (body.ctaLink !== undefined) updateData.ctaLink = body.ctaLink?.trim() || '#produtos';
    if (body.footerText !== undefined) updateData.footerText = body.footerText?.trim() || '';
    if (body.urgencyLabel !== undefined) updateData.urgencyLabel = body.urgencyLabel?.trim() || 'Oferta por tempo limitado';
    if (body.cooldownHours !== undefined) updateData.cooldownHours = parseFloat(body.cooldownHours) || 12;
    if (body.active !== undefined) updateData.active = body.active;

    const { data, error } = await supabase
      .from('Popup')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating popup:', error);
    return NextResponse.json({ error: 'Erro ao actualizar popup' }, { status: 500 });
  }
}

// DELETE /api/popups/[id] — eliminar popup (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const { id } = await params;
    const { error } = await supabase.from('Popup').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting popup:', error);
    return NextResponse.json({ error: 'Erro ao eliminar popup' }, { status: 500 });
  }
}

// PATCH /api/popups/[id] — activar/desactivar rapidamente (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('Popup')
      .update({
        active: body.active,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error toggling popup:', error);
    return NextResponse.json({ error: 'Erro ao alterar estado do popup' }, { status: 500 });
  }
}