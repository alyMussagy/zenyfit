import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    // Total products
    const { count: totalProducts } = await supabase
      .from('Product')
      .select('*', { count: 'exact', head: true });

    // Total orders
    const { count: totalOrders } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true });

    // Pending orders
    const { count: pendingOrders } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pendente');

    // Completed orders
    const { count: completedOrders } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'entregue');

    // Total revenue (sum of non-cancelled orders)
    const { data: revenueData } = await supabase
      .from('Order')
      .select('total')
      .in('status', ['pendente', 'confirmado', 'enviado', 'entregue']);
    const totalRevenue = (revenueData || []).reduce((sum, o) => sum + (o.total || 0), 0);

    // Recent orders
    const { data: recentOrdersRaw } = await supabase
      .from('Order')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(5);

    // Fetch all items for recent orders
    const recentOrderIds = (recentOrdersRaw || []).map(o => o.id);
    const { data: recentItems } = recentOrderIds.length > 0
      ? await supabase.from('OrderItem').select('*').in('orderId', recentOrderIds)
      : { data: [] };

    const itemsByOrderId: Record<string, typeof recentItems> = {};
    for (const item of recentItems || []) {
      if (!itemsByOrderId[item.orderId]) itemsByOrderId[item.orderId] = [];
      itemsByOrderId[item.orderId].push(item);
    }

    const recentOrders = (recentOrdersRaw || []).map(order => ({
      ...order,
      items: itemsByOrderId[order.id] || [],
    }));

    // Orders by status
    const { data: ordersByStatusRaw } = await supabase
      .from('Order')
      .select('status');

    const statusCounts: Record<string, number> = {};
    for (const o of ordersByStatusRaw || []) {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    }
    const ordersByStatus = Object.entries(statusCounts).map(([status, _count]) => ({
      status,
      _count,
    }));

    // Top products by quantity sold
    const { data: topProductsRaw } = await supabase
      .from('OrderItem')
      .select('productName, quantity, price');

    const productSums: Record<string, { quantity: number; price: number }> = {};
    for (const item of topProductsRaw || []) {
      if (!productSums[item.productName]) {
        productSums[item.productName] = { quantity: 0, price: 0 };
      }
      productSums[item.productName].quantity += item.quantity;
      productSums[item.productName].price += item.quantity * item.price;
    }

    const topProducts = Object.entries(productSums)
      .map(([productName, sums]) => ({
        productName,
        _sum: sums,
      }))
      .sort((a, b) => b._sum.quantity - a._sum.quantity)
      .slice(0, 5);

    return NextResponse.json({
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      completedOrders: completedOrders || 0,
      totalRevenue,
      recentOrders,
      ordersByStatus,
      topProducts,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}