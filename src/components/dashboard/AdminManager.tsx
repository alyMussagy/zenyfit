'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Trash2, Shield, Key, UserCheck, UserX, Pencil, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';
import { authFetch } from '@/lib/auth-fetch';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function AdminManager() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', accessCode: '', role: 'admin' });
  const [loading, setLoading] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [editForm, setEditForm] = useState({ name: '', role: 'admin', accessCode: '' });
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const currentAdmin = useAuthStore((s) => s.admin);

  const { data: admins, isLoading } = useQuery<Admin[]>({
    queryKey: ['admins'],
    queryFn: () => authFetch('/api/admins').then((r) => r.json()),
  });

  const isOwner = currentAdmin?.role === 'owner';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name || !form.accessCode) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch('/api/admins', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('Administrador adicionado');
        setForm({ email: '', name: '', accessCode: '', role: 'admin' });
        setShowForm(false);
        queryClient.invalidateQueries({ queryKey: ['admins'] });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Erro ao adicionar');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (admin: Admin) => {
    try {
      await authFetch(`/api/admins/${admin.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !admin.active }),
      });
      toast.success(admin.active ? 'Administrador desactivado' : 'Administrador activado');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    } catch {
      toast.error('Erro ao actualizar');
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setSaving(true);
    try {
      const updatePayload: Record<string, string> = {};
      if (editForm.name !== editingAdmin.name) updatePayload.name = editForm.name;
      if (editForm.role !== editingAdmin.role) updatePayload.role = editForm.role;
      if (editForm.accessCode) updatePayload.accessCode = editForm.accessCode;

      if (Object.keys(updatePayload).length === 0) {
        toast.info('Nenhuma alteração');
        setEditingAdmin(null);
        return;
      }

      const res = await authFetch(`/api/admins/${editingAdmin.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        toast.success('Administrador actualizado');
        setEditingAdmin(null);
        queryClient.invalidateQueries({ queryKey: ['admins'] });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Erro ao actualizar');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminar este administrador?')) return;
    try {
      await authFetch(`/api/admins/${id}`, { method: 'DELETE' });
      toast.success('Administrador eliminado');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    } catch {
      toast.error('Erro ao eliminar');
    }
  };

  const openEdit = (admin: Admin) => {
    setEditForm({ name: admin.name, role: admin.role, accessCode: '' });
    setEditingAdmin(admin);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestão de Acessos</h2>
          <p className="text-sm text-gray-500 mt-0.5">Controlar quem pode aceder ao painel</p>
        </div>
        {isOwner && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-zeny-green hover:bg-zeny-green-dark text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Admin
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showForm && isOwner && (
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="flex-1"
                type="email"
                required
              />
              <Input
                placeholder="Nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="sm:w-40"
                required
              />
              <Input
                placeholder="Código de acesso"
                type="text"
                value={form.accessCode}
                onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
                className="sm:w-36"
                required
                maxLength={10}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="bg-zeny-green hover:bg-zeny-green-dark text-white">
                  {loading ? 'A guardar...' : 'Adicionar'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {editingAdmin && (
        <Card className="border-0 shadow-sm mb-6 border-l-4 border-l-zeny-green">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Editar Administrador</h3>
              <button onClick={() => setEditingAdmin(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">{editingAdmin.email}</p>
            <form onSubmit={handleEditSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Nome</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Função</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zeny-green/30"
                  >
                    <option value="admin">Admin</option>
                    <option value="owner">Dono</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Novo Código de Acesso</label>
                  <Input
                    value={editForm.accessCode}
                    onChange={(e) => setEditForm({ ...editForm, accessCode: e.target.value })}
                    placeholder="Deixe vazio para manter"
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingAdmin(null)}>Cancelar</Button>
                <Button type="submit" disabled={saving} size="sm" className="bg-zeny-green hover:bg-zeny-green-dark text-white">
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {saving ? 'A guardar...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admin List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Admin</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Função</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Acções</th>
                  </tr>
                </thead>
                <tbody>
                  {admins?.map((admin) => (
                    <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zeny-green/10 flex items-center justify-center">
                            <Shield className={`w-4 h-4 ${admin.active ? 'text-zeny-green' : 'text-gray-300'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{admin.name}</p>
                            <p className="text-xs text-gray-400">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          admin.role === 'owner' ? 'bg-zeny-green/10 text-zeny-green-dark' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {admin.role === 'owner' ? 'Dono' : 'Admin'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                          admin.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {admin.active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          {admin.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {isOwner && admin.role !== 'owner' && (
                            <>
                              <button
                                onClick={() => openEdit(admin)}
                                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                onClick={() => handleToggle(admin)}
                                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                                title={admin.active ? 'Desactivar' : 'Activar'}
                              >
                                <Key className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                onClick={() => handleDelete(admin.id)}
                                className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {admins?.map((admin) => (
                <div key={admin.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zeny-green/10 flex items-center justify-center flex-shrink-0">
                      <Shield className={`w-5 h-5 ${admin.active ? 'text-zeny-green' : 'text-gray-300'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{admin.name}</p>
                      <p className="text-xs text-gray-400 truncate">{admin.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          admin.role === 'owner' ? 'bg-zeny-green/10 text-zeny-green-dark' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {admin.role === 'owner' ? 'Dono' : 'Admin'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          admin.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {admin.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    {isOwner && admin.role !== 'owner' && (
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(admin)} className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <Pencil className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => handleToggle(admin)} className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                          <Key className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => handleDelete(admin.id)} className="w-9 h-9 rounded-lg hover:bg-red-50 flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}