'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Sparkles, Shield, Lightbulb, Truck } from 'lucide-react';

const BANNER_URL = 'https://ldipatlofnuzeglzuexj.supabase.co/storage/v1/object/public/images/ChatGPT_Image_6_07_2026,_11_53_29.png_2K_202607071119.jpeg';

export default function HeroSection() {
  const features = [
    { icon: Leaf, label: 'Produtos Naturais' },
    { icon: Sparkles, label: 'Métodos Eficazes' },
    { icon: Heart, label: 'Resultados Reais' },
    { icon: Lightbulb, label: 'Dicas e Conteúdos' },
    { icon: Shield, label: 'Pedidos com Segurança' },
  ];

  return (
    <section id="hero" className="relative min-h-[85dvh] sm:min-h-[100dvh] flex flex-col justify-end overflow-hidden">
      {/* Full-bleed banner background */}
      <div className="absolute inset-0 z-0">
        <img
          src={BANNER_URL}
          alt="ZenyFit"
          className="w-full h-full object-cover object-top sm:object-center"
        />
        {/* Gradient overlay — stronger on mobile for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-zeny-green-dark/95 via-zeny-green-dark/70 sm:via-zeny-green-dark/40 to-zeny-green-dark/40 sm:to-zeny-green-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 sm:from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 sm:pt-32 pb-0">
        <div className="max-w-2xl">
          {/* Logo Mark */}
          <motion.div
            className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0">
              <svg viewBox="0 0 60 60" className="w-7 h-7 sm:w-9 sm:h-9" fill="none">
                <circle cx="30" cy="30" r="28" stroke="white" strokeWidth="2" />
                <text x="30" y="38" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold" fontFamily="sans-serif">Z</text>
                <path d="M40 18 C48 24, 50 32, 44 42 C38 34, 34 26, 40 18Z" fill="#6FD63A" />
                <circle cx="16" cy="20" r="2" fill="#6FD63A" />
                <circle cx="12" cy="26" r="1.5" fill="white" />
                <circle cx="18" cy="28" r="1" fill="#6FD63A" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Zeny<span className="text-zeny-green-light">Fit</span>
              </h1>
              <p className="text-xs sm:text-base font-medium text-white/70 tracking-wider uppercase mt-0.5">
                Saúde, Equilíbrio e Autoestima
              </p>
            </div>
          </motion.div>

          <motion.p
            className="text-sm sm:text-lg text-white/90 sm:text-white/80 leading-relaxed max-w-lg mb-4 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
          >
            Mais saúde, equilíbrio e autoestima para uma vida leve e plena. Produtos seleccionados para cuidar da sua pele, corpo e bem-estar.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-2.5 sm:gap-4 mb-4 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <a href="#produtos">
              <motion.button
                className="px-5 sm:px-8 py-2.5 sm:py-3 bg-zeny-green text-white rounded-full font-medium shadow-lg shadow-zeny-green/30 text-sm sm:text-base"
                whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(56, 184, 2, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                Ver Produtos
              </motion.button>
            </a>
            <a href="#sobre">
              <motion.button
                className="px-5 sm:px-8 py-2.5 sm:py-3 border-2 border-white/30 text-white rounded-full font-medium text-sm sm:text-base backdrop-blur-sm hover:bg-white/10 transition-colors duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                Sobre Nós
              </motion.button>
            </a>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            className="flex items-center gap-4 sm:gap-6 text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zeny-green-light" />
              <span className="text-[11px] sm:text-sm">Entrega para todo o país</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Shield className="w-4 h-4 text-zeny-green-light" />
              <span>Pagamento na entrega</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Bar */}
      <motion.div
        className="relative mt-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="bg-zeny-green">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-3 sm:gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.08 }}
                >
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 flex items-center justify-center"
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.25)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                  <span className="text-[10px] sm:text-sm font-medium text-white text-center leading-tight">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}