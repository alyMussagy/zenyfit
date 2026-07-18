-- ============================================
-- ZENYFIT — Migração: Adicionar deliveryFee à Order
-- ============================================
-- Execute este SQL no Supabase SQL Editor
-- https://supabase.com/dashboard/project/ldipatlofnuzeglzuexj/sql
-- ============================================

ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0;