import { db } from '@/lib/db';

const products = [
  {
    name: 'Sérum Vitamina C Antioxidante',
    description: 'Sérum facial com vitamina C pura para luminosidade e proteção contra radicais livres. Ideal para pele opaca e manchas.',
    price: 890,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    category: 'Skincare',
    inStock: true,
    featured: true,
  },
  {
    name: 'Óleo de Argan Puro',
    description: 'Óleo de argan 100% puro para hidratação profunda do rosto e corpo. Rico em vitamina E e ácidos gordos essenciais.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
    category: 'Corpo',
    inStock: true,
    featured: true,
  },
  {
    name: 'Colagénio Hidrolisado',
    description: 'Suplemento de colagénio hidrolisado em pó para pele, cabelo e unhas mais fortes. Sabor morango natural.',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    category: 'Suplementos',
    inStock: true,
    featured: true,
  },
  {
    name: 'Kit Aromaterapia Relaxante',
    description: 'Kit completo com óleo essencial de lavanda, difusor e velas aromáticas para momentos de relaxamento.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
    category: 'Aromaterapia',
    inStock: true,
    featured: false,
  },
  {
    name: 'Máscara Facial Detox',
    description: 'Máscara facial com carvão activo e argila para limpeza profunda dos poros. Remove impurezas e toxinas.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
    category: 'Skincare',
    inStock: true,
    featured: false,
  },
  {
    name: 'Shampoo de Óleo de Coco',
    description: 'Shampoo hidratante com óleo de coco orgânico para cabelos secos e danificados. Fortalece e dá brilho natural.',
    price: 480,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop',
    category: 'Cabelo',
    inStock: true,
    featured: false,
  },
  {
    name: 'Creme Hidratante SPF 50',
    description: 'Creme hidratante facial com protecção solar FPS 50. Textura leve e não gordurosa, ideal para uso diário.',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=400&h=400&fit=crop',
    category: 'Skincare',
    inStock: true,
    featured: true,
  },
  {
    name: 'Óleo Essencial de Tea Tree',
    description: 'Óleo essencial puro de melaleuca com propriedades antibacterianas. Ideal para acne e peles oleosas.',
    price: 520,
    image: 'https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=400&h=400&fit=crop',
    category: 'Aromaterapia',
    inStock: true,
    featured: false,
  },
  {
    name: 'Máscara Capilar de Queratina',
    description: 'Máscara de tratamento profundo com queratina para reconstrução capilar. Devolve força e vitalidade aos fios.',
    price: 750,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
    category: 'Cabelo',
    inStock: true,
    featured: false,
  },
  {
    name: 'Esfoliante Corporal Natural',
    description: 'Esfoliante com açúcar, café e óleo de amêndoas doces. Remove células mortas e deixa a pele macia e aveludada.',
    price: 580,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    category: 'Corpo',
    inStock: true,
    featured: false,
  },
  {
    name: 'Complexo Multivitamínico',
    description: 'Suplemento multivitamínico completo com vitaminas A, B, C, D, E e minerais essenciais para o dia-a-dia.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    category: 'Suplementos',
    inStock: true,
    featured: false,
  },
  {
    name: 'Creme Anti-estrias',
    description: 'Creme especial para prevenção e redução de estrias. Com óleo de rosa mosqueta e manteiga de karité.',
    price: 920,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
    category: 'Corpo',
    inStock: false,
    featured: false,
  },
];

async function seed() {
  console.log('Seeding database...');

  // Clear existing
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();

  // Create products
  for (const product of products) {
    await db.product.create({ data: product });
  }

  const allProducts = await db.product.findMany();
  console.log(`Created ${allProducts.length} products`);

  // Create sample orders
  const sampleOrders = [
    {
      customerName: 'Ana Machel',
      customerPhone: '84 123 4567',
      province: 'Maputo Cidade',
      city: 'Maputo',
      address: 'Av. Julius Nyerere, 1234, Bairro Sommerschield',
      status: 'entregue',
      total: 1990,
      items: [
        { productId: allProducts[0].id, productName: 'Sérum Vitamina C Antioxidante', quantity: 1, price: 890 },
        { productId: allProducts[3].id, productName: 'Kit Aromaterapia Relaxante', quantity: 1, price: 1100 },
      ],
    },
    {
      customerName: 'Carlos Nhantumbo',
      customerPhone: '86 987 6543',
      province: 'Sofala',
      city: 'Beira',
      address: 'Rua Major F. Magaia, 56, Ponta Gea',
      status: 'enviado',
      total: 1730,
      items: [
        { productId: allProducts[1].id, productName: 'Óleo de Argan Puro', quantity: 1, price: 1250 },
        { productId: allProducts[4].id, productName: 'Máscara Facial Detox', quantity: 1, price: 480 },
      ],
    },
    {
      customerName: 'Maria Tembe',
      customerPhone: '85 456 7890',
      province: 'Nampula',
      city: 'Nampula',
      address: 'Av. Eduardo Mondlane, 890, Muhala-Expansão',
      status: 'pendente',
      total: 2100,
      items: [
        { productId: allProducts[2].id, productName: 'Colagénio Hidrolisado', quantity: 1, price: 2100 },
      ],
    },
    {
      customerName: 'João Sitoe',
      customerPhone: '84 321 0987',
      province: 'Zambézia',
      city: 'Quelimane',
      address: 'Rua da Resistência, 45, Molocué',
      status: 'confirmado',
      total: 1160,
      items: [
        { productId: allProducts[5].id, productName: 'Shampoo de Óleo de Coco', quantity: 2, price: 480 },
        { productId: allProducts[8].id, productName: 'Máscara Capilar de Queratina', quantity: 1, price: 750 },
      ],
    },
  ];

  for (const order of sampleOrders) {
    await db.order.create({
      data: {
        ...order,
        items: { create: order.items },
      },
    });
  }

  const allOrders = await db.order.findMany();
  console.log(`Created ${allOrders.length} orders`);

  console.log('Seed completed!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });