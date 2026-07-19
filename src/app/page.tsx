'use client';

import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import Navbar from '@/components/storefront/Navbar';
import HeroSection from '@/components/storefront/HeroSection';
import ProductCatalog from '@/components/storefront/ProductCatalog';
import AboutSection from '@/components/storefront/AboutSection';
import Footer from '@/components/storefront/Footer';
import Dashboard from '@/components/dashboard/Dashboard';
import LoginScreen from '@/components/dashboard/LoginScreen';
import FloatingButtons from '@/components/storefront/WhatsAppButton';
import OfferPopup from '@/components/storefront/OfferPopup';

function StoreView() {
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

  if (!isAuthenticated) {
    return <LoginScreen onSuccess={() => {}} />;
  }

  return <Dashboard />;
}

export default function Home() {
  const { view } = useAppStore();

  return (
    <>
      {view === 'store' ? (
        <>
          <Navbar />
          <StoreView />
        </>
      ) : (
        <DashboardView />
      )}
    </>
  );
}