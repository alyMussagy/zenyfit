'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Eye, Package, Search } from 'lucide-react';
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

const categories = ['Todos', 'Skincare', 'Corpo', 'Suplementos', 'Aromaterapia', 'Cabelo'];

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch {
        toast.error('Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'Todos') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      );
    }
    setFiltered(result);
  }, [products, activeCategory, search]);

  const handleAddToCart = (product: Product) => {
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
    <section id="produtos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <ScrollReveal variant="fadeUp" delay={0.1}>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-zeny-green-dark mb-3">Nossos Produtos</h2>
          <p className="text-zeny-green-dark/60 max-w-lg mx-auto">
            Selecionamos os melhores produtos para cuidar da sua saúde, beleza e bem-estar
          </p>
        </div>
      </ScrollReveal>

      {/* Search & Filter */}
      <ScrollReveal variant="fadeUp" delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zeny-green/40" />
            <Input
              placeholder="Pesquisar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-zeny-green/20 focus:border-zeny-green bg-white transition-colors duration-200"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, index) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'bg-zeny-green text-white shadow-md shadow-zeny-green/20'
                    : 'bg-white text-zeny-green-dark/70 hover:bg-zeny-green/10 border border-zeny-green/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.04 }}
              >
                {cat}
                {categoryCounts[cat] !== undefined && (
                  <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-white/70' : 'text-zeny-green-dark/30'}`}>
                    {categoryCounts[cat]}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 overflow-hidden">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                className="group bg-white rounded-2xl overflow-hidden border border-zeny-green/5 card-hover-lift"
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
                  {/* Quick actions */}
                  <motion.div
                    className="absolute bottom-3 right-3 flex gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      onClick={() => setSelectedProduct(product)}
                      className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="w-4 h-4 text-zeny-green-dark" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <motion.p
                    className="text-xs text-zeny-green font-medium uppercase tracking-wider mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.06 }}
                  >
                    {product.category}
                  </motion.p>
                  <h3 className="font-semibold text-zeny-green-dark text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-zeny-green-dark/50 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-zeny-green-dark">
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
                        className="w-9 h-9 rounded-full bg-zeny-green hover:bg-zeny-green-dark text-white transition-colors duration-200"
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

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-zeny-green-card relative">
                <motion.img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    (target.parentElement as HTMLElement).innerHTML = '<div class="flex items-center justify-center w-full h-full bg-zeny-green-card"><svg class="w-16 h-16 text-zeny-green/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>';
                  }}
                />
                <motion.button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white text-zeny-green-dark/60"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Badge className="mb-3 bg-zeny-green/10 text-zeny-green hover:bg-zeny-green/20 text-xs">{selectedProduct.category}</Badge>
                  <h3 className="text-xl font-bold text-zeny-green-dark mb-2">{selectedProduct.name}</h3>
                  <p className="text-sm text-zeny-green-dark/60 mb-4 leading-relaxed">{selectedProduct.description}</p>
                  <div className="flex items-center gap-2 mb-6">
                    {[1,2,3,4,5].map((s, i) => (
                      <motion.svg
                        key={s}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                        viewBox="0 0 20 20"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.06, type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                    <span className="text-xs text-zeny-green-dark/40 ml-1">(4.8)</span>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-2xl font-bold text-zeny-green-dark">
                    {selectedProduct.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                  </span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                      disabled={!selectedProduct.inStock}
                      className="bg-zeny-green hover:bg-zeny-green-dark text-white rounded-full px-6 transition-colors duration-200"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}