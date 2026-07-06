'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import Navbar from '@/components/storefront/Navbar';
import HeroSection from '@/components/storefront/HeroSection';
import ProductCatalog from '@/components/storefront/ProductCatalog';
import AboutSection from '@/components/storefront/AboutSection';
import Footer from '@/components/storefront/Footer';
import Dashboard from '@/components/dashboard/Dashboard';
import WhatsAppButton from '@/components/storefront/WhatsAppButton';

function StoreView() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        <HeroSection />
        <ProductCatalog />
        <AboutSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
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
      <Navbar />
      {view === 'store' ? <StoreView /> : <Dashboard />}
    </QueryClientProvider>
  );
}