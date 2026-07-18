'use client';

import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Eye,
  EyeOff,
  X,
  GripVertical,
  Clock,
  Sparkles,
  Check,
  Flame,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { authFetch } from '@/lib/auth-fetch';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

interface Popup {
  id: string;
  title: string;
  subtitle: string;
  benefits: string[];
  stockAlert: string;
  ctaText: string;
  ctaLink: string;
  footerText: string;
  urgencyLabel: string;
  cooldownHours: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PopupFormData {
  title: string;
  subtitle: string;
  benefits: string[];
  stockAlert: string;
  ctaText: string;
  ctaLink: string;
  footerText: string;
  urgencyLabel: string;
  cooldownHours: number;
  active: boolean;
}

const emptyForm: PopupFormData = {
  title: '',
  subtitle: '',
  benefits: [''],
  stockAlert: '',
  ctaText: 'VER OFERTAS',
  ctaLink: '#produtos',
  footerText: 'Entrega em Maputo e Matola',
  urgencyLabel: 'Oferta por tempo limitado',
  cooldownHours: 12,
  active: true,
};

export default function PopupManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PopupFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: popups = [], isLoading } = useQuery<Popup[]>({
    queryKey: ['popups-admin'],
    queryFn: () => authFetch('/api/popups').then((r) => r.json()),
  });

  const activePopup = popups.find((p) => p.active);

  // ─── Form helpers ───
  const updateField = (field: keyof PopupFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateBenefit = (index: number, value: string) => {
    setForm((prev) => {
      const benefits = [...prev.benefits];
      benefits[index] = value;
      return { ...prev, benefits };
    });
  };

  const addBenefit = () => {
    setForm((prev) => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const removeBenefit = (index: number) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  // ─── CRUD ───
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (popup: Popup) => {
    setEditingId(popup.id);
    setForm({
      title: popup.title,
      subtitle: popup.subtitle,
      benefits: popup.benefits?.length ? popup.benefits : [''],
      stockAlert: popup.stockAlert,
      ctaText: popup.ctaText,
      ctaLink: popup.ctaLink,
      footerText: popup.footerText,
      urgencyLabel: popup.urgencyLabel,
      cooldownHours: popup.cooldownHours,
      active: popup.active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Preencha o título do popup');
      return;
    }

    setSaving(true);
    try {
      const benefits = form.benefits.filter((b) => b.trim());

      if (editingId) {
        await authFetch(`/api/popups/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...form, benefits }),
        });
        toast.success('Popup actualizado com sucesso!');
      } else {
        await authFetch('/api/popups', {
          method: 'POST',
          body: JSON.stringify({ ...form, benefits }),
        });
        toast.success('Popup criado com sucesso!');
      }

      queryClient.invalidateQueries({ queryKey: ['popups-admin'] });
      setDialogOpen(false);
    } catch {
      toast.error('Erro ao salvar popup');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (popup: Popup) => {
    try {
      await authFetch(`/api/popups/${popup.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !popup.active }),
      });
      queryClient.invalidateQueries({ queryKey: ['popups-admin'] });
      toast.success(popup.active ? 'Popup desactivado' : 'Popup activado');
    } catch {
      toast.error('Erro ao alterar estado');
    }
  };

  const deletePopup = async (id: string) => {
    setDeletingId(id);
    try {
      await authFetch(`/api/popups/${id}`, { method: 'DELETE' });
      queryClient.invalidateQueries({ queryKey: ['popups-admin'] });
      toast.success('Popup eliminado');
    } catch {
      toast.error('Erro ao eliminar popup');
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Preview data ───
  const previewData: Popup | null = previewOpen
    ? {
        id: 'preview',
        title: form.title || 'Título do Popup',
        subtitle: form.subtitle || 'Subtítulo descritivo da oferta',
        benefits: form.benefits.filter((b) => b.trim()),
        stockAlert: form.stockAlert || 'Mensagem de alerta de stock',
        ctaText: form.ctaText || 'VER OFERTAS',
        ctaLink: form.ctaLink || '#produtos',
        footerText: form.footerText || 'Texto do rodapé',
        urgencyLabel: form.urgencyLabel || 'Oferta por tempo limitado',
        cooldownHours: form.cooldownHours,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    : null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Popups de Ofertas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gerir popups promocionais que aparecem na loja. Só 1 popup activo por vez.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setPreviewOpen(true); }} disabled={!form.title && popups.length === 0}>
            <Eye className="w-4 h-4 mr-1.5" />
            Pré-visualizar
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Novo Popup
          </Button>
        </div>
      </div>

      {/* Active indicator */}
      {activePopup && (
        <div className="bg-zeny-green/5 border border-zeny-green/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-zeny-green animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-medium text-zeny-green-dark">
              Popup activo: &quot;{activePopup.title}&quot;
            </p>
            <p className="text-xs text-gray-500">
              Mostra {activePopup.cooldownHours}h após o cliente fechar
            </p>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : popups.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">Nenhum popup criado ainda</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Criar primeiro popup
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {popups.map((popup) => (
            <motion.div
              key={popup.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`bg-white rounded-xl border p-5 transition-all ${
                popup.active
                  ? 'border-zeny-green/30 shadow-md shadow-zeny-green/5'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {popup.active && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-zeny-green bg-zeny-green/10 px-2 py-0.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-zeny-green" />
                        Activo
                      </span>
                    )}
                    {!popup.active && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        <EyeOff className="w-3 h-3" />
                        Inactivo
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(popup.createdAt).toLocaleDateString('pt-MZ')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{popup.title}</h3>
                  {popup.subtitle && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{popup.subtitle}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {popup.cooldownHours}h cooldown
                    </span>
                    <span>{popup.benefits?.length || 0} benefícios</span>
                    <span>CTA: {popup.ctaText}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleActive(popup)}
                    title={popup.active ? 'Desactivar' : 'Activar'}
                  >
                    {popup.active ? (
                      <Power className="w-4 h-4 text-zeny-green" />
                    ) : (
                      <PowerOff className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setForm({
                        title: popup.title,
                        subtitle: popup.subtitle,
                        benefits: popup.benefits?.length ? popup.benefits : [''],
                        stockAlert: popup.stockAlert,
                        ctaText: popup.ctaText,
                        ctaLink: popup.ctaLink,
                        footerText: popup.footerText,
                        urgencyLabel: popup.urgencyLabel,
                        cooldownHours: popup.cooldownHours,
                        active: popup.active,
                      });
                      setPreviewOpen(true);
                    }}
                    title="Pré-visualizar"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(popup)}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-red-500"
                    onClick={() => deletePopup(popup.id)}
                    disabled={deletingId === popup.id}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Create/Edit Dialog ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Popup' : 'Novo Popup de Oferta'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Active toggle */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <Label className="text-sm font-medium">Popup activo</Label>
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => updateField('active', checked)}
              />
            </div>

            {/* Title */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Título *</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Ex: Oferta Especial por Tempo Limitado!"
                className="font-semibold"
              />
            </div>

            {/* Subtitle */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Subtítulo</Label>
              <Textarea
                value={form.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="Ex: Produtos seleccionados com até 30% de desconto."
                rows={2}
              />
            </div>

            {/* Urgency label */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Texto de urgência (barra de cima)</Label>
              <Input
                value={form.urgencyLabel}
                onChange={(e) => updateField('urgencyLabel', e.target.value)}
                placeholder="Ex: Oferta por tempo limitado"
              />
            </div>

            {/* Benefits */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Benefícios / Pontos de venda</Label>
              <div className="space-y-2">
                {form.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(i, e.target.value)}
                      placeholder={`Benefício ${i + 1}`}
                      className="flex-1"
                    />
                    {form.benefits.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0 hover:text-red-500"
                        onClick={() => removeBenefit(i)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                  className="w-full border-dashed"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Adicionar benefício
                </Button>
              </div>
            </div>

            {/* Stock Alert */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Alerta de stock (caixa laranja)</Label>
              <Input
                value={form.stockAlert}
                onChange={(e) => updateField('stockAlert', e.target.value)}
                placeholder="Ex: Várias opções já estão quase esgotadas"
              />
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Texto do botão</Label>
                <Input
                  value={form.ctaText}
                  onChange={(e) => updateField('ctaText', e.target.value)}
                  placeholder="VER OFERTAS"
                  className="uppercase"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Link do botão</Label>
                <Input
                  value={form.ctaLink}
                  onChange={(e) => updateField('ctaLink', e.target.value)}
                  placeholder="#produtos ou /produto/id"
                />
              </div>
            </div>

            {/* Footer text */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Texto do rodapé</Label>
              <Input
                value={form.footerText}
                onChange={(e) => updateField('footerText', e.target.value)}
                placeholder="Ex: Entrega em Maputo e Matola"
              />
            </div>

            {/* Cooldown */}
            <div>
              <Label className="text-sm font-medium mb-1.5 block">
                Cooldown (horas até mostrar novamente)
              </Label>
              <Input
                type="number"
                min={0}
                step={1}
                value={form.cooldownHours}
                onChange={(e) => updateField('cooldownHours', parseFloat(e.target.value) || 0)}
                className="w-32"
              />
              <p className="text-xs text-gray-400 mt-1">
                0 = mostra sempre que a página carrega
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-zeny-green hover:bg-zeny-green-dark"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    A guardar...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    {editingId ? 'Guardar' : 'Criar Popup'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Preview Dialog ─── */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden border-0">
          <PopupPreviewComponent popup={previewData} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Standalone preview component (replica do storefront popup) ───
function PopupPreviewComponent({ popup }: { popup: Popup | null }) {
  if (!popup) return null;

  return (
    <div className="relative bg-white rounded-2xl sm:rounded-3xl w-full shadow-2xl overflow-hidden">
      {/* Urgency banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-5 py-2.5 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 text-white/90" />
        <span className="text-sm font-semibold text-white tracking-wide">
          {popup.urgencyLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-7">
        {/* Title */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Promoção
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            {popup.title}
          </h2>
        </div>

        {/* Subtitle */}
        {popup.subtitle && (
          <p className="text-sm text-gray-600 text-center mb-5 leading-relaxed">
            {popup.subtitle}
          </p>
        )}

        {/* Benefits */}
        {popup.benefits?.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
              Por que escolher a ZenyFit:
            </p>
            <ul className="space-y-2">
              {popup.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-zeny-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-zeny-green" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700 leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stock alert */}
        {popup.stockAlert && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2.5 mb-5">
            <Flame className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-orange-800">{popup.stockAlert}</p>
          </div>
        )}

        {/* CTA Button */}
        <button className="w-full bg-zeny-green hover:bg-zeny-green-dark text-white rounded-full py-4 text-base font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-zeny-green/25 cursor-default">
          {popup.ctaText}
          <span className="text-lg">&rarr;</span>
        </button>

        {/* Footer */}
        {popup.footerText && (
          <p className="text-center text-xs text-gray-400 mt-3">
            {popup.footerText}
          </p>
        )}
      </div>
    </div>
  );
}