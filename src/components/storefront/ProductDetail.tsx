'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  Clock,
  Package,
  Sparkles,
  X,
  MessageCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { ZENYFIT_CONFIG } from '@/lib/zenyfit-config';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  ingredients?: string[];
  howToUse?: string;
  benefits?: string[];
  weight?: string;
  additionalImages?: string[];
}

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howto' | 'benefits'>('description');
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.id) {
          setProduct(data);
          // Reset state
          setQuantity(1);
          setActiveImage(0);
          setActiveTab('description');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          onBack();
        }
      } catch {
        onBack();
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const allImages = [
    product?.image || '',
    ...(product?.additionalImages || []).filter(Boolean),
  ].filter(Boolean);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;
    const current = cartItems.find((i) => i.productId === product.id);
    const currentQty = current ? current.quantity : 0;
    if (currentQty + quantity > 10) {
      toast.warning('Quantidade máxima atingida (10 unidades)');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const msg = encodeURIComponent(`Olá ZenyFit! Gostaria de saber mais sobre o produto: ${product.name} (${product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })})`);
    window.open(`https://wa.me/${ZENYFIT_CONFIG.whatsapp}?text=${msg}`, '_blank');
  };

  const hasDetails =
    (product?.ingredients?.length && product.ingredients.some((i) => i.trim())) ||
    product?.howToUse?.trim() ||
    (product?.benefits?.length && product.benefits.some((b) => b.trim()));

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-100 rounded w-24 animate-pulse" />
              <div className="h-10 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-20 bg-gray-100 rounded w-full animate-pulse" />
              <div className="h-10 bg-gray-100 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-zeny-green-dark/60 hover:text-zeny-green-dark mb-6 transition-colors group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar aos produtos
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* ─── IMAGEM ─── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={allImages[activeImage] || 'empty'}
                  src={allImages[activeImage] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.img-fallback')) {
                      parent.innerHTML = '<div class="img-fallback flex items-center justify-center w-full h-full bg-gray-100"><svg class="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>';
                    }
                  }}
                />
              </AnimatePresence>
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold bg-black/60 px-4 py-2 rounded-full text-sm">Esgotado</span>
                </div>
              )}
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-zeny-green text-white text-xs shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />Destaque
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-zeny-green shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ─── DETALHES ─── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category badge */}
            <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wider mb-3 bg-zeny-green/10 text-zeny-green-dark border-0">
              {product.category}
            </Badge>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl sm:text-4xl font-bold text-zeny-green-dark">
                {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
              </span>
              {product.weight && (
                <span className="text-sm text-gray-400">{product.weight}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Delivery info bar */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Truck className="w-5 h-5 text-zeny-green" />
                <span className="text-[11px] text-gray-500 leading-tight">Entrega em Maputo e Matola</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Shield className="w-5 h-5 text-zeny-green" />
                <span className="text-[11px] text-gray-500 leading-tight">Pagamento na entrega</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Clock className="w-5 h-5 text-zeny-green" />
                <span className="text-[11px] text-gray-500 leading-tight">Entrega rápida</span>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            {product.inStock && (
              <div className="flex gap-3 mb-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-500" />
                  </button>
                  <span className="w-12 h-11 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-11 bg-zeny-green hover:bg-zeny-green-dark text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-zeny-green/20"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            )}

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors mb-8"
            >
              <MessageCircle className="w-4 h-4" />
              Perguntar pelo WhatsApp
            </button>

            {/* ─── TABS de detalhe ─── */}
            {hasDetails && (
              <div className="border-t border-gray-100 pt-6">
                {/* Tab buttons */}
                <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
                  <TabBtn active={activeTab === 'description'} onClick={() => setActiveTab('description')}>Descrição</TabBtn>
                  {product.ingredients?.some((i) => i.trim()) && (
                    <TabBtn active={activeTab === 'ingredients'} onClick={() => setActiveTab('ingredients')}>Ingredientes</TabBtn>
                  )}
                  {product.howToUse?.trim() && (
                    <TabBtn active={activeTab === 'howto'} onClick={() => setActiveTab('howto')}>Modo de Usar</TabBtn>
                  )}
                  {product.benefits?.some((b) => b.trim()) && (
                    <TabBtn active={activeTab === 'benefits'} onClick={() => setActiveTab('benefits')}>Benefícios</TabBtn>
                  )}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'description' && (
                    <TabPanel key="desc">
                      <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                      {product.weight && (
                        <p className="text-sm text-gray-500 mt-3"><span className="font-medium">Quantidade:</span> {product.weight}</p>
                      )}
                    </TabPanel>
                  )}
                  {activeTab === 'ingredients' && (
                    <TabPanel key="ing">
                      <ul className="space-y-2">
                        {product.ingredients?.filter((i) => i.trim()).map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-zeny-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-zeny-green" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </TabPanel>
                  )}
                  {activeTab === 'howto' && (
                    <TabPanel key="how">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{product.howToUse}</p>
                    </TabPanel>
                  )}
                  {activeTab === 'benefits' && (
                    <TabPanel key="ben">
                      <ul className="space-y-2">
                        {product.benefits?.filter((b) => b.trim()).map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-zeny-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-zeny-green" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </TabPanel>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── Small sub-components ─── */

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-zeny-green text-white shadow-sm'
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

function TabPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="min-h-[80px]"
    >
      {children}
    </motion.div>
  );
}