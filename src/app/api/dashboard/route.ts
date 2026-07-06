import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const totalProducts = await db.product.count();
    const totalOrders = await db.order.count();
    const pendingOrders = await db.order.count({ where: { status: 'pendente' } });
    const completedOrders = await db.order.count({ where: { status: 'entregue' } });

    const revenueResult = await db.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['pendente', 'confirmado', 'enviado', 'entregue'] } },
    });

    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    const ordersByStatus = await db.order.groupBy({
      by: ['status'],
      _count: true,
    });

    const topProducts = await db.orderItem.groupBy({
      by: ['productName'],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: revenueResult._sum.total || 0,
      recentOrders,
      ordersByStatus,
      topProducts,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}