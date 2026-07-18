import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Public endpoint for customers to track their orders.
 * Accepts ?id=<order-id-prefix> or ?phone=<customer-phone>
 * Returns order details without sensitive admin data.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim();
    const phone = searchParams.get('phone')?.trim();

    if (!id && !phone) {
      return NextResponse.json({ error: 'Forneça o ID ou telefone do pedido' }, { status: 400 });
    }

    let query = supabase.from('Order').select('*');

    if (id) {
      // Search by ID prefix (case-insensitive)
      query = query.ilike('id', `${id}%`);
    } else if (phone) {
      query = query.eq('customerPhone', phone);
    }

    const { data: orders, error } = await query
      .order('createdAt', { ascending: false })
      .limit(id ? 1 : 20);

    if (error) throw error;

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Fetch items for found orders
    const orderIds = orders.map((o) => o.id);
    const { data: allItems } = await supabase
      .from('OrderItem')
      .select('*')
      .in('orderId', orderIds);

    const itemsByOrder: Record<string, typeof allItems> = {};
    for (const item of allItems || []) {
      if (!itemsByOrder[item.orderId]) itemsByOrder[item.orderId] = [];
      itemsByOrder[item.orderId].push(item);
    }

    const result = orders.map((order) => ({
      id: order.id,
      shortId: order.id.slice(0, 8).toUpperCase(),
      status: order.status,
      total: order.total,
      province: order.province,
      city: order.city,
      createdAt: order.createdAt,
      items: itemsByOrder[order.id] || [],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'Erro ao procurar pedido' }, { status: 500 });
  }
}