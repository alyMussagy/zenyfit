import { db } from '@/lib/db';

async function cleanDemoData() {
  console.log('Cleaning demo orders...');
  await db.orderItem.deleteMany();
  const deleted = await db.order.deleteMany();
  console.log(`Deleted ${deleted.count} demo orders`);

  const products = await db.product.count();
  console.log(`Kept ${products} products in catalog`);
  console.log('Done! The store is ready for real orders.');
}

clean()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());

function clean() {
  return cleanDemoData();
}