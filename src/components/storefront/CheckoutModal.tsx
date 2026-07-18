'use client';

import { useState, useMemo } from 'react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { X, CheckCircle, Loader2, Copy, MessageCircle, ArrowLeft, Truck, MapPin } from 'lucide-react';
import { ZENYFIT_CONFIG } from '@/lib/zenyfit-config';
import { motion, AnimatePresence } from 'framer-motion';

const deliveryZones = ZENYFIT_CONFIG.deliveryZones;

function formatMZN(value: number) {
  return value.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' });
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<{ id: string; total: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    province: '',
    deliveryZone: '',
    address: '',
  });

  // Get available zones for the selected province
  const availableZones = useMemo(() => {
    if (!form.province) return [];
    const area = deliveryZones.find((d) => d.province === form.province);
    return area ? [...area.zones] : [];
  }, [form.province]);

  // Get the delivery cost for the selected zone
  const deliveryCost = useMemo(() => {
    if (!form.deliveryZone) return 0;
    for (const area of deliveryZones) {
      const zone = area.zones.find((z) => z.name === form.deliveryZone);
      if (zone) return zone.cost;
    }
    return 0;
  }, [form.deliveryZone]);

  const subtotal = totalPrice();
  const grandTotal = subtotal + deliveryCost;

  if (!open) return null;

  const orderIdShort = orderResult ? orderResult.id.slice(0, 8).toUpperCase() : '';

  const buildWhatsAppMessage = (orderId?: string) => {
    let msg = `*NOVO PEDIDO ${orderId ? `#${orderId.slice(-6).toUpperCase()}` : ''}*\n\n`;
    msg += `*Cliente:* ${form.customerName}\n`;
    msg += `*Telefone:* ${form.customerPhone}\n`;
    msg += `*Localização:* ${form.deliveryZone}, ${form.province}\n`;
    msg += `*Endereço:* ${form.address}\n\n`;
    msg += `*ITENS:*\n`;
    items.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} x${item.quantity} — ${(item.price * item.quantity).toLocaleString('pt-MZ')} MTn\n`;
    });
    msg += `\n*Subtotal:* ${subtotal.toLocaleString('pt-MZ')} MTn\n`;
    msg += `*Entrega (${form.deliveryZone}):* ${deliveryCost.toLocaleString('pt-MZ')} MTn\n`;
    msg += `*TOTAL A PAGAR:* ${grandTotal.toLocaleString('pt-MZ')} MTn\n`;
    msg += `\n*Pagamento:* Na entrega`;
    return encodeURIComponent(msg);
  };

  const copyOrderId = () => {
    if (orderIdShort) {
      navigator.clipboard.writeText(orderIdShort);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetAndClose = () => {
    setOrderResult(null);
    setForm({ customerName: '', customerPhone: '', province: '', deliveryZone: '', address: '' });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.province || !form.deliveryZone || !form.address) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (deliveryCost === 0) {
      toast.error('Selecione a zona de entrega');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          province: form.province,
          city: form.deliveryZone,
          address: form.address,
          deliveryFee: deliveryCost,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: grandTotal,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        clearCart();
        setOrderResult({ id: order.id, total: order.total });
      } else {
        toast.error('Erro ao realizar pedido. Tente novamente.');
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (orderResult) {
    const whatsappUrl = `https://wa.me/${ZENYFIT_CONFIG.whatsapp}?text=${buildWhatsAppMessage(orderResult.id)}`;

    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50" onClick={resetAndClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 80 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-t-2xl sm:rounded-3xl max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 text-center">
            {/* Success icon */}
            <motion.div
              className="w-20 h-20 rounded-full bg-zeny-green/10 flex items-center justify-center mx-auto mb-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
              >
                <CheckCircle className="w-10 h-10 text-zeny-green" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-zeny-green-dark mb-2">Pedido Confirmado!</h2>
              <p className="text-sm text-zeny-green-dark/60 mb-6">
                O seu pedido foi registado com sucesso. Envie pelo WhatsApp para confirmação rápida.
              </p>

              {/* Order ID card */}
              <div className="bg-zeny-green-card/50 rounded-xl p-4 mb-4">
                <p className="text-xs text-zeny-green-dark/50 uppercase tracking-wider mb-1">Número do Pedido</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-mono font-bold text-zeny-green-dark tracking-wider">
                    #{orderIdShort}
                  </span>
                  <button
                    onClick={copyOrderId}
                    className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center transition-colors"
                    title="Copiar número"
                  >
                    <Copy className={`w-4 h-4 ${copied ? 'text-zeny-green' : 'text-zeny-green-dark/40'}`} />
                  </button>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">{formatMZN(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entrega ({form.deliveryZone})</span>
                  <span className="text-gray-700">{formatMZN(deliveryCost)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                  <span className="text-zeny-green-dark">Total a Pagar</span>
                  <span className="text-zeny-green">{formatMZN(grandTotal)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => window.open(whatsappUrl, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-5 text-base font-semibold gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Confirmar pelo WhatsApp
                </Button>
                <Button
                  onClick={resetAndClose}
                  variant="outline"
                  className="w-full rounded-full py-5 text-base font-medium border-zeny-green/20 text-zeny-green-dark hover:bg-zeny-green/5 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continuar a Comprar
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Checkout form
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50" onClick={resetAndClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white p-3 sm:p-4 border-b border-zeny-green/10 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl z-10">
          <h2 className="text-base sm:text-lg font-bold text-zeny-green-dark">Finalizar Pedido</h2>
          <button onClick={resetAndClose} className="w-10 h-10 rounded-full hover:bg-zeny-green-card flex items-center justify-center -mr-1">
            <X className="w-5 h-5 text-zeny-green-dark/60" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-3 sm:p-4 bg-zeny-green-card/30">
          <p className="text-sm font-medium text-zeny-green-dark/60 mb-2">{items.length} item(ns) no carrinho</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-zeny-green-dark/70 truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="text-zeny-green-dark font-medium whitespace-nowrap">
                  {formatMZN(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-zeny-green/10">
            <span className="font-bold text-zeny-green-dark">Subtotal</span>
            <span className="font-bold text-zeny-green text-base sm:text-lg">{formatMZN(subtotal)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div>
            <Label className="text-zeny-green-dark text-sm font-medium">Nome Completo *</Label>
            <Input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Seu nome completo"
              className="mt-1.5 h-11 rounded-lg border-zeny-green/20"
              required
            />
          </div>

          <div>
            <Label className="text-zeny-green-dark text-sm font-medium">Telefone / WhatsApp *</Label>
            <Input
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              placeholder="84 XXX XXXX ou 86 XXX XXXX"
              className="mt-1.5 h-11 rounded-lg border-zeny-green/20"
              required
            />
          </div>

          {/* Delivery zone selector */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-amber-800">Entrega disponível apenas em Maputo e Matola</span>
            </div>
          </div>

          <div>
            <Label className="text-zeny-green-dark text-sm font-medium">Área de Entrega *</Label>
            <select
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value, deliveryZone: '' })}
              className="mt-1.5 w-full h-11 rounded-lg border border-zeny-green/20 bg-white px-3 text-sm text-zeny-green-dark focus:outline-none focus:ring-2 focus:ring-zeny-green/30"
              required
            >
              <option value="">Selecione a área</option>
              {deliveryZones.map((area) => (
                <option key={area.province} value={area.province}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>

          <AnimatePresence mode="wait">
            {form.province && (
              <motion.div
                key={form.province}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <Label className="text-zeny-green-dark text-sm font-medium">Bairro / Zona de Entrega *</Label>
                  <select
                    value={form.deliveryZone}
                    onChange={(e) => setForm({ ...form, deliveryZone: e.target.value })}
                    className="mt-1.5 w-full h-11 rounded-lg border border-zeny-green/20 bg-white px-3 text-sm text-zeny-green-dark focus:outline-none focus:ring-2 focus:ring-zeny-green/30"
                    required
                  >
                    <option value="">Selecione o bairro/zona</option>
                    {availableZones.map((zone) => (
                      <option key={zone.name} value={zone.name}>
                        {zone.name} — {formatMZN(zone.cost)}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delivery cost display */}
          <AnimatePresence>
            {deliveryCost > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-zeny-green/5 border border-zeny-green/20 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-zeny-green flex-shrink-0" />
                  <span className="text-sm font-medium text-zeny-green-dark">Custo de entrega: <strong className="text-zeny-green">{formatMZN(deliveryCost)}</strong></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <Label className="text-zeny-green-dark text-sm font-medium">Endereço Completo *</Label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Rua, bairro, número de casa, referência..."
              className="mt-1.5 w-full min-h-[72px] sm:min-h-[80px] rounded-lg border border-zeny-green/20 bg-white px-3 py-2 text-sm text-zeny-green-dark focus:outline-none focus:ring-2 focus:ring-zeny-green/30 resize-none"
              required
            />
          </div>

          {/* Total breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal dos produtos</span>
              <span className="text-gray-700">{formatMZN(subtotal)}</span>
            </div>
            {deliveryCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Entrega ({form.deliveryZone})</span>
                <span className="text-gray-700">{formatMZN(deliveryCost)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span className="text-zeny-green-dark">Total a Pagar</span>
              <span className="text-zeny-green">{formatMZN(grandTotal)}</span>
            </div>
          </div>

          <div className="bg-zeny-green/5 rounded-xl p-3 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-zeny-green mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-zeny-green-dark">Pagamento na Entrega</p>
              <p className="text-xs text-zeny-green-dark/50 mt-0.5">Pague apenas quando receber os seus produtos</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zeny-green hover:bg-zeny-green-dark text-white rounded-full py-5 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                A processar...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Pedido — {formatMZN(grandTotal)}
              </>
            )}
          </Button>

          <p className="text-center text-xs text-zeny-green-dark/40">
            Após confirmar, envie os detalhes pelo WhatsApp para acompanhamento mais rápido
          </p>
        </form>
      </div>
    </div>
  );
}