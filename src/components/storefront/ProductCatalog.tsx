'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';

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

  return (
    <section id="produtos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-zeny-green-dark mb-3">Nossos Produtos</h2>
        <p className="text-zeny-green-dark/60 max-w-lg mx-auto">
          Selecionamos os melhores produtos para cuidar da sua saúde, beleza e bem-estar
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Pesquisar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4 border-zeny-green/20 focus:border-zeny-green bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-zeny-green text-white shadow-md shadow-zeny-green/20'
                  : 'bg-white text-zeny-green-dark/70 hover:bg-zeny-green/10 border border-zeny-green/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="aspect-square bg-zeny-green-card rounded-xl mb-3" />
              <div className="h-4 bg-zeny-green-card rounded w-3/4 mb-2" />
              <div className="h-3 bg-zeny-green-card rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zeny-green-dark/40 text-lg">Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white rounded-2xl overflow-hidden border border-zeny-green/5 hover:shadow-xl hover:shadow-zeny-green/10 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-zeny-green-card">
                <div className="absolute inset-0 flex items-center justify-center text-zeny-green/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      (target.parentElement as HTMLElement).innerHTML = '<div class="flex items-center justify-center w-full h-full bg-zeny-green-card"><svg class="w-12 h-12 text-zeny-green/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>';
                    }}
                  />
                </div>
                {product.featured && (
                  <Badge className="absolute top-3 left-3 bg-zeny-green text-white text-[10px]">
                    Destaque
                  </Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-medium text-sm bg-black/60 px-3 py-1 rounded-full">Esgotado</span>
                  </div>
                )}
                {/* Quick actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-md"
                  >
                    <Eye className="w-4 h-4 text-zeny-green-dark" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-zeny-green font-medium uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-semibold text-zeny-green-dark text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-xs text-zeny-green-dark/50 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-zeny-green-dark">
                    {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                  </span>
                  <Button
                    size="icon"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="w-9 h-9 rounded-full bg-zeny-green hover:bg-zeny-green-dark text-white"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedProduct(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-zeny-green-card relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  (target.parentElement as HTMLElement).innerHTML = '<div class="flex items-center justify-center w-full h-full bg-zeny-green-card"><svg class="w-16 h-16 text-zeny-green/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>';
                }}
              />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                ✕
              </button>
            </div>
            <div className="p-6">
              <Badge className="mb-3 bg-zeny-green/10 text-zeny-green hover:bg-zeny-green/20 text-xs">{selectedProduct.category}</Badge>
              <h3 className="text-xl font-bold text-zeny-green-dark mb-2">{selectedProduct.name}</h3>
              <p className="text-sm text-zeny-green-dark/60 mb-4 leading-relaxed">{selectedProduct.description}</p>
              <div className="flex items-center gap-2 mb-6">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-zeny-green-dark/40 ml-1">(4.8)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-zeny-green-dark">
                  {selectedProduct.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </span>
                <Button
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                  disabled={!selectedProduct.inStock}
                  className="bg-zeny-green hover:bg-zeny-green-dark text-white rounded-full px-6"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}