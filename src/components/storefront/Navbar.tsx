'use client';

import { useState } from 'react';
import { ShoppingCart, LayoutDashboard, Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/store/cart-store';
import { useAppStore } from '@/store/app-store';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { view, setView } = useAppStore();

  const navLinks = [
    { label: 'Início', href: '#hero' },
    { label: 'Produtos', href: '#produtos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zeny-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('store')}>
            <div className="w-9 h-9 rounded-full bg-zeny-green/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-zeny-green-dark" />
            </div>
            <span className="text-xl font-bold text-zeny-green-dark tracking-tight">Zeny<span className="text-zeny-green">Fit</span></span>
          </div>

          {/* Desktop Nav */}
          {view === 'store' && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-zeny-green-dark/70 hover:text-zeny-green-dark transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {view === 'store' && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-zeny-green-dark hover:bg-zeny-green/10">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-zeny-green text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center p-0">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md p-0">
                  <SheetTitle className="sr-only">Carrinho de Compras</SheetTitle>
                  <CartDrawer />
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant={view === 'dashboard' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setView(view === 'dashboard' ? 'store' : 'dashboard')}
              className="text-zeny-green-dark hover:bg-zeny-green/10"
              title={view === 'dashboard' ? 'Voltar à loja' : 'Painel de Controlo'}
            >
              <LayoutDashboard className="w-5 h-5" />
            </Button>

            {/* Mobile Menu */}
            {view === 'store' && (
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="text-zeny-green-dark">
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {view === 'store' && mobileOpen && (
        <div className="md:hidden bg-white border-t border-zeny-green/10 animate-fade-in-up">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-zeny-green-dark/70 hover:text-zeny-green-dark"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}