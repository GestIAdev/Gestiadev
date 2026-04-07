-- ============================================================
-- WAVE 2503 — EL CÓNCLAVE: SCHEMA DE BASE DE DATOS
-- Target: Supabase (PostgreSQL + Auth + Storage)
-- ============================================================

-- 1. PROFILES (vinculado a Supabase Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'username', 'anon_' || LEFT(NEW.id::text, 8)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. CATEGORIES (Secciones del foro)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Semillas obligatorias
INSERT INTO public.categories (name, description, slug, sort_order) VALUES
  ('Anuncios Oficiales', 'Comunicados del equipo GestIAdev. Solo administradores pueden publicar.', 'anuncios-oficiales', 1),
  ('Soporte Técnico', 'Problemas, bugs y dudas técnicas sobre LuxSync y el ecosistema GestIAdev.', 'soporte-tecnico', 2),
  ('LFX Fixture Vault', 'Librería pública de archivos .lfx. Comparte y descarga fixtures para LuxSync.', 'lfx-fixture-vault', 3),
  ('Showcases & Setups', 'Muestra tus setups de iluminación, configuraciones y directos con LuxSync.', 'showcases-setups', 4);

-- 3. THREADS (Hilos)
CREATE TABLE public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_threads_category ON public.threads(category_id, created_at DESC);
CREATE INDEX idx_threads_author ON public.threads(author_id);

-- 4. REPLIES (Respuestas)
CREATE TABLE public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_replies_thread ON public.replies(thread_id, created_at ASC);

-- 5. LFX_ATTACHMENTS (Archivos .lfx vinculados a threads o replies)
CREATE TABLE public.lfx_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.replies(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Ruta en Supabase Storage
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Al menos uno de thread_id o reply_id debe estar presente
  CONSTRAINT lfx_attachment_parent CHECK (thread_id IS NOT NULL OR reply_id IS NOT NULL)
);

CREATE INDEX idx_lfx_thread ON public.lfx_attachments(thread_id);
CREATE INDEX idx_lfx_reply ON public.lfx_attachments(reply_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lfx_attachments ENABLE ROW LEVEL SECURITY;

-- Profiles: lectura pública, edición propia
CREATE POLICY "Profiles: lectura pública" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: editar propio" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: lectura pública, solo admins crean
CREATE POLICY "Categories: lectura pública" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories: solo admin inserta" ON public.categories FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Threads: lectura pública, crear si autenticado, editar/borrar propio
CREATE POLICY "Threads: lectura pública" ON public.threads FOR SELECT USING (true);
CREATE POLICY "Threads: crear autenticado" ON public.threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Threads: editar propio" ON public.threads FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Threads: borrar propio o admin" ON public.threads FOR DELETE
  USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Replies: lectura pública, crear si autenticado, editar/borrar propio
CREATE POLICY "Replies: lectura pública" ON public.replies FOR SELECT USING (true);
CREATE POLICY "Replies: crear autenticado" ON public.replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Replies: editar propio" ON public.replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Replies: borrar propio o admin" ON public.replies FOR DELETE
  USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- LFX Attachments: lectura pública, subir si autenticado, borrar propio
CREATE POLICY "LFX: lectura pública" ON public.lfx_attachments FOR SELECT USING (true);
CREATE POLICY "LFX: subir autenticado" ON public.lfx_attachments FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "LFX: borrar propio" ON public.lfx_attachments FOR DELETE USING (auth.uid() = uploader_id);

-- ============================================================
-- SUPABASE STORAGE BUCKET (ejecutar manualmente o via API)
-- ============================================================
-- Crear bucket 'lfx-files' con restricción de tipo MIME:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('lfx-files', 'lfx-files', true);
--
-- Política de storage (lectura pública, subida autenticada):
-- CREATE POLICY "LFX Storage: lectura pública" ON storage.objects FOR SELECT USING (bucket_id = 'lfx-files');
-- CREATE POLICY "LFX Storage: subida autenticada" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lfx-files' AND auth.role() = 'authenticated');
