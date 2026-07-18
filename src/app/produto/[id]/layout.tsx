import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import FloatingButtons from '@/components/storefront/WhatsAppButton';

export default function ProdutoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}