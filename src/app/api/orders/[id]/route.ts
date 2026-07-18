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
    const body = await request.json();
    const { status } = body;

    const { data, error } = await supabase
      .from('Order')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Fetch items for this order
    const { data: items } = await supabase
      .from('OrderItem')
      .select('*')
      .eq('orderId', id);

    return NextResponse.json({ ...data, items: items || [] });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
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

    // Delete order items first, then the order
    await supabase.from('OrderItem').delete().eq('orderId', id);
    const { error } = await supabase.from('Order').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}