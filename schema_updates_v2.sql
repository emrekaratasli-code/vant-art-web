-- 1. Kategoriler tablosuna slug (URL dostu isim) sütunu ekleyelim
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Mevcut kategorilerin slug'larını güncelleyelim (Örnekler)
-- Bu kısmı kendi kategori isimlerinize göre çoğaltabilirsiniz.
UPDATE public.categories SET slug = 'yuzukler' WHERE name = 'Yüzükler';
UPDATE public.categories SET slug = 'kolyeler' WHERE name = 'Kolyeler';
UPDATE public.categories SET slug = 'kupeler' WHERE name = 'Küpeler';
UPDATE public.categories SET slug = 'bileklikler' WHERE name = 'Bileklikler';

-- 3. Ürünler tablosu için okuma iznini (SELECT) herkese tekrar mühürle
-- Önce eski politikayı temizle (varsa)
DROP POLICY IF EXISTS "public_select_products" ON public.products;
-- Yeni politikayı oluştur
CREATE POLICY "public_select_products" ON public.products FOR SELECT USING (true);

-- 4. Hafızayı tazele
NOTIFY pgrst, 'reload schema';
