-- ========================================
-- MIGRATION: Store Infrastructure
-- Tabelas de Produtos e Requisições de Compra
-- ========================================

-- ========================================
-- TABELA DE PRODUTOS
-- ========================================
CREATE TABLE IF NOT EXISTS products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  description     text NOT NULL,
  price           numeric(12,2),                    -- NULL = "Consulte-nos"
  currency        text DEFAULT 'AOA',               -- AOA (Kwanza) ou USD
  category        text NOT NULL,
  stock_status    text DEFAULT 'available'
                  CHECK (stock_status IN ('available','out_of_stock','on_request')),
  featured        boolean DEFAULT false,            -- destaque na loja
  active          boolean DEFAULT true,             -- visível na loja pública
  sort_order      int DEFAULT 0,                    -- ordem de exibição
  images          text[] DEFAULT '{}',              -- array de URLs do Supabase Storage
  cover_image     text,                             -- URL da imagem principal
  specs           jsonb DEFAULT '{}',               -- especificações técnicas
  tags            text[] DEFAULT '{}',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ========================================
-- TABELA DE REQUISIÇÕES DE COMPRA
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name    text NOT NULL,                    -- snapshot do nome no momento
  product_price   numeric(12,2),                    -- snapshot do preço no momento
  customer_name   text NOT NULL,
  customer_email  text NOT NULL,
  customer_phone  text,
  quantity        int DEFAULT 1 CHECK (quantity > 0),
  message         text,                             -- mensagem adicional do cliente
  status          text DEFAULT 'new'
                  CHECK (status IN ('new','contacted','processing','completed','cancelled')),
  source          text DEFAULT 'form'
                  CHECK (source IN ('form','whatsapp')),
  notes           text,                             -- notas internas do admin
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ========================================
-- TRIGGERS updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- RLS — PRODUTOS
-- ========================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa vê produtos activos
CREATE POLICY "Public reads active products"
  ON products FOR SELECT
  USING (active = true);

-- Admin autenticado gere tudo
CREATE POLICY "Authenticated manages products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- ========================================
-- RLS — REQUISIÇÕES
-- ========================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode criar requisição (compra)
CREATE POLICY "Public can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Apenas autenticados lêem e gerem requisições
CREATE POLICY "Authenticated manages orders"
  ON orders FOR ALL
  USING (auth.role() = 'authenticated');

-- ========================================
-- ÍNDICES
-- ========================================
CREATE INDEX idx_products_active ON products (active, sort_order DESC);
CREATE INDEX idx_products_category ON products (category) WHERE active = true;
CREATE INDEX idx_products_featured ON products (featured) WHERE active = true AND featured = true;
CREATE INDEX idx_orders_status ON orders (status, created_at DESC);
CREATE INDEX idx_orders_product ON orders (product_id);

-- ========================================
-- STORAGE — Bucket de Imagens de Produtos
-- ========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Qualquer pessoa pode ver imagens
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Apenas autenticados fazem upload/delete
CREATE POLICY "Authenticated manages product images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
