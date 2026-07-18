-- Tabela Popup para ofertas geríveis pelo dashboard
-- Só pode haver 1 popup activo de cada vez (a lógica fica no frontend)

CREATE TABLE IF NOT EXISTS "Popup" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "subtitle" TEXT NOT NULL DEFAULT '',
  "benefits" TEXT[] NOT NULL DEFAULT '{}',
  "stockAlert" TEXT NOT NULL DEFAULT '',
  "ctaText" TEXT NOT NULL DEFAULT 'VER OFERTAS',
  "ctaLink" TEXT NOT NULL DEFAULT '#produtos',
  "footerText" TEXT NOT NULL DEFAULT '',
  "urgencyLabel" TEXT NOT NULL DEFAULT 'Oferta por tempo limitado',
  "cooldownHours" DOUBLE PRECISION NOT NULL DEFAULT 12,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "showDelay" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: permitir tudo (mesmo padrão das outras tabelas)
ALTER TABLE "Popup" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow all on Popup" ON "Popup" FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Popup de exemplo para começar
INSERT INTO "Popup" ("title", "subtitle", "benefits", "stockAlert", "ctaText", "ctaLink", "footerText", "urgencyLabel", "cooldownHours", "active")
VALUES (
  'Oferta Especial por Tempo Limitado!',
  'Produtos seleccionados com até 30% de desconto. Só enquanto o stock durar.',
  ARRAY['Fórmulas naturais e seguras', 'Resultados visíveis em poucas semanas', 'Apoio personalizado via WhatsApp', 'Entrega rápida em Maputo e Matola'],
  'Várias opções já estão quase esgotadas esta semana',
  'VER OFERTAS',
  '#produtos',
  'Entrega em Maputo e Matola',
  'Oferta por tempo limitado',
  12,
  true
);