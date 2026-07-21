'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Heart,
  Share2,
  ZoomIn,
  X,
  Leaf,
  Droplets,
  Hand,
  Pill,
  Flower2,
  Scissors,
  Info,
  Star,
  RotateCcw,
  CreditCard,
  MapPin,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { ZENYFIT_CONFIG } from '@/lib/zenyfit-config';
import type { Product } from '@/types/product';
import ProductReviews, { MiniStarRating } from '@/components/storefront/ProductReviews';

/* ─── Category icon map ─── */
const categoryIcons: Record<string, React.ElementType> = {
  Skincare: Droplets,
  Corpo: Hand,
  Suplementos: Pill,
  Aromaterapia: Flower2,
  Cabelo: Scissors,
};

/* ─── Trust badges config ─── */
const trustBadges = [
  { icon: Truck, title: 'Entrega Rápida', desc: 'Maputo e Matola' },
  { icon: Shield, title: 'Pagamento na Entrega', desc: 'Pague quando receber' },
  { icon: Clock, title: 'Suporte 8h-18h', desc: 'Seg a Sex' },
  { icon: RotateCcw, title: 'Devolução Fácil', desc: 'Em até 48h' },
];

/* ─── FAQ default items ─── */
const defaultFaqs = [
  { q: 'Este produto é original?', a: 'Sim, todos os nossos produtos são 100% originais, adquiridos directamente de distribuidores autorizados. A ZenyFit garante a autenticidade de cada item vendido na nossa loja.' },
  { q: 'Como funciona a entrega?', a: 'Realizamos entregas em Maputo Cidade e Maputo Província (Matola). O custo de entrega é confirmado pelo nosso atendente via WhatsApp após a confirmação do pedido. O pagamento é feito na entrega.' },
  { q: 'Posso devolver o produto?', a: 'Sim, aceitamos devoluções em até 48 horas após o recebimento, desde que o produto esteja lacrado e na embalagem original. Entre em contacto connosco pelo WhatsApp para iniciar o processo.' },
  { q: 'Quanto tempo demora a entrega?', a: 'As entregas em Maputo Cidade são feitas geralmente em 1-2 dias úteis. Para Matola, o prazo é de 2-3 dias úteis. O atendente confirma o prazo exacto após o pedido.' },
];

