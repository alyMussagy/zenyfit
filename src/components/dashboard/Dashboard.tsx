'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  ordersByStatus: { status: string; _count: number }[];
  topProducts: { productName: string; _sum: { quantity: number; price: number } }[];
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  province: string;
  city: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
}

type DashTab = 'overview' | 'products' | 'orders';

const statusColors: Record<string, string> = {
  pendente: 'bg-amber-100 text-amber-700',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregue: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashTab>('overview');

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: () => fetch('/api/dashboard').then((r) => r.json()),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Painel de Controlo</h1>
          <p className="text-gray-500 mt-1">Gerir produtos, pedidos e acompanhar vendas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 pb-3 overflow-x-auto">
          {[
            { id: 'overview' as DashTab, label: 'Visão Geral', icon: BarChart3 },
            { id: 'products' as DashTab, label: 'Produtos', icon: Package },
            { id: 'orders' as DashTab, label: 'Pedidos', icon: ShoppingCart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-zeny-green text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Produtos</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Pedidos</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pedidos Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Receita Total</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.totalRevenue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Orders by Status */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Pedidos por Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.ordersByStatus.map((s) => {
                      const maxCount = Math.max(...stats.ordersByStatus.map((x) => x._count));
                      const pct = maxCount > 0 ? (s._count / maxCount) * 100 : 0;
                      return (
                        <div key={s.status} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-24 capitalize">{s.status}</span>
                          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: s.status === 'pendente' ? '#f59e0b' : s.status === 'confirmado' ? '#3b82f6' : s.status === 'enviado' ? '#8b5cf6' : s.status === 'entregue' ? '#10b981' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">{s._count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topProducts.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">Sem dados de vendas ainda</p>
                    ) : (
                      stats.topProducts.map((p, i) => (
                        <div key={p.productName} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-zeny-green/10 flex items-center justify-center text-xs font-bold text-zeny-green">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{p.productName}</p>
                            <p className="text-xs text-gray-400">{p._sum.quantity} vendidos</p>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {(p._sum.price || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Pedidos Recentes</CardTitle>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-zeny-green hover:underline font-medium"
                  >
                    Ver todos
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {stats.recentOrders.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Nenhum pedido registado</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 font-medium text-gray-500">Cliente</th>
                          <th className="text-left py-3 font-medium text-gray-500">Província</th>
                          <th className="text-left py-3 font-medium text-gray-500">Total</th>
                          <th className="text-left py-3 font-medium text-gray-500">Estado</th>
                          <th className="text-left py-3 font-medium text-gray-500">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="py-3">
                              <p className="font-medium text-gray-900">{order.customerName}</p>
                              <p className="text-xs text-gray-400">{order.customerPhone}</p>
                            </td>
                            <td className="py-3 text-gray-600">{order.province}</td>
                            <td className="py-3 font-medium text-gray-900">
                              {order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                            </td>
                            <td className="py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('pt-MZ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'orders' && <OrderManager />}
      </div>
    </div>
  );
}