'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Trash2, Shield, Key, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

      {/* Form */}
      {showForm && isOwner && (
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Email ou telefone"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="flex-1"
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
                          {admin.active ? (
                            <Shield className="w-4 h-4 text-zeny-green" />
                          ) : (
                            <Shield className="w-4 h-4 text-gray-300" />
                          )}
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
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}