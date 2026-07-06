'use client';

import { Leaf, Heart, Shield, Truck } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="sobre" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* About */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="w-16 h-16 rounded-full bg-zeny-green-card flex items-center justify-center mb-6">
              <svg viewBox="0 0 60 60" className="w-10 h-10" fill="none">
                <circle cx="30" cy="30" r="28" stroke="#2E9802" strokeWidth="2" />
                <text x="30" y="38" textAnchor="middle" fill="#2E9802" fontSize="26" fontWeight="bold" fontFamily="sans-serif">Z</text>
                <path d="M40 18 C48 24, 50 32, 44 42 C38 34, 34 26, 40 18Z" fill="#38B802" />
                <circle cx="16" cy="20" r="2" fill="#38B802" />
                <circle cx="12" cy="26" r="1.5" fill="#6FD63A" />
                <circle cx="18" cy="28" r="1" fill="#38B802" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zeny-green-dark mb-6">Sobre a ZenyFit</h2>
            <p className="text-zeny-green-dark/70 leading-relaxed mb-4">
              A ZenyFit nasceu da paixão por promover saúde, beleza e bem-estar de forma natural e acessível em Moçambique. Acreditamos que cada pessoa merece cuidar de si com produtos de qualidade, seleccionados com carinho e responsabilidade.
            </p>
            <p className="text-zeny-green-dark/70 leading-relaxed mb-6">
              Trabalhamos directamente com marcas de confiança para trazer até si os melhores produtos de skincare, suplementos naturais, aromaterapia e cuidados corporais. A nossa missão é simples: ajudar cada cliente a sentir-se no seu melhor, todos os dias.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zeny-green-card rounded-xl p-4">
                <Leaf className="w-6 h-6 text-zeny-green mb-2" />
                <p className="text-sm font-medium text-zeny-green-dark">100% Natural</p>
                <p className="text-xs text-zeny-green-dark/50 mt-1">Produtos seleccionados com ingredientes naturais</p>
              </div>
              <div className="bg-zeny-green-card rounded-xl p-4">
                <Truck className="w-6 h-6 text-zeny-green mb-2" />
                <p className="text-sm font-medium text-zeny-green-dark">Entrega Nacional</p>
                <p className="text-xs text-zeny-green-dark/50 mt-1">Para todas as províncias de Moçambique</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-zeny-green/10 to-zeny-green-light/20 rounded-3xl p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-12 h-12 text-zeny-green" />
                </div>
                <p className="text-2xl font-bold text-zeny-green-dark mb-2">+1.000</p>
                <p className="text-zeny-green-dark/60">Clientes satisfeitos em todo o país</p>
                <div className="flex justify-center gap-1 mt-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-zeny-green-dark/40 mt-1">4.8 de 5 estrelas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-zeny-green rounded-3xl p-8 sm:p-12 text-white">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10">Porquê Escolher a ZenyFit?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Qualidade Garantida', desc: 'Todos os nossos produtos são testados e aprovados antes de chegar às suas mãos' },
              { icon: Truck, title: 'Entrega Rápida', desc: 'Entregamos em todas as províncias com rastreamento do seu pedido' },
              { icon: Heart, title: 'Atendimento Humano', desc: 'Equipa dedicada pronta para ajudar via WhatsApp e telefone' },
              { icon: Leaf, title: 'Sustentabilidade', desc: 'Compromisso com produtos de origem sustentável e embalagens ecológicas' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}