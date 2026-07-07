'use client';

import { motion } from 'framer-motion';
import { Leaf, Heart, Shield, Truck } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from './ScrollReveal';

export default function AboutSection() {
  return (
    <section id="sobre" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* About */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-12 sm:mb-20">
          <div>
            <ScrollReveal variant="fadeLeft" delay={0.1}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-zeny-green-card flex items-center justify-center mb-4 sm:mb-6">
                <svg viewBox="0 0 60 60" className="w-8 h-8 sm:w-10 sm:h-10" fill="none">
                  <circle cx="30" cy="30" r="28" stroke="#2E9802" strokeWidth="2" />
                  <text x="30" y="38" textAnchor="middle" fill="#2E9802" fontSize="26" fontWeight="bold" fontFamily="sans-serif">Z</text>
                  <path d="M40 18 C48 24, 50 32, 44 42 C38 34, 34 26, 40 18Z" fill="#38B802" />
                  <circle cx="16" cy="20" r="2" fill="#38B802" />
                  <circle cx="12" cy="26" r="1.5" fill="#6FD63A" />
                  <circle cx="18" cy="28" r="1" fill="#38B802" />
                </svg>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeLeft" delay={0.2}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zeny-green-dark mb-4 sm:mb-6">Sobre a ZenyFit</h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeLeft" delay={0.3}>
              <p className="text-zeny-green-dark/70 leading-relaxed mb-4">
                A ZenyFit nasceu da paixão por promover saúde, beleza e bem-estar de forma natural e acessível em Moçambique. Acreditamos que cada pessoa merece cuidar de si com produtos de qualidade, seleccionados com carinho e responsabilidade.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fadeLeft" delay={0.4}>
              <p className="text-zeny-green-dark/70 leading-relaxed mb-6">
                Trabalhamos directamente com marcas de confiança para trazer até si os melhores produtos de skincare, suplementos naturais, aromaterapia e cuidados corporais. A nossa missão é simples: ajudar cada cliente a sentir-se no seu melhor, todos os dias.
              </p>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.15}>
              <StaggerItem variant="fadeUp">
                <motion.div
                  className="bg-zeny-green-card rounded-xl p-4 card-hover-lift cursor-default"
                  whileHover={{ scale: 1.02 }}
                >
                  <Leaf className="w-6 h-6 text-zeny-green mb-2" />
                  <p className="text-sm font-medium text-zeny-green-dark">100% Natural</p>
                  <p className="text-xs text-zeny-green-dark/50 mt-1">Produtos seleccionados com ingredientes naturais</p>
                </motion.div>
              </StaggerItem>
              <StaggerItem variant="fadeUp" delay={0.1}>
                <motion.div
                  className="bg-zeny-green-card rounded-xl p-4 card-hover-lift cursor-default"
                  whileHover={{ scale: 1.02 }}
                >
                  <Truck className="w-6 h-6 text-zeny-green mb-2" />
                  <p className="text-sm font-medium text-zeny-green-dark">Entrega Nacional</p>
                  <p className="text-xs text-zeny-green-dark/50 mt-1">Para todas as províncias de Moçambique</p>
                </motion.div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          <ScrollReveal variant="fadeRight" delay={0.2}>
            <div className="relative">
              <div className="bg-gradient-to-br from-zeny-green/10 to-zeny-green-light/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 flex items-center justify-center min-h-[260px] sm:min-h-[400px]">
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
                    whileInView={{ scale: [0.8, 1.05, 1] }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  >
                    <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-zeny-green" />
                  </motion.div>
                  <motion.p
                    className="text-xl sm:text-2xl font-bold text-zeny-green-dark mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
                    viewport={{ once: true }}
                  >
                    +1.000
                  </motion.p>
                  <ScrollReveal variant="fade" delay={0.3}>
                    <p className="text-zeny-green-dark/60">Clientes satisfeitos em todo o país</p>
                  </ScrollReveal>
                  <ScrollReveal variant="fade" delay={0.4}>
                    <div className="flex justify-center gap-1 mt-4">
                      {[1,2,3,4,5].map((s, i) => (
                        <motion.svg
                          key={s}
                          className="w-5 h-5 text-amber-400"
                          fill="currentColor" viewBox="0 0 20 20"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.08 }}
                          viewport={{ once: true }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </div>
                    <p className="text-sm text-zeny-green-dark/40 mt-1">4.8 de 5 estrelas</p>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Why Choose Us */}
        <ScrollReveal variant="scale" delay={0.1}>
          <div className="bg-zeny-green rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white overflow-hidden relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white -translate-x-1/4 translate-y-1/4" />
            </div>

            <div className="relative">
              <ScrollReveal variant="fadeUp" delay={0.15}>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-8 sm:mb-10">Porquê Escolher a ZenyFit?</h3>
              </ScrollReveal>

              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.12}>
                {[
                  { icon: Shield, title: 'Qualidade Garantida', desc: 'Todos os nossos produtos são testados e aprovados antes de chegar às suas mãos' },
                  { icon: Truck, title: 'Entrega Rápida', desc: 'Entregamos em todas as províncias com rastreamento do seu pedido' },
                  { icon: Heart, title: 'Atendimento Humano', desc: 'Equipa dedicada pronta para ajudar via WhatsApp e telefone' },
                  { icon: Leaf, title: 'Sustentabilidade', desc: 'Compromisso com produtos de origem sustentável e embalagens ecológicas' },
                ].map((item) => (
                  <StaggerItem key={item.title} variant="fadeUp">
                    <motion.div
                      className="text-center group cursor-default"
                      whileHover={{ y: -4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <motion.div
                        className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.25)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      >
                        <item.icon className="w-7 h-7" />
                      </motion.div>
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}