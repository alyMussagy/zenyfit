'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { ZENYFIT_CONFIG } from '@/lib/zenyfit-config';

const provinces = ZENYFIT_CONFIG.provinces;

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    province: '',
    city: '',
    address: '',
  });

  if (!open) return null;

  const buildWhatsAppMessage = (orderId?: string) => {
    let msg = `*NOVO PEDIDO ${orderId ? `#${orderId.slice(-6).toUpperCase()}` : ''}*\n\n`;
    msg += `*Cliente:* ${form.customerName}\n`;
    msg += `*Telefone:* ${form.customerPhone}\n`;
    msg += `*Localização:* ${form.city}, ${form.province}\n`;
    msg += `*Endereço:* ${form.address}\n\n`;
    msg += `*ITENS:*\n`;
    items.forEach((item, i) => {
      msg += `${i + 1}. ${item.name} x${item.quantity} — ${(item.price * item.quantity).toLocaleString('pt-MZ')} MTn\n`;
    });
    msg += `\n*TOTAL: ${totalPrice().toLocaleString('pt-MZ')} MTn*\n`;
    msg += `\n*Pagamento:* Na entrega`;
    return encodeURIComponent(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.province || !form.city || !form.address) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: totalPrice(),
        }),
      });

      if (res.ok) {
        const order = await res.json();
        const whatsappUrl = `https://wa.me/${ZENYFIT_CONFIG.whatsapp}?text=${buildWhatsAppMessage(order.id)}`;

        clearCart();
        onClose();

        // Show success toast with WhatsApp option
        toast.success('Pedido realizado com sucesso!', {
          description: 'Pode confirmar pelo WhatsApp para acompanhamento mais rápido.',
          duration: 8000,
          action: {
            label: 'Enviar pelo WhatsApp',
            onClick: () => window.open(whatsappUrl, '_blank'),
          },
        });
      } else {
        toast.error('Erro ao realizar pedido. Tente novamente.');
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-zeny-sage/10 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-lg font-bold text-zeny-forest">Finalizar Pedido</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-zeny-warm flex items-center justify-center">
            <X className="w-4 h-4 text-zeny-forest/60" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-zeny-warm/30">
          <p className="text-sm font-medium text-zeny-forest/60 mb-2">{items.length} item(ns) no carrinho</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-zeny-forest/70 truncate mr-2">{item.name} x{item.quantity}</span>
                <span className="text-zeny-forest font-medium whitespace-nowrap">
                  {(item.price * item.quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-zeny-sage/10">
            <span className="font-bold text-zeny-forest">Total</span>
            <span className="font-bold text-zeny-sage text-lg">{totalPrice().toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label className="text-zeny-forest text-sm font-medium">Nome Completo *</Label>
            <Input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Seu nome completo"
              className="mt-1.5 border-zeny-sage/20"
              required
            />
          </div>

          <div>
            <Label className="text-zeny-forest text-sm font-medium">Telefone / WhatsApp *</Label>
            <Input
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              placeholder="84 XXX XXXX ou 86 XXX XXXX"
              className="mt-1.5 border-zeny-sage/20"
              required
            />
          </div>

          <div>
            <Label className="text-zeny-forest text-sm font-medium">Província *</Label>
            <select
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              className="mt-1.5 w-full h-10 rounded-md border border-zeny-sage/20 bg-white px-3 text-sm text-zeny-forest focus:outline-none focus:ring-2 focus:ring-zeny-sage/30"
              required
            >
              <option value="">Selecione a província</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-zeny-forest text-sm font-medium">Cidade / Distrito *</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Ex: Matola, Beira, Nampula..."
              className="mt-1.5 border-zeny-sage/20"
              required
            />
          </div>

          <div>
            <Label className="text-zeny-forest text-sm font-medium">Endereço Completo *</Label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Rua, bairro, número de casa..."
              className="mt-1.5 w-full min-h-[80px] rounded-md border border-zeny-sage/20 bg-white px-3 py-2 text-sm text-zeny-forest focus:outline-none focus:ring-2 focus:ring-zeny-sage/30 resize-none"
              required
            />
          </div>

          <div className="bg-zeny-sage/5 rounded-xl p-3 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-zeny-sage mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-zeny-forest">Pagamento na Entrega</p>
              <p className="text-xs text-zeny-forest/50 mt-0.5">Pague apenas quando receber os seus produtos no endereço indicado</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zeny-sage hover:bg-zeny-sage-dark text-white rounded-full py-5 text-base font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                A processar...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Pedido
              </>
            )}
          </Button>

          <p className="text-center text-xs text-zeny-forest/40">
            Após confirmar, pode enviar os detalhes pelo WhatsApp para acompanhamento mais rápido
          </p>
        </form>
      </div>
    </div>
  );
}