'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

export default function StoreHydrator() {
  const hydrateCart = useCartStore((s) => s.hydrate);
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    hydrateCart();
    checkSession();
  }, [hydrateCart, checkSession]);

  return null;
}