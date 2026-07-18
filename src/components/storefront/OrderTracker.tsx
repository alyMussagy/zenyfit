'use client';

import { useState } from 'react';
import { Search, Package, X, Clock, CheckCircle, Truck, MapPin, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TrackedOrder {
  shortId: string;
  id: string;
  status: string;
  total: number;
  province: string;
  city: string;
  createdAt: string;
  items: { productName: string; quantity: number; price: number }[];
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof Package; label: string }> = {
  pendente: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, label: 'Pendente' },
  confirmado: { color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle, label: 'Confirmado' },
  enviado: { color: 'text-purple-600', bg: 'bg-purple-50', icon: Truck, label: 'Enviado' },
  entregue: { color: 'text-green-600', bg: 'bg-green-50', icon: MapPin, label: 'Entregue' },
  cancelado: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Cancelado' },
};

const statusSteps = ['pendente', 'confirmado', 'enviado', 'entregue'];

interface OrderTrackerProps {
  open: boolean;
  onClose: () => void;
}

export default function OrderTracker({ open, onClose }: OrderTrackerProps) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrackedOrder[]>([]);
  const [searched, setSearched] = useState(false);

  if (!open) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const isPhone = /^[\d\s+]+$/.test(search.trim());
      const params = isPhone ? `phone=${encodeURIComponent(search.trim())}` : `id=${encodeURIComponent(search.trim())}`;
      const res = await fetch(`/api/track?${params}`);

      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } else {
        const err = await res.json();
        setResults([]);
        if (res.status === 404) {
          toast.error('Pedido não encontrado');
        } else {
          toast.error(err.error || 'Erro ao procurar');
        }
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'cancelado') return -1;
    return statusSteps.indexOf(status);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 80 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 80 }}
        transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
        className="bg-white rounded-t-2xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-zeny-green/10 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl z-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zeny-green-dark">Rastrear Pedido</h2>
            <p className="text-xs text-zeny-green-dark/50 mt-0.5">Consulte o estado do seu pedido</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-zeny-green-card flex items-center justify-center -mr-1">
            <X className="w-5 h-5 text-zeny-green-dark/60" />
          </button>
        </div>

        <div className="p-4">
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zeny-green/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ID do pedido ou telefone"
                className="pl-10 h-11 border-zeny-green/20 rounded-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-zeny-green hover:bg-zeny-green-dark text-white rounded-lg px-4"
            >
              {loading ? '...' : 'Buscar'}
            </Button>
          </form>

          {/* Results */}
          {!searched ? (
            <div className="text-center py-10">
              <Package className="w-12 h-12 mx-auto mb-3 text-zeny-green/20" />
              <p className="text-sm text-zeny-green-dark/50">
                Digite o número do pedido (ex: A1B2C3D4) ou o telefone usado na encomenda
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((order) => {
                const config = statusConfig[order.status] || statusConfig.pendente;
                const StatusIcon = config.icon;
                const stepIdx = getStepIndex(order.status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-zeny-green/10 rounded-xl p-4"
                  >
                    {/* Order header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-mono font-bold text-zeny-green-dark">#{order.shortId}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleString('pt-MZ')}
                        </p>
                      </div>
                      <Badge className={`${config.bg} ${config.color} border-0`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>

                    {/* Progress bar (only for active orders) */}
                    {stepIdx >= 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          {statusSteps.slice(0, -1).map((step, i) => {
                            const stepConfig = statusConfig[step];
                            const StepIcon = stepConfig.icon;
                            const isActive = i <= stepIdx;
                            return (
                              <div key={step} className="flex flex-col items-center flex-1">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 transition-colors ${
                                  isActive ? 'bg-zeny-green text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  <StepIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-[10px] ${isActive ? 'text-zeny-green-dark font-medium' : 'text-gray-400'}`}>
                                  {stepConfig.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {/* Progress line */}
                        <div className="relative h-1 bg-gray-100 rounded-full -mt-4 mb-3 mx-4">
                          <motion.div
                            className="absolute left-0 top-0 h-full bg-zeny-green rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(stepIdx / (statusSteps.length - 1)) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-1.5 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600 truncate mr-2">{item.productName} x{item.quantity}</span>
                          <span className="text-gray-900 font-medium whitespace-nowrap">
                            {(item.price * item.quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total & location */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{order.city}, {order.province}</span>
                      <span className="font-bold text-zeny-green">
                        {order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}