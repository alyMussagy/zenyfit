import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTables() {
  console.log('🔌 Connecting to Supabase at:', supabaseUrl);

  // Since we're using the anon key, we'll use the Supabase REST API
  // to execute SQL via the rpc endpoint. But first, let's try inserting
  // a test record to see if tables exist.

  // Try to query Product table first
  const { data: productCheck, error: productError } = await supabase
    .from('Product')
    .select('id')
    .limit(1);

  if (!productError) {
    console.log('✅ Product table already exists');
  } else {
    console.log('❌ Product table not found. Error:', productError.message);
    console.log('');
    console.log('⚠️  You need to create the tables manually in the Supabase SQL Editor.');
    console.log('   Go to: https://supabase.com/dashboard/project/ldipatlofnuzeglzuexj/sql');
    console.log('   And run the SQL below:\n');
    console.log(SQL_SCHEMA);
    return false;
  }

  // Check Order table
  const { error: orderError } = await supabase
    .from('Order')
    .select('id')
    .limit(1);

  if (!orderError) {
    console.log('✅ Order table already exists');
  } else {
    console.log('❌ Order table not found:', orderError.message);
    console.log('');
    console.log('⚠️  Run the SQL below in Supabase SQL Editor:\n');
    console.log(SQL_SCHEMA);
    return false;
  }

  // Check OrderItem table
  const { error: itemError } = await supabase
    .from('OrderItem')
    .select('id')
    .limit(1);

  if (!itemError) {
    console.log('✅ OrderItem table already exists');
  } else {
    console.log('❌ OrderItem table not found:', itemError.message);
    console.log('');
    console.log('⚠️  Run the SQL below in Supabase SQL Editor:\n');
    console.log(SQL_SCHEMA);
    return false;
  }

  console.log('\n🎉 All tables are ready!');
  return true;
}

const SQL_SCHEMA = `
-- ============================================
-- ZENYFIT - Tabelas do Banco de Dados
-- Execute no Supabase SQL Editor
-- ============================================

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "price" REAL NOT NULL DEFAULT 0,
  "image" TEXT NOT NULL DEFAULT '',
  "category" TEXT NOT NULL DEFAULT 'Skincare',
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "province" TEXT NOT NULL DEFAULT '',
  "city" TEXT NOT NULL DEFAULT '',
  "address" TEXT NOT NULL DEFAULT '',
  "total" REAL NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'pendente',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE NO ACTION,
  "productId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "price" REAL NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Desabilitar RLS para acesso público (API server-side)
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on Product" ON "Product" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on Order" ON "Order" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on OrderItem" ON "OrderItem" FOR ALL USING (true) WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"("category");
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_order_created ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_orderitem_orderid ON "OrderItem"("orderId");
`;

createTables().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});