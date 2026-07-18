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

  // Zonas de entrega com custos
  // Apenas Maputo Cidade e Matola por enquanto
  deliveryZones: [
    {
      province: 'Maputo Cidade',
      label: 'Maputo Cidade',
      zones: [
        { name: 'Centro / Baixa', cost: 100 },
        { name: 'Polana Cimento / Avenida', cost: 100 },
        { name: 'Sommerschield', cost: 100 },
        { name: 'Costa do Sol', cost: 120 },
        { name: 'Alto Maé', cost: 120 },
        { name: 'Coop', cost: 120 },
        { name: 'Mafalala / Xipamanine', cost: 120 },
        { name: 'Malhangalene', cost: 120 },
        { name: 'Jardim / Livramento', cost: 150 },
        { name: 'Laulane', cost: 150 },
        { name: 'Chamanculo', cost: 150 },
        { name: 'Zimpeto', cost: 200 },
        { name: 'Marracuene', cost: 250 },
        { name: 'Outra zona (Cidade)', cost: 200 },
      ] as const,
    },
    {
      province: 'Maputo Província',
      label: 'Matola',
      zones: [
        { name: 'Matola Centro', cost: 150 },
        { name: 'Matola Rio', cost: 150 },
        { name: 'Machava-Sede', cost: 150 },
        { name: 'Machava 1,5', cost: 200 },
        { name: 'Boane', cost: 250 },
        { name: 'Beluluane', cost: 250 },
        { name: 'Namaacha', cost: 300 },
        { name: 'Outra zona (Matola)', cost: 250 },
      ] as const,
    },
  ] as const,

  // Províncias de Moçambique (para referência futura)
  provinces: [
    'Maputo Cidade',
    'Maputo Província',
  ],

  // Categorias de produtos
  categories: ['Skincare', 'Corpo', 'Suplementos', 'Aromaterapia', 'Cabelo'],
};