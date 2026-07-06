import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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