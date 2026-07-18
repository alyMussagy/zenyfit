'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Sparkles, Shield, Lightbulb, Truck } from 'lucide-react';

export default function HeroSection() {
  const features = [
    { icon: Leaf, label: 'Produtos Naturais' },
    { icon: Sparkles, label: 'Métodos Eficazes' },
    { icon: Heart, label: 'Resultados Reais' },
    { icon: Lightbulb, label: 'Dicas e Conteúdos' },
    { icon: Shield, label: 'Pedidos com Segurança' },
  ];

  return (
    <section id="hero" className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-zeny-cream">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Decorative circles with parallax feel */}
        <motion.div
          className="absolute top-20 right-10 w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-zeny-green/5 blur-2xl"
          animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 sm:bottom-40 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-zeny-green/8 blur-3xl"
          animate={{ y: [0, -10, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-40 left-10 w-24 sm:w-48 h-24 sm:h-48 rounded-full bg-zeny-green-light/5 blur-2xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* Leaf decorations */}
        <motion.svg
          className="absolute top-16 right-4 sm:right-8 w-12 sm:w-20 h-12 sm:h-20 text-zeny-green/20 leaf-decoration hidden sm:block"
          viewBox="0 0 100 100" fill="currentColor"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M50 10 C70 30, 90 50, 70 80 C50 60, 30 40, 50 10 Z" />
          <path d="M50 10 C50 30, 55 50, 70 80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
        </motion.svg>
        <motion.svg
          className="absolute bottom-32 left-2 sm:left-6 w-10 sm:w-16 h-10 sm:h-16 text-zeny-green/15 leaf-decoration hidden sm:block"
          viewBox="0 0 100 100" fill="currentColor"
          animate={{ rotate: [-3, 6, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <path d="M30 80 C50 60, 70 40, 60 15 C40 35, 20 55, 30 80 Z" />
          <path d="M30 80 C45 60, 55 40, 60 15" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
        </motion.svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Brand */}
          <div>
            {/* Logo Mark */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-zeny-green-card flex items-center justify-center">
                  <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
                    <circle cx="30" cy="30" r="28" stroke="#2E9802" strokeWidth="2" />
                    <text x="30" y="38" textAnchor="middle" fill="#2E9802" fontSize="26" fontWeight="bold" fontFamily="sans-serif">Z</text>
                    <path d="M40 18 C48 24, 50 32, 44 42 C38 34, 34 26, 40 18Z" fill="#38B802" />
                    <path d="M40 18 C44 24, 46 30, 44 42" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none" />
                    <circle cx="16" cy="20" r="2" fill="#38B802" />
                    <circle cx="12" cy="26" r="1.5" fill="#6FD63A" />
                    <circle cx="18" cy="28" r="1" fill="#38B802" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-zeny-green-dark tracking-tight">
                  Zeny<span className="text-zeny-green">Fit</span>
                </h1>
                <p className="text-sm sm:text-base font-medium text-zeny-green-dark tracking-wider uppercase mt-1">
                  Saúde, Equilíbrio e Autoestima
                </p>
              </div>
            </motion.div>

            <motion.p
              className="text-base sm:text-lg text-zeny-green-dark/70 leading-relaxed max-w-md mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
            >
              Mais saúde, equilíbrio e autoestima para uma vida leve e plena. Produtos seleccionados para cuidar da sua pele, corpo e bem-estar.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <a href="#produtos">
                <motion.button
                  className="px-6 sm:px-8 py-3 bg-zeny-green text-white rounded-full font-medium shadow-lg shadow-zeny-green/20 text-sm sm:text-base"
                  whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(56, 184, 2, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  Ver Produtos
                </motion.button>
              </a>
              <a href="#sobre">
                <motion.button
                  className="px-6 sm:px-8 py-3 border-2 border-zeny-green/30 text-zeny-green-dark rounded-full font-medium text-sm sm:text-base"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(56, 184, 2, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  Sobre Nós
                </motion.button>
              </a>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              className="flex items-center gap-6 text-sm text-zeny-green-dark/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zeny-green" />
                <span className="text-xs sm:text-sm">Entrega para todo o país</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="w-4 h-4 text-zeny-green" />
                <span>Pagamento na entrega</span>
              </div>
            </motion.div>
          </div>

          {/* Right - Banner Image */}
          <motion.div
            className="flex justify-center items-center relative order-first lg:order-last"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="relative w-full max-w-sm lg:max-w-md xl:max-w-lg">
              {/* Glow behind image */}
              <motion.div
                className="absolute inset-4 bg-zeny-green/15 rounded-3xl blur-2xl"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.img
                src="https://ldipatlofnuzeglzuexj.supabase.co/storage/v1/object/public/images/ChatGPT_Image_6_07_2026,_11_53_29.png_2K_202607071119.jpeg"
                alt="ZenyFit - Produtos de saúde, beleza e bem-estar"
                className="relative rounded-2xl lg:rounded-3xl shadow-2xl shadow-zeny-green/10 w-full object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              {/* Cursive text overlay */}
              <motion.div
                className="absolute -bottom-3 -right-2 sm:-right-6 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p className="text-sm sm:text-base text-zeny-green-dark/70 italic font-light whitespace-nowrap">
                  &ldquo;Você no seu melhor&rdquo;
                </p>
              </motion.div>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  className="flex flex-col items-center gap-2 group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.08 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center"
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.25)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <feature.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-[10px] sm:text-sm font-medium text-white text-center leading-tight">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Wave top border */}
          <div className="absolute -top-3 left-0 right-0">
            <svg viewBox="0 0 1440 20" fill="none" className="w-full">
              <path d="M0 20V8C240 0 480 16 720 12C960 8 1200 0 1440 8V20H0Z" fill="currentColor" className="text-zeny-cream" />
            </svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
}