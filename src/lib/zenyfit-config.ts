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
  // Base: Estádio da Machava — preços por distância real
  // Apenas Maputo Cidade e Matola por enquanto
  deliveryZones: [
    {
      province: 'Maputo Província',
      label: 'Matola',
      zones: [
        // Perto do Estádio da Machava (0-5 km)
        { name: 'Machava-Sede', cost: 75 },
        { name: 'Matola Centro', cost: 75 },
        { name: 'Matola Rio', cost: 100 },
        { name: 'Infulene', cost: 100 },
        { name: 'T3 / 25 de Setembro', cost: 100 },
        // Média distância (5-12 km)
        { name: 'Costa do Sol (Matola)', cost: 120 },
        { name: 'Liberdade', cost: 120 },
        { name: 'Machava 1,5', cost: 120 },
        { name: 'Vila de Matola', cost: 120 },
        // Mais longe (12-25 km)
        { name: 'Boane', cost: 200 },
        { name: 'Beluluane', cost: 200 },
        { name: 'Moamba', cost: 250 },
        { name: 'Namaacha', cost: 300 },
        { name: 'Outra zona (Matola)', cost: 200 },
      ] as const,
    },
    {
      province: 'Maputo Cidade',
      label: 'Maputo Cidade',
      zones: [
        // Zona sul de Maputo (perto da ponte, ~10 km de Machava)
        { name: 'Mafalala / Xipamanine', cost: 100 },
        { name: 'Chamanculo C / A', cost: 100 },
        { name: 'Malhangalene', cost: 100 },
        { name: 'Alto Maé', cost: 120 },
        { name: 'Coop', cost: 120 },
        // Centro de Maputo (~12-15 km de Machava)
        { name: 'Centro / Baixa', cost: 150 },
        { name: 'Jardim / Livramento', cost: 150 },
        { name: 'Polana Cimento', cost: 150 },
        // Zona norte (mais longe, ~15-20 km de Machava)
        { name: 'Sommerschield', cost: 200 },
        { name: 'Polana Cimento / Avenida', cost: 200 },
        { name: 'Costa do Sol', cost: 200 },
        { name: 'Zimpeto', cost: 250 },
        { name: 'Marracuene', cost: 300 },
        { name: 'Outra zona (Cidade)', cost: 250 },
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