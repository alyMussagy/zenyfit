'use client';

import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, X, Package, Upload, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

const categories = ['Skincare', 'Corpo', 'Suplementos', 'Aromaterapia', 'Cabelo'];

export default function ProductManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'Skincare',
    inStock: true,
    featured: false,
  });
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products-admin', search],
    queryFn: () => fetch(`/api/products?search=${search}`).then((r) => r.json()),
  });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', image: '', category: 'Skincare', inStock: true, featured: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      featured: product.featured,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este produto?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      toast.success('Produto eliminado');
      queryClient.invalidateQueries({ queryKey: ['products-admin'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch {
      toast.error('Erro ao eliminar produto');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem demasiado grande. Máximo 5MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, image: data.url }));
        toast.success('Imagem carregada');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Erro no upload');
      }
    } catch {
      toast.error('Erro no upload da imagem');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        toast.success('Produto actualizado');
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        toast.success('Produto criado');
      }
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['products-admin'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch {
      toast.error('Erro ao salvar produto');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Gestão de Produtos</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-zeny-sage hover:bg-zeny-sage-dark text-white whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={resetForm}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={resetForm} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium">Nome do Produto *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Sérum Vitamina C" className="mt-1.5" required />
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição *</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrição detalhada do produto..."
                  className="mt-1.5 w-full min-h-[80px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zeny-sage/30 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Preço (MZN) *</Label>
                  <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" className="mt-1.5" required />
                </div>
                <div>
                  <Label className="text-sm font-medium">Categoria *</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1.5 w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeny-sage/30"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label className="text-sm font-medium">Imagem do Produto</Label>
                <div className="mt-1.5 space-y-2">
                  {form.image && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-sm text-gray-500 hover:border-zeny-sage hover:text-zeny-sage transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : form.image ? (
                      <>
                        <Upload className="w-4 h-4" />
                        Alterar imagem
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        Carregar imagem (JPG, PNG, WebP - máx. 5MB)
                      </>
                    )}
                  </button>
                  <div className="text-center">
                    <span className="text-xs text-gray-400">ou</span>
                  </div>
                  <Input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Cole URL de imagem externa (opcional)"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-zeny-sage focus:ring-zeny-sage" />
                  <span className="text-sm text-gray-700">Em stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-zeny-sage focus:ring-zeny-sage" />
                  <span className="text-sm text-gray-700">Destaque</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancelar</Button>
                <Button type="submit" disabled={uploading} className="flex-1 bg-zeny-sage hover:bg-zeny-sage-dark text-white">
                  {editingId ? 'Actualizar' : 'Criar Produto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product List */}
      {isLoading ? (
        <div className="grid gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Produto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Categoria</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Preço</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Acções</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p>Nenhum produto encontrado</p>
                      </td>
                    </tr>
                  )}
                  {products?.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt="" className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <Package className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.inStock ? 'Em Stock' : 'Esgotado'}
                          </span>
                          {product.featured && (
                            <span className="text-xs px-2 py-0.5 rounded-full w-fit bg-amber-100 text-amber-700">Destaque</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(product)} className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center" title="Editar">
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center" title="Eliminar">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}