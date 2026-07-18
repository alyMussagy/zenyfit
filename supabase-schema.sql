-- ============================================
-- ZENYFIT — Schema Supabase (PostgreSQL)
-- ============================================
-- Execute this SQL in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/ldipatlofnuzeglzuexj/sql
-- ============================================

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "image" TEXT NOT NULL DEFAULT '',
  "category" TEXT NOT NULL,
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'pendente',
  "total" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"("category");
CREATE INDEX IF NOT EXISTS idx_product_featured ON "Product"("featured");
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_order_created ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_orderitem_orderid ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS idx_orderitem_productid ON "OrderItem"("productId");

-- Auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_product_updated ON "Product";
CREATE TRIGGER trg_product_updated
  BEFORE UPDATE ON "Product"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_order_updated ON "Order";
CREATE TRIGGER trg_order_updated
  BEFORE UPDATE ON "Order"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Desactivar RLS (sem autenticação por enquanto)
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on Product" ON "Product" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on Order" ON "Order" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on OrderItem" ON "OrderItem" FOR ALL USING (true) WITH CHECK (true);