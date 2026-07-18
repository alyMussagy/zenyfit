'use client';

import { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, Leaf } from 'lucide-react';

interface LoginScreenProps {
  onSuccess: () => void;
}

export default function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accessCode }),
      });

      const data = await res.json();

      if (res.ok) {
        // Import here to avoid circular dependency
        const { useAuthStore } = await import('@/store/auth-store');
        useAuthStore.getState().login(data);
        onSuccess();
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zeny-cream flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-zeny-green/5 blur-2xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-zeny-green/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://ldipatlofnuzeglzuexj.supabase.co/storage/v1/object/public/images/logo%20sem%20fundo.webp"
            alt="ZenyFit"
            className="h-16 w-auto mx-auto mb-4"
          />
          <p className="text-sm text-zeny-green-dark/50 mt-1">Painel de Controlo</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-zeny-green/5 p-8">
          <h2 className="text-lg font-bold text-zeny-green-dark mb-1">Entrar</h2>
          <p className="text-sm text-zeny-green-dark/50 mb-6">
            Insira o seu email e código de acesso
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zeny-green-dark mb-1.5 block">
                Email ou Telefone
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zeny-green-dark/30" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zeny-green/20 text-sm text-zeny-green-dark placeholder:text-zeny-green-dark/30 focus:outline-none focus:ring-2 focus:ring-zeny-green/30 focus:border-zeny-green/50 transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zeny-green-dark mb-1.5 block">
                Código de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zeny-green-dark/30" />
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zeny-green/20 text-sm text-zeny-green-dark placeholder:text-zeny-green-dark/30 focus:outline-none focus:ring-2 focus:ring-zeny-green/30 focus:border-zeny-green/50 transition-all"
                  required
                  maxLength={10}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-zeny-green hover:bg-zeny-green-dark text-white rounded-xl font-medium transition-all shadow-lg shadow-zeny-green/20 hover:shadow-xl hover:shadow-zeny-green/30 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zeny-green-dark/30 mt-6">
          Acesso restrito à equipa ZenyFit
        </p>
      </div>
    </div>
  );
}