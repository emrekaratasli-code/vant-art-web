-- Eksik sütunları ekleyelim ve şemayı tazeleyelim
-- Bu komutları Supabase Dashboard -> SQL Editor kısmında çalıştırın.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS material TEXT;

-- Şemayı yenile (Supabase'in yeni sütunları görmesi için)
NOTIFY pgrst, 'reload schema';
