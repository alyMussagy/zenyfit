'use client';

import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-20 h-20 rounded-full bg-zeny-green-card flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 text-zeny-green/40" />
        </div>
        <p className="text-zeny-green-dark/50 font-medium mb-1">Carrinho vazio</p>
        <p className="text-zeny-green-dark/30 text-sm text-center">Adicione produtos para começar as suas compras</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zeny-green/10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zeny-green-dark">
            Carrinho ({items.length})
          </h2>
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 bg-zeny-green-card/50 rounded-xl p-3">
            <div className="w-16 h-16 rounded-lg bg-zeny-green-card flex-shrink-0 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  (target.parentElement as HTMLElement).innerHTML = '<div class="flex items-center justify-center w-full h-full bg-zeny-green-card"><svg class="w-6 h-6 text-zeny-green/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zeny-green-dark truncate">{item.name}</p>
              <p className="text-sm font-bold text-zeny-green mt-1">
                {item.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-9 h-9 rounded-full border border-zeny-green/20 flex items-center justify-center hover:bg-zeny-green/10 active:bg-zeny-green/15"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-9 h-9 rounded-full border border-zeny-green/20 flex items-center justify-center hover:bg-zeny-green/10 active:bg-zeny-green/15"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-auto w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-500 active:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-zeny-green/10 p-4 space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zeny-green-dark/60">Subtotal</span>
          <span className="font-bold text-zeny-green-dark">
            {totalPrice().toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
          </span>
        </div>
        <p className="text-xs text-zeny-green-dark/40 text-center">
          Entrega + pagamento na entrega
        </p>
        <Button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-zeny-green hover:bg-zeny-green-dark text-white rounded-full py-5 text-base font-semibold"
        >
          Finalizar Pedido
        </Button>
      </div>

      {showCheckout && (
        <CheckoutModal open={showCheckout} onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
}