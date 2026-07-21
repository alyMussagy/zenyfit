'use client';

import { useState, useEffect } from 'react';
import { Star, Send, Loader2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewData {
  reviews: Review[];
  average: number;
  count: number;
}

function StarRating({ rating, size = 'sm', interactive = false, onChange }: { rating: number; size?: 'sm' | 'md' | 'lg'; interactive?: boolean; onChange?: (r: number) => void }) {
  const sizeClass = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(s)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`${sizeClass} ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  if (diff < 2592000) return `há ${Math.floor(diff / 86400)}d`;
  return date.toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' });
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', rating: 0, comment: '' });

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { toast.error('Seleccione uma classificação'); return; }
    if (!form.customerName.trim()) { toast.error('Digite o seu nome'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerName: form.customerName.trim(),
          rating: form.rating,
          comment: form.comment.trim(),
        }),
      });
      if (res.ok) {
        toast.success('Avaliação enviada! Será visível após aprovação.');
        setForm({ customerName: '', rating: 0, comment: '' });
        setShowForm(false);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Erro ao enviar avaliação');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-100 rounded w-48" />
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="h-16 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data?.reviews.filter((r) => r.rating === star).length || 0,
    pct: data?.count ? Math.round(((data?.reviews.filter((r) => r.rating === star).length || 0) / data!.count) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header + Stats */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-gray-900">{data?.average || '0.0'}</span>
          <div>
            <StarRating rating={Math.round(data?.average || 0)} size="md" />
            <p className="text-xs text-gray-400 mt-1">{data?.count || 0} avaliação(ões)</p>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3 text-right">{d.star}</span>
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.pct}%` }}
                  transition={{ duration: 0.6, delay: d.star * 0.05 }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
              <span className="text-xs text-gray-400 w-6">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      {data?.reviews && data.reviews.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {data.reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-zeny-green/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-zeny-green-dark">{review.customerName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{review.customerName}</p>
                      <p className="text-[10px] text-gray-400">{timeAgo(review.createdAt)}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed mt-2 ml-10">{review.comment}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Nenhuma avaliação ainda. Seja o primeiro!</p>
        </div>
      )}

      {/* Write review button / form */}
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          className="w-full rounded-xl border-zeny-green/20 text-zeny-green-dark hover:bg-zeny-green/5"
        >
          <Star className="w-4 h-4 mr-2" />
          Escrever Avaliação
        </Button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-50 rounded-xl p-4 space-y-3"
        >
          <p className="text-sm font-medium text-gray-900">A sua avaliação</p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Classificação:</span>
            <StarRating rating={form.rating} size="lg" interactive onChange={(r) => setForm({ ...form, rating: r })} />
          </div>

          <Input
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            placeholder="O seu nome"
            className="rounded-lg"
            required
          />

          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="O que achou do produto? (opcional)"
            className="w-full min-h-[70px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zeny-green/30 resize-none"
          />

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-lg">Cancelar</Button>
            <Button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-zeny-green hover:bg-zeny-green-dark text-white">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-1" />Enviar</>}
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 text-center">A avaliação será visível após aprovação</p>
        </motion.form>
      )}
    </div>
  );
}

// Export for use in ProductCatalog (mini version)
export function MiniStarRating({ productId }: { productId: string }) {
  const [data, setData] = useState<{ average: number; count: number } | null>(null);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((json) => setData({ average: json.average, count: json.count }))
      .catch(() => {});
  }, [productId]);

  if (!data || data.count === 0) return null;

  return (
    <div className="flex items-center gap-1">
      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
      <span className="text-[10px] text-gray-500 font-medium">{data.average}</span>
      <span className="text-[10px] text-gray-400">({data.count})</span>
    </div>
  );
}