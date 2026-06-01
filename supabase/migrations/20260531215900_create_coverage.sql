CREATE TABLE IF NOT EXISTS province_coverage (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id  text UNIQUE NOT NULL,
  province_name text NOT NULL,
  status       text DEFAULT 'none' CHECK (status IN ('active','partial','planned','none')),
  services     text[] DEFAULT '{}',
  note         text,
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE province_coverage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads coverage" ON province_coverage 
  FOR SELECT USING (true);
  
CREATE POLICY "Authenticated manages coverage" ON province_coverage 
  FOR ALL USING (auth.role() = 'authenticated');

-- Dados iniciais
INSERT INTO province_coverage (province_id, province_name, status, services, note) VALUES
  ('luanda', 'Luanda', 'active',
   ARRAY['Desenvolvimento de Software','Cibersegurança','Redes e Infraestrutura','Telecomunicações','Consultoria IT','Cloud Computing','IA e Automação','Serviços Geridos'],
   'Sede da NXRSCRIPTS — Rua 11 de Novembro, Bairro Luanda Sul, Viana'),
  ('benguela', 'Benguela', 'planned', '{}', 'Expansão prevista para Q3 2026'),
  ('huambo', 'Huambo', 'planned', '{}', 'Expansão prevista para Q4 2026'),
  ('cabinda', 'Cabinda', 'none', '{}', null),
  ('zaire', 'Zaire', 'none', '{}', null),
  ('uige', 'Uíge', 'none', '{}', null),
  ('bengo', 'Bengo', 'none', '{}', null),
  ('kwanza_norte', 'Cuanza Norte', 'none', '{}', null),
  ('kwanza_sul', 'Cuanza Sul', 'none', '{}', null),
  ('malanje', 'Malanje', 'none', '{}', null),
  ('lunda_norte', 'Lunda Norte', 'none', '{}', null),
  ('lunda_sul', 'Lunda Sul', 'none', '{}', null),
  ('bie', 'Bié', 'none', '{}', null),
  ('moxico', 'Moxico', 'none', '{}', null),
  ('namibe', 'Namibe', 'none', '{}', null),
  ('huila', 'Huíla', 'none', '{}', null),
  ('cunene', 'Cunene', 'none', '{}', null),
  ('cuando_cubango', 'Cuando Cubango', 'none', '{}', null)
ON CONFLICT (province_id) DO NOTHING;
