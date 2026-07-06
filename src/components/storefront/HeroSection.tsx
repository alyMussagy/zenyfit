'use client';

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
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-zeny-cream">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-zeny-sage/5 blur-2xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-zeny-sage/8 blur-3xl" />
        <div className="absolute top-40 left-10 w-48 h-48 rounded-full bg-zeny-leaf/5 blur-2xl" />
        
        {/* Leaf decorations */}
        <svg className="absolute top-16 right-8 w-20 h-20 text-zeny-sage/20 animate-leaf-sway leaf-decoration" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 C70 30, 90 50, 70 80 C50 60, 30 40, 50 10 Z" />
          <path d="M50 10 C50 30, 55 50, 70 80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
        </svg>
        <svg className="absolute bottom-32 left-6 w-16 h-16 text-zeny-sage/15 animate-leaf-sway leaf-decoration" style={{ animationDelay: '1s' }} viewBox="0 0 100 100" fill="currentColor">
          <path d="M30 80 C50 60, 70 40, 60 15 C40 35, 20 55, 30 80 Z" />
          <path d="M30 80 C45 60, 55 40, 60 15" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Brand */}
          <div className="animate-fade-in-up">
            {/* Logo Mark */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-zeny-warm flex items-center justify-center">
                  <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
                    <circle cx="30" cy="30" r="28" stroke="#5A7A4C" strokeWidth="2" />
                    <text x="30" y="38" textAnchor="middle" fill="#2D5016" fontSize="26" fontWeight="bold" fontFamily="sans-serif">Z</text>
                    <path d="M40 18 C48 24, 50 32, 44 42 C38 34, 34 26, 40 18Z" fill="#7C9A6E" />
                    <path d="M40 18 C44 24, 46 30, 44 42" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none" />
                    <circle cx="16" cy="20" r="2" fill="#7C9A6E" />
                    <circle cx="12" cy="26" r="1.5" fill="#A8C49A" />
                    <circle cx="18" cy="28" r="1" fill="#7C9A6E" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zeny-forest tracking-tight">
                  Zeny<span className="text-zeny-sage">Fit</span>
                </h1>
                <p className="text-sm sm:text-base font-medium text-zeny-sage-dark tracking-wider uppercase mt-1">
                  Saúde, Equilíbrio e Autoestima
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-zeny-forest/70 leading-relaxed max-w-md mb-8">
              Mais saúde, equilíbrio e autoestima para uma vida leve e plena. Produtos selecionados para cuidar da sua pele, corpo e bem-estar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#produtos">
                <button className="px-8 py-3 bg-zeny-sage text-white rounded-full font-medium hover:bg-zeny-sage-dark transition-all shadow-lg shadow-zeny-sage/20 hover:shadow-xl hover:shadow-zeny-sage/30 transform hover:-translate-y-0.5">
                  Ver Produtos
                </button>
              </a>
              <a href="#sobre">
                <button className="px-8 py-3 border-2 border-zeny-sage/30 text-zeny-forest rounded-full font-medium hover:bg-zeny-sage/5 transition-all">
                  Sobre Nós
                </button>
              </a>
            </div>

            {/* Quick Info */}
            <div className="flex items-center gap-6 text-sm text-zeny-forest/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-zeny-sage" />
                <span>Entrega para todo o país</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="w-4 h-4 text-zeny-sage" />
                <span>Pagamento na entrega</span>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="relative">
              {/* Background circle */}
              <div className="w-80 h-80 rounded-full bg-zeny-sage/10 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-zeny-sage/15 flex items-center justify-center animate-float">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-zeny-sage/20 to-zeny-sage-light/30 flex items-center justify-center">
                    <div className="text-center">
                      <Leaf className="w-16 h-16 text-zeny-forest/40 mx-auto mb-2" />
                      <p className="text-zeny-forest/50 text-sm font-medium">Bem-estar Natural</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cursive text overlay */}
              <div className="absolute -right-8 top-1/3 transform -translate-y-1/2">
                <p className="text-xl text-zeny-sage/60 italic font-light whitespace-nowrap">
                  &ldquo;Você no seu melhor todos os dias&rdquo;
                </p>
                <Heart className="w-5 h-5 text-zeny-sage/40 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Bar */}
      <div className="relative mt-auto">
        <div className="bg-zeny-sage">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              {features.map((feature) => (
                <div key={feature.label} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white text-center">{feature.label}</span>
                </div>
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
      </div>
    </section>
  );
}