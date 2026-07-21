'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, ShoppingCart, DollarSign, Clock, BarChart3, Shield, LogOut, ArrowLeft, Bell, Sparkles, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import AdminManager from './AdminManager';
import PopupManager from './PopupManager';
import ReviewManager from './ReviewManager';
import { useAuthStore } from '@/store/auth-store';
import { useAppStore } from '@/store/app-store';
import { authFetch } from '@/lib/auth-fetch';
import { toast } from 'sonner';

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

type DashTab = 'overview' | 'products' | 'orders' | 'reviews' | 'popups' | 'admins';

const statusColors: Record<string, string> = {
  pendente: 'bg-amber-100 text-amber-700',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregue: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);
  const setView = useAppStore((s) => s.setView);
  const [activeTab, setActiveTab] = useState<DashTab>('overview');
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    setView('store');
  };

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard'],
    queryFn: () => authFetch('/api/dashboard').then((r) => r.json()),
  });

  // Pending reviews count
  const { data: pendingReviewsData } = useQuery<{ count: number }>({
    queryKey: ['pending-reviews-count'],
    queryFn: () => authFetch('/api/admin/reviews?status=pending').then((r) => r.json().then((d: any[]) => ({ count: d.length }))),
  });
  const pendingReviews = pendingReviewsData?.count || 0;

  // Poll for new orders every 30 seconds
  const lastPendingCount = useRef(0);
  useEffect(() => {
    if (!stats) return;
    const current = stats.pendingOrders || 0;
    if (lastPendingCount.current > 0 && current > lastPendingCount.current) {
      const newCount = current - lastPendingCount.current;
      toast(`${newCount} novo${newCount > 1 ? 's' : ''} pedido${newCount > 1 ? 's' : ''} recebido${newCount > 1 ? 's' : ''}!`, {
        description: 'Vá ao separador Pedidos para gerir',
        icon: <Bell className="w-4 h-4 text-zeny-green" />,
        duration: 8000,
      });
    }
    lastPendingCount.current = current;
  }, [stats]);

  // Refetch dashboard every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }, 30000);
    return () => clearInterval(interval);
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-zeny-green-card rounded w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-zeny-green-card rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="https://ldipatlofnuzeglzuexj.supabase.co/storage/v1/object/public/images/logo%20sem%20fundo.webp"
              alt="ZenyFit"
              className="h-9 w-auto"
            />
            <span className="text-lg font-bold text-gray-900 tracking-tight">Zeny<span className="text-zeny-green">Fit</span> <span className="text-xs font-normal text-gray-400">Admin</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('store')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-zeny-green-dark px-3 py-1.5 rounded-lg hover:bg-zeny-green/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Loja</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Painel de Controlo</h1>
                <span className="text-xs bg-zeny-green/10 text-zeny-green-dark px-2 py-0.5 rounded-full font-medium">{admin?.name || 'Admin'}</span>
              </div>
              <p className="text-gray-500 mt-1">Gerir produtos, pedidos e acompanhar vendas</p>
            </div>
          </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 pb-3 overflow-x-auto">
          {[
            { id: 'overview' as DashTab, label: 'Visão Geral', icon: BarChart3 },
            { id: 'products' as DashTab, label: 'Produtos', icon: Package },
            { id: 'orders' as DashTab, label: 'Pedidos', icon: ShoppingCart },
            { id: 'reviews' as DashTab, label: 'Avaliações', icon: MessageSquare, badge: pendingReviews },
            { id: 'popups' as DashTab, label: 'Popups', icon: Sparkles },
            ...(admin?.role === 'owner' ? [{ id: 'admins' as DashTab, label: 'Acessos', icon: Shield }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-zeny-green text-white shadow-md shadow-zeny-green/20'
                  : 'text-gray-600 hover:bg-zeny-green-card'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge ? (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                }`}>
                  {tab.badge}
                </span>
              ) : null}
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
                    <div className="w-10 h-10 rounded-lg bg-zeny-green/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-zeny-green" />
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
                    <div className="w-10 h-10 rounded-lg bg-zeny-green/10 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-zeny-green-dark" />
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
                    <div className="w-10 h-10 rounded-lg bg-zeny-green-card flex items-center justify-center">
                      <Clock className="w-5 h-5 text-zeny-green-dark" />
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
                    <div className="w-10 h-10 rounded-lg bg-zeny-green/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-zeny-green" />
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
                    {stats.ordersByStatus.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Sem pedidos registados ainda</p>
                ) : stats.ordersByStatus.map((s) => {
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
                                backgroundColor: s.status === 'pendente' ? '#f59e0b' : s.status === 'confirmado' ? '#2E9802' : s.status === 'enviado' ? '#38B802' : s.status === 'entregue' ? '#6FD63A' : '#ef4444',
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
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto mb-3 text-zeny-green/20" />
                    <p className="text-sm text-gray-400">Nenhum pedido registado ainda</p>
                  </div>
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
        {activeTab === 'reviews' && <ReviewManager />}
        {activeTab === 'popups' && <PopupManager />}
        {activeTab === 'admins' && <AdminManager />}
      </div>
      </div>
    </div>
  );
}