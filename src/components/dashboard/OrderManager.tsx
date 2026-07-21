'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Package, ChevronDown, ChevronUp, Search, MessageCircle, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { useState, useMemo } from 'react';
import { authFetch } from '@/lib/auth-fetch';

const WHATSAPP_NUMBER = '258875775167';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  province: string;
  city: string;
  address: string;
  deliveryFee: number;
  status: string;
  total: number;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
}

const statusOptions = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

const statusColors: Record<string, string> = {
  pendente: 'bg-amber-100 text-amber-700',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregue: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
};

export default function OrderManager() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders-admin'],
    queryFn: () => authFetch('/api/orders').then((r) => r.json()),
  });

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let result = [...orders];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(s) ||
          o.customerPhone.includes(s) ||
          o.id.toLowerCase().includes(s) ||
          o.province.toLowerCase().includes(s) ||
          o.city.toLowerCase().includes(s)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    return result;
  }, [orders, search, statusFilter]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await authFetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      toast.success(`Pedido actualizado para: ${status}`);
      queryClient.invalidateQueries({ queryKey: ['orders-admin'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch {
      toast.error('Erro ao actualizar pedido');
    }
  };

  const [confirmDeleteOrder, setConfirmDeleteOrder] = useState<string | null>(null);

  const deleteOrder = async (orderId: string) => {
    try {
      await authFetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      toast.success('Pedido eliminado');
      queryClient.invalidateQueries({ queryKey: ['orders-admin'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch {
      toast.error('Erro ao eliminar pedido');
    }
  };

  const openWhatsApp = (order: Order) => {
    const items = order.items.map((i) => `  - ${i.productName} x${i.quantity} (${(i.price * i.quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })})`).join('\n');
    const subtotal = order.total - (order.deliveryFee || 0);
    const message = `Olá ${order.customerName}! 👋\n\nAqui é da ZenyFit. O seu pedido *#${order.id.slice(0, 8)}* encontra-se com status: *${order.status.toUpperCase()}*\n\n*Itens:*\n${items}\n\n*Subtotal:* ${subtotal.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}\n*Entrega (${order.city}):* ${(order.deliveryFee || 0).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}\n*Total:* ${order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}\n\n*Entrega:* ${order.address}, ${order.city}, ${order.province}\n\nObrigado pela sua preferência! 💚`;
    window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Gestão de Pedidos</h2>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Pesquisar por nome, telefone, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filtrar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400">
              {orders?.length === 0 ? 'Nenhum pedido registado' : 'Nenhum pedido encontrado'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 mb-2">{filteredOrders.length} pedido(s) encontrado(s)</p>
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-zeny-green/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-zeny-green" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{order.customerName}</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {order.customerPhone} &middot; {order.province}, {order.city}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleString('pt-MZ')} &middot; {order.items.length} item(ns) &middot; #{order.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-right">
                        {order.deliveryFee > 0 && (
                          <p className="text-xs text-gray-400">
                            Entrega: {order.deliveryFee.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                          </p>
                        )}
                        <span className="text-lg font-bold text-gray-900">
                          {order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* WhatsApp button */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => openWhatsApp(order)}
                          title="Contactar via WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(val) => updateStatus(order.id, val)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <button
                          onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                        >
                          {expandedId === order.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setConfirmDeleteOrder(order.id)}
                          title="Eliminar pedido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === order.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up">
                      <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Itens do Pedido</p>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2.5">
                            <div>
                              <p className="font-medium text-gray-800">{item.productName}</p>
                              <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                            </div>
                            <span className="font-medium text-gray-900">
                              {(item.price * item.quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        <span className="font-medium text-gray-600">Endereço:</span> {order.address}, {order.city}, {order.province}
                        {order.deliveryFee > 0 && (
                          <span className="ml-3">
                            <span className="font-medium text-gray-600">Entrega:</span>{' '}
                            {order.deliveryFee.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!confirmDeleteOrder}
        title="Eliminar Pedido"
        message="Tem certeza que deseja eliminar este pedido? Esta acção não pode ser desfeita."
        confirmLabel="Eliminar"
        onConfirm={() => confirmDeleteOrder && deleteOrder(confirmDeleteOrder)}
        onCancel={() => setConfirmDeleteOrder(null)}
      />
    </div>
  );
}