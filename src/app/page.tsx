'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import Navbar from '@/components/storefront/Navbar';
import HeroSection from '@/components/storefront/HeroSection';
import ProductCatalog from '@/components/storefront/ProductCatalog';
import ProductDetail from '@/components/storefront/ProductDetail';
import AboutSection from '@/components/storefront/AboutSection';
import Footer from '@/components/storefront/Footer';
import Dashboard from '@/components/dashboard/Dashboard';
import LoginScreen from '@/components/dashboard/LoginScreen';
import FloatingButtons from '@/components/storefront/WhatsAppButton';
import OfferPopup from '@/components/storefront/OfferPopup';

function StoreView() {
  const selectedProductId = useAppStore((s) => s.selectedProductId);
  const setSelectedProductId = useAppStore((s) => s.setSelectedProductId);

  // Se tem produto seleccionado, mostrar página de detalhe
  if (selectedProductId) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-16">
          <ProductDetail
            productId={selectedProductId}
            onBack={() => setSelectedProductId(null)}
          />
        </main>
        <FloatingButtons />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        <HeroSection />
        <ProductCatalog />
        <AboutSection />
      </main>
      <Footer />
      <FloatingButtons />
      <OfferPopup />
    </div>
  );
}

function DashboardView() {
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

export default function Home() {
  const { view } = useAppStore();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30000, retry: 1 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {view === 'store' ? (
        <>
          <Navbar />
          <StoreView />
        </>
      ) : (
        <DashboardView />
      )}
    </QueryClientProvider>
  );
}