export default function ProductPageClient({ initialProduct }: { initialProduct: Product }) {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product>(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'descricao' | 'beneficios' | 'ingredientes' | 'modo-usar' | 'avaliacoes' | 'faq'>('descricao');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageZoom, setImageZoom] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const allImages = [
    product?.image || '',
    ...(product?.additionalImages || []).filter(Boolean),
  ].filter(Boolean);

  // Fetch related products
  useEffect(() => {
    if (product?.category) {
      fetch(`/api/products/related?category=${encodeURIComponent(product.category)}&excludeId=${product.id}&limit=4`)
        .then((r) => r.json())
        .then((data) => setRelatedProducts(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [product?.category, product?.id]);

  // Check favorite state from localStorage
  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('zenyfit-favorites') || '[]');
      setIsFavorited(favs.includes(productId));
    } catch {}
  }, [productId]);

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
    const msg = encodeURIComponent(
      `Olá ZenyFit! Gostaria de saber mais sobre: *${product.name}*\nPreço: ${product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}${product.weight ? `\nTamanho: ${product.weight}` : ''}\n\nPodem dar-me mais informações?`
    );
    window.open(`https://wa.me/${ZENYFIT_CONFIG.whatsapp}?text=${msg}`, '_blank');
  };

  const toggleFavorite = () => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('zenyfit-favorites') || '[]');
      if (favs.includes(productId)) {
        const updated = favs.filter((f) => f !== productId);
        localStorage.setItem('zenyfit-favorites', JSON.stringify(updated));
        setIsFavorited(false);
        toast.info('Removido dos favoritos');
      } else {
        favs.push(productId);
        localStorage.setItem('zenyfit-favorites', JSON.stringify(favs));
        setIsFavorited(true);
        toast.success('Adicionado aos favoritos!');
      }
    } catch {}
  };

  const handleShare = (method: 'native' | 'whatsapp' | 'copy') => {
    const url = window.location.href;
    const text = `${product.name} - ${product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })} | ZenyFit`;
    if (method === 'native' && navigator.share) {
      navigator.share({ title: product.name, text, url });
    } else if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    }
    setShowShareMenu(false);
  };

  const hasDetails =
    (product?.ingredients?.length && product.ingredients.some((i) => i.trim())) ||
    product?.howToUse?.trim() ||
    (product?.benefits?.length && product.benefits.some((b) => b.trim()));

  const CatIcon = categoryIcons[product.category] || Package;

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* ─── BREADCRUMB ─── */}
        <nav className="flex items-center gap-1.5 text-sm text-zeny-green-dark/50 mb-6 overflow-x-auto">
          <button onClick={() => router.push('/')} className="hover:text-zeny-green-dark transition-colors whitespace-nowrap">
            Início
          </button>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <button onClick={() => router.push('/#produtos')} className="hover:text-zeny-green-dark transition-colors whitespace-nowrap">
            Produtos
          </button>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <button onClick={() => router.push(`/#produtos`)} className="hover:text-zeny-green-dark transition-colors whitespace-nowrap">
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-zeny-green-dark font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* ════════════════════ LEFT: IMAGE GALLERY ════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main image with zoom button */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 group cursor-zoom-in" onClick={() => allImages.length > 0 && setImageZoom(true)}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={allImages[activeImage] || 'empty'}
                  src={allImages[activeImage] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
              {/* Zoom overlay */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
              {/* Badges */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-semibold bg-black/60 px-5 py-2.5 rounded-full text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Esgotado
                  </span>
                </div>
              )}
              {product.featured && product.inStock && (
                <Badge className="absolute top-4 left-4 bg-zeny-green text-white text-xs shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />Destaque
                </Badge>
              )}
              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  {activeImage + 1} / {allImages.length}
                </div>
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
                      activeImage === i ? 'border-zeny-green shadow-md ring-2 ring-zeny-green/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - imagem ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile trust badges */}
            <div className="grid grid-cols-2 gap-2 mt-4 lg:hidden">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.title} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                    <Icon className="w-5 h-5 text-zeny-green flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{badge.title}</p>
                      <p className="text-[10px] text-gray-500">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ════════════════════ RIGHT: PRODUCT INFO ════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category + actions row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CatIcon className="w-4 h-4 text-zeny-green" />
                <Badge variant="secondary" className="text-xs uppercase tracking-wider bg-zeny-green/10 text-zeny-green-dark border-0">
                  {product.category}
                </Badge>
                {product.weight && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{product.weight}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  onClick={toggleFavorite}
                  whileTap={{ scale: 0.85 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors"
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
                </motion.button>
                <div className="relative">
                  <motion.button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    whileTap={{ scale: 0.85 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </motion.button>
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-48 z-50"
                      >
                        <button onClick={() => handleShare('native')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Share2 className="w-4 h-4" /> Partilhar...
                        </button>
                        <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                        </button>
                        <button onClick={() => handleShare('copy')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                          Copiar link
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-4">
              <MiniStarRating productId={product.id} />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-gray-100">
              <span className="text-3xl sm:text-4xl font-bold text-zeny-green-dark">
                {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
              </span>
            </div>

            {/* Short description */}
            <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">
              {product.description}
            </p>

            {/* Desktop trust badges */}
            <div className="hidden lg:grid grid-cols-4 gap-3 mb-6">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.title} className="flex flex-col items-center text-center gap-1.5 p-3 bg-gray-50 rounded-xl">
                    <Icon className="w-5 h-5 text-zeny-green" />
                    <span className="text-xs font-semibold text-gray-900">{badge.title}</span>
                    <span className="text-[10px] text-gray-500 leading-tight">{badge.desc}</span>
                  </div>
                );
              })}
            </div>

            {/* Quantity + Add to Cart */}
            {product.inStock ? (
              <div className="flex gap-3 mb-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-500" />
                  </button>
                  <span className="w-14 h-12 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-zeny-green hover:bg-zeny-green-dark text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-zeny-green/20"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Produto esgotado</p>
                  <p className="text-xs text-red-500">Entre em contacto pelo WhatsApp para saber quando estará disponível</p>
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors mb-4"
            >
              <MessageCircle className="w-5 h-5" />
              Perguntar pelo WhatsApp
            </button>

            {/* Delivery info box */}
            <div className="p-4 bg-zeny-green/5 border border-zeny-green/10 rounded-xl mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-zeny-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Entrega em Maputo e Matola</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    O custo de entrega é confirmado pelo nosso atendente via WhatsApp após a confirmação do seu pedido.
                    Pagamento feito na entrega (Cash on Delivery).
                  </p>
                  <a
                    href={`https://wa.me/${ZENYFIT_CONFIG.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber sobre o custo de entrega.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zeny-green hover:text-zeny-green-dark mt-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Perguntar sobre entrega
                  </a>
                </div>
              </div>
            </div>

            {/* ════════════════════ RICH TABS ════════════════════ */}
            <div className="border-t border-gray-100 pt-6">
              {/* Tab buttons */}
              <div className="flex gap-1 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                <TabBtn active={activeTab === 'descricao'} onClick={() => setActiveTab('descricao')}>Descrição</TabBtn>
                {product.benefits?.some((b) => b.trim()) && (
                  <TabBtn active={activeTab === 'beneficios'} onClick={() => setActiveTab('beneficios')}>Benefícios</TabBtn>
                )}
                {product.ingredients?.some((i) => i.trim()) && (
                  <TabBtn active={activeTab === 'ingredientes'} onClick={() => setActiveTab('ingredientes')}>Ingredientes</TabBtn>
                )}
                {product.howToUse?.trim() && (
                  <TabBtn active={activeTab === 'modo-usar'} onClick={() => setActiveTab('modo-usar')}>Modo de Usar</TabBtn>
                )}
                <TabBtn active={activeTab === 'avaliacoes'} onClick={() => setActiveTab('avaliacoes')}>Avaliações</TabBtn>
                <TabBtn active={activeTab === 'faq'} onClick={() => setActiveTab('faq')}>Perguntas</TabBtn>
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === 'descricao' && (
                  <TabPanel key="desc">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                      {product.weight && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Package className="w-4 h-4 text-zeny-green" />
                          <span><span className="font-medium text-gray-700">Quantidade:</span> {product.weight}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CreditCard className="w-4 h-4 text-zeny-green" />
                        <span><span className="font-medium text-gray-700">Pagamento:</span> Cash on Delivery (pagamento na entrega)</span>
                      </div>
                      {product.category && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {(() => { const CI = categoryIcons[product.category] || Package; return <CI className="w-4 h-4 text-zeny-green" />; })()}
                          <span><span className="font-medium text-gray-700">Categoria:</span> {product.category}</span>
                        </div>
                      )}
                    </div>
                  </TabPanel>
                )}

                {activeTab === 'beneficios' && (
                  <TabPanel key="ben">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 mb-4">Conheça os principais benefícios deste produto para a sua saúde e bem-estar:</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {product.benefits?.filter((b) => b.trim()).map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100"
                          >
                            <div className="w-6 h-6 rounded-full bg-zeny-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5 text-zeny-green" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </TabPanel>
                )}

                {activeTab === 'ingredientes' && (
                  <TabPanel key="ing">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-500 mb-4">Lista de ingredientes presentes na composição deste produto:</p>
                      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-700 leading-relaxed">
                            Antes de utilizar, verifique se tem alergia a algum dos ingredientes listados abaixo.
                            Em caso de irritação, suspenda o uso e consulte um profissional de saúde.
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {product.ingredients?.filter((i) => i.trim()).map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <div className="w-2 h-2 rounded-full bg-zeny-green flex-shrink-0 mt-1.5" />
                              <span className="text-sm text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabPanel>
                )}

                {activeTab === 'modo-usar' && (
                  <TabPanel key="how">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">Siga as instruções abaixo para obter os melhores resultados:</p>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <Droplets className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-semibold text-gray-900">Instruções de Uso</p>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {product.howToUse}
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <Leaf className="w-5 h-5 text-zeny-green flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-900 mb-1">Dica ZenyFit</p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Para melhores resultados, utilize o produto regularmente conforme indicado.
                            Combine com uma alimentação equilibrada e hábitos saudáveis.
                            Em caso de dúvidas, fale connosco pelo WhatsApp.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                )}

                {activeTab === 'avaliacoes' && (
                  <TabPanel key="rev">
                    <ProductReviews productId={product.id} />
                  </TabPanel>
                )}

                {activeTab === 'faq' && (
                  <TabPanel key="faq">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 mb-4">Perguntas frequentes sobre este produto:</p>
                      {defaultFaqs.map((faq, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${expandedFaq === i ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {expandedFaq === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </TabPanel>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ════════════════════ RELATED PRODUCTS ════════════════════ */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="mt-16 sm:mt-24"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produtos Relacionados</h2>
                <p className="text-sm text-gray-500 mt-1">Você também pode gostar destes produtos</p>
              </div>
              <button
                onClick={() => router.push('/#produtos')}
                className="text-sm text-zeny-green hover:text-zeny-green-dark font-medium flex items-center gap-1 transition-colors"
              >
                Ver todos <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((rp, index) => (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <RelatedProductCard product={rp} onClick={() => router.push(`/produto/${rp.id}`)} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ════════════════════ IMAGE ZOOM MODAL ════════════════════ */}
      <AnimatePresence>
        {imageZoom && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setImageZoom(false)}
          >
            <button
              onClick={() => setImageZoom(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <img
              src={allImages[activeImage]}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {allImages.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImage ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Sub-components ─── */

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-zeny-green text-white shadow-sm shadow-zeny-green/20'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
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
      className="min-h-[120px]"
    >
      {children}
    </motion.div>
  );
}

function RelatedProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) {
      toast.error('Este produto está esgotado');
      return;
    }
    addItem({ productId: product.id, name: product.name, price: product.price, image: product.image });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-zeny-green/20 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.img-fallback')) {
              parent.innerHTML = '<div class="img-fallback flex items-center justify-center w-full h-full bg-gray-100"><svg class="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>';
            }
          }}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-medium bg-black/60 px-3 py-1 rounded-full">Esgotado</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[10px] text-zeny-green font-medium uppercase tracking-wider mb-0.5">{product.category}</p>
        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight mb-1.5 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
          </span>
          <button
            onClick={handleCart}
            disabled={!product.inStock}
            className="w-7 h-7 rounded-full bg-zeny-green hover:bg-zeny-green-dark text-white flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}