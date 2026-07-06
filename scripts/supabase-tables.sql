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

-- Habilitar RLS e criar políticas públicas
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