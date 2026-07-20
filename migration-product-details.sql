-- Adicionar campos ricos ao Product para página de detalhe
-- Correr no Supabase SQL Editor

ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "ingredients" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "howToUse" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "benefits" TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "weight" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "additionalImages" TEXT[] NOT NULL DEFAULT '{}';