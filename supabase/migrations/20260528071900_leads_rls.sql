-- Activar o Row Level Security (RLS) na tabela leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 1. "Public can insert leads"
-- Permite que qualquer visitante do site (anon) possa submeter o formulário de contacto
CREATE POLICY "Public can insert leads"
ON leads
FOR INSERT
TO anon
WITH CHECK (true);

-- 2. "Authenticated can read leads"
-- Apenas utilizadores com sessão iniciada (admins) podem ler/listar os leads
CREATE POLICY "Authenticated can read leads"
ON leads
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- 3. "Authenticated can update lead status"
-- Apenas utilizadores com sessão iniciada podem alterar o estado de um lead
CREATE POLICY "Authenticated can update lead status"
ON leads
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated');

-- 4. "Authenticated can delete leads"
-- Apenas utilizadores com sessão iniciada podem remover um lead da base de dados
CREATE POLICY "Authenticated can delete leads"
ON leads
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- Bloco de verificação: Confirmar que as 4 políticas foram aplicadas correctamente
SELECT policename, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'leads';
