'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Package, Search, Sparkles, SlidersHorizontal, LayoutGrid, Droplets, Hand, Pill, Flower2, Scissors } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import ScrollReveal from './ScrollReveal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
}

const categoryConfig: { name: string; icon: React.ElementType }[] = [
  { name: 'Todos', icon: LayoutGrid },
  { name: 'Skincare', icon: Droplets },
  { name: 'Corpo', icon: Hand },
  { name: 'Suplementos', icon: Pill },
  { name: 'Aromaterapia', icon: Flower2 },
  { name: 'Cabelo', icon: Scissors },
];

type SortOption = 'recentes' | 'preco-asc' | 'preco-desc' | 'nome-asc';

const sortLabels: Record<SortOption, string> = {
  recentes: 'Mais recentes',
  'preco-asc': 'Menor preço',
  'preco-desc': 'Maior preço',
  'nome-asc': 'Nome A-Z',
};

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const setSelectedProductId = useAppStore((s) => s.setSelectedProductId);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recentes');
  const [showFilters, setShowFilters] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      } catch {
        toast.error('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'Todos') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      );
    }

    // Featured filter
    if (showFeaturedOnly) {
      result = result.filter((p) => p.featured);
    }

    // Hide out of stock
    if (hideOutOfStock) {
      result = result.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case 'preco-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'preco-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'nome-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'pt'));
        break;
      case 'recentes':
      default:
        // Already ordered by createdAt desc from API, keep stable
        break;
    }

    setFiltered(result);
  }, [products, activeCategory, search, showFeaturedOnly, hideOutOfStock, sortBy]);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('Este produto está esgotado');
      return;
    }
    const current = useCartStore.getState().items.find((i) => i.productId === product.id);
    if (current && current.quantity >= 10) {
      toast.warning('Quantidade máxima atingida (10 unidades)');
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  // Memoize category items count
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <section id="produtos" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zeny-green-dark mb-3">Nossos Produtos</h2>
          <p className="text-sm sm:text-base text-zeny-green-dark/60 max-w-lg mx-auto">
            Selecionamos os melhores produtos para cuidar da sua saúde, beleza e bem-estar
          </p>
        </div>
      </ScrollReveal>

      {/* Search & Filter */}
      <ScrollReveal variant="fadeUp" delay={0.2}>
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          {/* Search + filter toggle row */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zeny-green/40" />
              <Input
                placeholder="Pesquisar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-zeny-green/20 focus:border-zeny-green bg-white transition-colors duration-200"
              />
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 px-3 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
                showFilters ? 'bg-zeny-green text-white border-zeny-green' : 'bg-white text-zeny-green-dark/70 border-zeny-green/20 hover:bg-zeny-green/5'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
              {(showFeaturedOnly || hideOutOfStock || sortBy !== 'recentes') && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </motion.button>
          </div>

          {/* Category bar with icons */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible scroll-x-no-scrollbar pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categoryConfig.map((cat, index) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 whitespace-nowrap min-w-[64px] sm:min-w-0 ${
                    isActive
                      ? 'bg-zeny-green text-white shadow-lg shadow-zeny-green/25'
                      : 'bg-white text-zeny-green-dark/60 hover:bg-zeny-green/5 border border-gray-100 hover:border-zeny-green/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-white' : 'text-zeny-green-dark/50'}`} strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
                    {cat.name}
                  </span>
                  {(categoryCounts[cat.name] ?? 0) > 0 && cat.name !== 'Todos' && (
                    <span className={`text-[9px] sm:text-[10px] font-medium ${isActive ? 'text-white/60' : 'text-zeny-green-dark/30'}`}>
                      {categoryCounts[cat.name]}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Extended filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-xl border border-zeny-green/10 p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                  {/* Featured toggle */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                      className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${showFeaturedOnly ? 'bg-zeny-green' : 'bg-gray-200'}`}
                    >
                      <motion.span
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        animate={{ left: showFeaturedOnly ? '18px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-zeny-green-dark/70">Apenas em destaque</span>
                  </label>

                  {/* Out of stock toggle */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <button
                      onClick={() => setHideOutOfStock(!hideOutOfStock)}
                      className={`w-9 h-5 rounded-full transition-colors duration-200 relative ${hideOutOfStock ? 'bg-zeny-green' : 'bg-gray-200'}`}
                    >
                      <motion.span
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        animate={{ left: hideOutOfStock ? '18px' : '2px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                    <span className="text-sm text-zeny-green-dark/70">Ocultar esgotados</span>
                  </label>

                  {/* Sort */}
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <span className="text-sm text-zeny-green-dark/50">Ordenar:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="text-sm border border-zeny-green/20 rounded-lg px-3 py-1.5 bg-white text-zeny-green-dark focus:outline-none focus:border-zeny-green"
                    >
                      {Object.entries(sortLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filter chips */}
          {(showFeaturedOnly || hideOutOfStock || sortBy !== 'recentes') && (
            <div className="flex flex-wrap gap-2">
              {showFeaturedOnly && (
                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 cursor-pointer hover:bg-amber-100" onClick={() => setShowFeaturedOnly(false)}>
                  <Sparkles className="w-3 h-3 mr-1" /> Em destaque ✕
                </Badge>
              )}
              {hideOutOfStock && (
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 cursor-pointer hover:bg-green-100" onClick={() => setHideOutOfStock(false)}>
                  Sem esgotados ✕
                </Badge>
              )}
              {sortBy !== 'recentes' && (
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 cursor-pointer hover:bg-blue-100" onClick={() => setSortBy('recentes')}>
                  {sortLabels[sortBy]} ✕
                </Badge>
              )}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 overflow-hidden">
              <div className="aspect-square rounded-xl animate-shimmer" />
              <div className="mt-3 h-4 bg-zeny-green-card rounded w-3/4 animate-shimmer" />
              <div className="mt-2 h-3 bg-zeny-green-card rounded w-1/2 animate-shimmer" />
              <div className="mt-2 h-5 bg-zeny-green-card rounded w-2/5 animate-shimmer" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <ScrollReveal variant="scale" delay={0.1}>
          <div className="text-center py-20">
            <motion.div
              className="w-20 h-20 rounded-full bg-zeny-green-card flex items-center justify-center mx-auto mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Package className="w-10 h-10 text-zeny-green/30" />
            </motion.div>
            <p className="text-zeny-green-dark/50 text-lg font-medium mb-2">
              {products.length === 0 ? 'Nenhum produto disponível ainda' : 'Nenhum produto encontrado'}
            </p>
            <p className="text-zeny-green-dark/30 text-sm">
              {products.length === 0 ? 'Os produtos serão adicionados em breve pela equipa ZenyFit' : 'Tente outra pesquisa ou categoria'}
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-zeny-green/5 card-hover-lift"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-zeny-green-card">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.img-fallback')) {
                        parent.innerHTML = '<div class="img-fallback flex items-center justify-center w-full h-full bg-zeny-green-card"><svg class="w-12 h-12 text-zeny-green/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>';
                      }
                    }}
                  />
                  {product.featured && (
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.06 }}
                    >
                      <Badge className="absolute top-3 left-3 bg-zeny-green text-white text-[10px]">
                        Destaque
                      </Badge>
                    </motion.div>
                  )}
                  {!product.inStock && (
                    <motion.div
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="text-white font-medium text-sm bg-black/60 px-3 py-1 rounded-full">Esgotado</span>
                    </motion.div>
                  )}
                  {/* Quick actions - always visible on mobile, hover on desktop */}
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex gap-1.5">
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); setSelectedProductId(product.id); }}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md active:scale-90 transition-transform"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zeny-green-dark" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zeny-green flex items-center justify-center shadow-md active:scale-90 transition-transform"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 sm:p-4 cursor-pointer" onClick={() => setSelectedProductId(product.id)}>
                  <motion.p
                    className="text-[10px] sm:text-xs text-zeny-green font-medium uppercase tracking-wider mb-0.5 sm:mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.06 }}
                  >
                    {product.category}
                  </motion.p>
                  <h3 className="font-semibold text-zeny-green-dark text-xs sm:text-sm leading-tight mb-1 sm:mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-[10px] sm:text-xs text-zeny-green-dark/50 mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-lg font-bold text-zeny-green-dark">
                      {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                    >
                      <Button
                        size="icon"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zeny-green hover:bg-zeny-green-dark text-white transition-colors duration-200"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}