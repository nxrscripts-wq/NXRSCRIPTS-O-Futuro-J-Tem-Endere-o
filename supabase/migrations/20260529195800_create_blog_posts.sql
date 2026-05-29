CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('Cibersegurança','Desenvolvimento','Angola Tech','Tendências')),
  tags text[] DEFAULT '{}',
  cover_image text,
  reading_time_minutes int DEFAULT 5,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads published" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Auth manages all" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
