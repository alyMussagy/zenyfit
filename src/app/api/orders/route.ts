import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    // Fetch orders with their items
    const { data: orders, error } = await supabase
      .from('Order')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    // Fetch all order items and group by orderId
    const { data: allItems, error: itemsError } = await supabase
      .from('OrderItem')
      .select('*');

    if (itemsError) throw itemsError;

    // Group items by orderId
    const itemsByOrder: Record<string, typeof allItems> = {};
    for (const item of allItems || []) {
      if (!itemsByOrder[item.orderId]) itemsByOrder[item.orderId] = [];
      itemsByOrder[item.orderId].push(item);
    }

    // Attach items to orders
    const ordersWithItems = (orders || []).map(order => ({
      ...order,
      items: itemsByOrder[order.id] || [],
    }));

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, province, city, address, deliveryFee, items, total } = body;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        id: randomUUID(),
        customerName,
        customerPhone,
        province,
        city,
        address,
        deliveryFee: deliveryFee ? parseFloat(deliveryFee) : 0,
        total: parseFloat(total),
        status: 'pendente',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: { productId: string; productName: string; quantity: number; price: number }) => ({
        id: randomUUID(),
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('OrderItem')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // Return order with items
    return NextResponse.json({
      ...order,
      items: items || [],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}