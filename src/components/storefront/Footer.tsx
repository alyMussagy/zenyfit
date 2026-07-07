'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { ZENYFIT_CONFIG } from '@/lib/zenyfit-config';
import ScrollReveal, { StaggerContainer, StaggerItem } from './ScrollReveal';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-zeny-green-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10" staggerDelay={0.12}>
          {/* Brand */}
          <StaggerItem variant="fadeUp">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <svg viewBox="0 0 60 60" className="w-6 h-6" fill="none">
                    <text x="30" y="38" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="sans-serif">Z</text>
                  </svg>
                </motion.div>
                <span className="text-xl font-bold tracking-tight">Zeny<span className="text-zeny-green-light">Fit</span></span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Saúde, Equilíbrio e Autoestima. Produtos seleccionados para cuidar de si, entregues em todo Moçambique.
              </p>
            </div>
          </StaggerItem>

          {/* Links */}
          <StaggerItem variant="fadeUp">
            <div>
              <h4 className="font-semibold mb-4 text-zeny-green-light">Navegação</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Início', href: '#hero' },
                  { label: 'Produtos', href: '#produtos' },
                  { label: 'Sobre Nós', href: '#sobre' },
                  { label: 'Contacto', href: '#contacto' },
                ].map((link, i) => (
                  <li key={link.href}>
                    <motion.a
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200 inline-block"
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      viewport={{ once: true }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          {/* Categories */}
          <StaggerItem variant="fadeUp">
            <div>
              <h4 className="font-semibold mb-4 text-zeny-green-light">Categorias</h4>
              <ul className="space-y-2">
                {['Skincare', 'Cuidados Corporais', 'Suplementos', 'Aromaterapia', 'Cabelo'].map((cat, i) => (
                  <li key={cat}>
                    <motion.span
                      className="text-sm text-white/60 inline-block cursor-default hover:text-white/80 transition-colors duration-200"
                      whileHover={{ x: 4 }}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      viewport={{ once: true }}
                    >
                      {cat}
                    </motion.span>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          {/* Contact */}
          <StaggerItem variant="fadeUp">
            <div>
              <h4 className="font-semibold mb-4 text-zeny-green-light">Contacto</h4>
              <ul className="space-y-3">
                {[
                  { icon: Phone, text: ZENYFIT_CONFIG.contact.phone },
                  { icon: MessageCircle, text: 'WhatsApp disponível' },
                  { icon: Mail, text: ZENYFIT_CONFIG.contact.email },
                  { icon: MapPin, text: ZENYFIT_CONFIG.contact.address },
                  { icon: Clock, text: ZENYFIT_CONFIG.hours },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    viewport={{ once: true }}
                  >
                    <item.icon className="w-4 h-4 text-zeny-green-light flex-shrink-0" />
                    <span className="text-sm text-white/60">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Bottom Bar */}
      <ScrollReveal variant="fade" delay={0.2}>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
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
      </ScrollReveal>
    </footer>
  );
}