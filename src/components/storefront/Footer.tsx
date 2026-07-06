'use client';

import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { ZENYFIT_CONFIG } from '@/lib/zenyfit-config';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-zeny-green-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 60 60" className="w-6 h-6" fill="none">
                  <text x="30" y="38" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="sans-serif">Z</text>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">Zeny<span className="text-zeny-green-light">Fit</span></span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Saúde, Equilíbrio e Autoestima. Produtos seleccionados para cuidar de si, entregues em todo Moçambique.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-zeny-green-light">Navegação</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-sm text-white/60 hover:text-white transition-colors">Início</a></li>
              <li><a href="#produtos" className="text-sm text-white/60 hover:text-white transition-colors">Produtos</a></li>
              <li><a href="#sobre" className="text-sm text-white/60 hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#contacto" className="text-sm text-white/60 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-zeny-green-light">Categorias</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-white/60">Skincare</span></li>
              <li><span className="text-sm text-white/60">Cuidados Corporais</span></li>
              <li><span className="text-sm text-white/60">Suplementos</span></li>
              <li><span className="text-sm text-white/60">Aromaterapia</span></li>
              <li><span className="text-sm text-white/60">Cabelo</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-zeny-green-light">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-zeny-green-light flex-shrink-0" />
                <span className="text-sm text-white/60">{ZENYFIT_CONFIG.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-zeny-green-light flex-shrink-0" />
                <span className="text-sm text-white/60">WhatsApp disponível</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-zeny-green-light flex-shrink-0" />
                <span className="text-sm text-white/60">{ZENYFIT_CONFIG.contact.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-zeny-green-light flex-shrink-0" />
                <span className="text-sm text-white/60">{ZENYFIT_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-zeny-green-light flex-shrink-0" />
                <span className="text-sm text-white/60">{ZENYFIT_CONFIG.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} ZenyFit. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">Pagamento na entrega</span>
            <span className="text-white/20">|</span>
            <span className="text-xs text-white/30">Entregas para todo Moçambique</span>
          </div>
        </div>
      </div>
    </footer>
  );
}