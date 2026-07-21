'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, Check, X, Trash2, Plus, Search, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';
import ConfirmDialog from '@/components/ui/confirm-dialog';

interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  Product?: { name: string };
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' });
}

export default function ReviewManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({ productId: '', customerName: '', rating: 4, comment: '' });

  // Fetch products for the dropdown selector
  const { data: products } = useQuery<{ id: string; name: string }[]>({
    queryKey: ['products-for-review'],
    queryFn: () => fetch('/api/products').then((r) => r.json()).then((d) => (Array.isArray(d) ? d : [])),
  });

  const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['reviews-admin', statusFilter],
    queryFn: () => authFetch(`/api/admin/reviews?status=${statusFilter}`).then((r) => r.json()),
  });

  const pendingCount = reviews?.filter((r) => !r.approved).length || 0;

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await authFetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });
      toast.success(approved ? 'Avaliação aprovada' : 'Avaliação rejeitada');
      queryClient.invalidateQueries({ queryKey: ['reviews-admin'] });
    } catch {
      toast.error('Erro ao actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await authFetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      toast.success('Avaliação eliminada');
      queryClient.invalidateQueries({ queryKey: ['reviews-admin'] });
    } catch {
      toast.error('Erro ao eliminar');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.productId || !addForm.customerName.trim()) {
      toast.error('Seleccione um produto e digite o nome do cliente');
      return;
    }
    setSubmitting(true);
    try {
      const res = await authFetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addForm, approved: true }),
      });
      if (res.ok) {
        toast.success('Avaliação adicionada');
        setAddForm({ productId: '', customerName: '', rating: 4, comment: '' });
        setShowAddForm(false);
        queryClient.invalidateQueries({ queryKey: ['reviews-admin'] });
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Erro ao adicionar');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews?.filter((r) =>
    !search || r.customerName.toLowerCase().includes(search.toLowerCase()) || r.Product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Avaliações</h2>
          {pendingCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium animate-pulse">
              {pendingCount} pendente(s)
            </span>
          )}
        </div>
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
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-zeny-green hover:bg-zeny-green-dark text-white whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'approved'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-zeny-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'Todas' : s === 'pending' ? 'Pendentes' : 'Aprovadas'}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAddForm && (
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Adicionar Avaliação / Testemunho</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Label className="text-xs">Produto</Label>
                  <select
                    value={addForm.productId}
                    onChange={(e) => setAddForm({ ...addForm, productId: e.target.value })}
                    className="mt-1 h-9 w-full text-xs border border-gray-200 rounded-lg px-2 bg-white focus:outline-none focus:ring-2 focus:ring-zeny-green/30"
                    required
                  >
                    <option value="">Seleccionar produto...</option>
                    {products?.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <Label className="text-xs">Nome do Cliente</Label>
                  <Input
                    value={addForm.customerName}
                    onChange={(e) => setAddForm({ ...addForm, customerName: e.target.value })}
                    placeholder="Maria Silva"
                    className="mt-1 h-9 text-xs"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Label className="text-xs">Classificação</Label>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setAddForm({ ...addForm, rating: s })}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${s <= addForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs">Comentário</Label>
                <Textarea
                  value={addForm.comment}
                  onChange={(e) => setAddForm({ ...addForm, comment: e.target.value })}
                  placeholder="O que achou do produto?"
                  className="mt-1 min-h-[60px] text-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="text-xs h-8">Cancelar</Button>
                <Button type="submit" disabled={submitting} className="text-xs h-8 bg-zeny-green hover:bg-zeny-green-dark text-white">
                  {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Adicionar (aprovada)'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>Nenhuma avaliação encontrada</p>
            </div>
          )}
          {filteredReviews?.map((review) => (
            <Card key={review.id} className={`border-0 shadow-sm ${!review.approved ? 'border-l-4 border-l-amber-400' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{review.customerName}</span>
                      <Badge variant={review.approved ? 'default' : 'secondary'} className={`text-[10px] ${review.approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {review.approved ? 'Aprovada' : 'Pendente'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <StarDisplay rating={review.rating} />
                      <span className="text-[10px] text-gray-400">{timeAgo(review.createdAt)}</span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">
                      Produto: {review.Product?.name || review.productId.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove(review.id, true)}
                        className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center"
                        title="Aprovar"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                      </button>
                    )}
                    {review.approved && (
                      <button
                        onClick={() => handleApprove(review.id, false)}
                        className="w-8 h-8 rounded-lg hover:bg-amber-50 flex items-center justify-center"
                        title="Rejeitar"
                      >
                        <X className="w-4 h-4 text-amber-500" />
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDeleteId(review.id)}
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Eliminar Avaliação"
        message="Tem certeza que deseja eliminar esta avaliação? Esta acção não pode ser desfeita."
        confirmLabel="Eliminar"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}