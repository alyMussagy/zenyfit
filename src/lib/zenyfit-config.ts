// ============================================
// ZENYFIT CONFIGURAÇÃO — Edite aqui os dados reais
// ============================================
// Quando receber o número real, endereço e redes sociais,
// basta alterar os valores abaixo. Toda a site actualiza automaticamente.
// ============================================

export const ZENYFIT_CONFIG = {
  // Número de WhatsApp da loja (formato internacional sem +)
  // Exemplo: '258841234567' para +258 84 123 4567
  whatsapp: '258875775167',

  // Informações de contacto
  contact: {
    phone: '+258 87 577 5167',
    email: 'info@zenyfit.mz',
    address: 'Maputo, Moçambique', // TODO: substituir pelo endereço real
  },

  // Horário de funcionamento
  hours: 'Seg-Sex: 8h - 18h',

  // Moeda
  currency: {
    code: 'MZN',
    locale: 'pt-MZ',
    symbol: 'MTn',
  },

  // Cidades de entrega (COD — valor confirmado pelo atendente via WhatsApp)
  provinces: [
    'Maputo Cidade',
    'Maputo Província (Matola)',
  ],

  // Categorias de produtos
  categories: ['Skincare', 'Corpo', 'Suplementos', 'Aromaterapia', 'Cabelo'],

  // Popup de oferta — edite aqui para trocar a promoção activa
  // Para desactivar, mude 'active' para false
  offerPopup: {
    active: true,
    // Mostrar novamente depois de X horas (0 = mostrar sempre)
    cooldownHours: 12,
    title: 'Oferta Especial por Tempo Limitado!',
    subtitle: 'Produtos seleccionados com até 30% de desconto. Só enquanto o stock durar.',
    benefits: [
      'Fórmulas naturais e seguras',
      'Resultados visíveis em poucas semanas',
      'Apoio personalizado via WhatsApp',
      'Entrega rápida em Maputo e Matola',
    ],
    stockAlert: 'Várias opções já estão quase esgotadas esta semana',
    ctaText: 'VER OFERTAS',
    ctaLink: '#produtos',  // '#' para scroll, ou '/produto/id' para produto específico
    footerText: 'Entrega em Maputo e Matola',
    urgencyLabel: 'Oferta por tempo limitado',
  },
};