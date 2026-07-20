'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import Dashboard from '@/components/dashboard/Dashboard';
import LoginScreen from '@/components/dashboard/LoginScreen';

export default function AdminPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={() => {}} />;
  }

  return <Dashboard />;
}