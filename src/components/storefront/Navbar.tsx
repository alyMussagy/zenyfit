'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, LayoutDashboard, Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart-store';
import { useAppStore } from '@/store/app-store';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { view, setView } = useAppStore();

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Produtos', href: '#produtos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Contacto', href: '#contacto' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled
          ? 'border-zeny-green/15 shadow-[0_4px_20px_rgba(56,184,2,0.08)]'
          : 'border-zeny-green/5'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('store')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-9 h-9 rounded-full bg-zeny-green/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-zeny-green-dark" />
            </div>
            <span className="text-xl font-bold text-zeny-green-dark tracking-tight">Zeny<span className="text-zeny-green">Fit</span></span>
          </motion.div>

          {/* Desktop Nav */}
          {view === 'store' && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-zeny-green-dark/70 hover:text-zeny-green-dark transition-colors duration-200 rounded-full"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(56, 184, 2, 0.06)' }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {view === 'store' && (
              <Sheet>
                <SheetTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" className="relative text-zeny-green-dark hover:bg-zeny-green/10">
                      <ShoppingCart className="w-5 h-5" />
                      <AnimatePresence>
                        {totalItems > 0 && (
                          <motion.span
                            key={totalItems}
                            className="absolute -top-1 -right-1 bg-zeny-green text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full p-0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          >
                            {totalItems}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md p-0">
                  <SheetTitle className="sr-only">Carrinho de Compras</SheetTitle>
                  <CartDrawer />
                </SheetContent>
              </Sheet>
            )}

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant={view === 'dashboard' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView(view === 'dashboard' ? 'store' : 'dashboard')}
                className="text-zeny-green-dark hover:bg-zeny-green/10"
                title={view === 'dashboard' ? 'Voltar à loja' : 'Painel de Controlo'}
              >
                <LayoutDashboard className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            {view === 'store' && (
              <div className="md:hidden">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-zeny-green-dark">
                    <AnimatePresence mode="wait">
                      {mobileOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Menu className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {view === 'store' && mobileOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-zeny-green/10 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="block py-2.5 px-3 text-sm font-medium text-zeny-green-dark/70 hover:text-zeny-green-dark hover:bg-zeny-green/5 rounded-lg transition-colors duration-150"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}