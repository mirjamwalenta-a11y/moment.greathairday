-- Videomaker-Eingang: privater Speicher für Videos und Fotos aus der Handy-Galerie,
-- die der Videomaker (Repo videomaker-privat, läuft in Claude Code) danach abholt.
--
-- Ablauf: Moment-App (videomaker-upload.html) lädt mit dem Login-Token der Chefin
-- hoch und erzeugt einen zeitlich begrenzten Link (24 h). Den Link fügt sie in der
-- Videomaker-Sitzung ein; der Videomaker lädt die Datei damit herunter.
--
-- Sicherheit (CLAUDE.md):
--   * Bucket ist privat (public = false): ohne Login oder gültigen Link nichts lesbar.
--   * storage.objects hat RLS bereits an (Supabase-Standard). Die Policies unten
--     gelten nur für diesen Bucket und nur für die Rolle authenticated.
--   * Rollenprüfung serverseitig über public.bewerbungen_ist_chefin()
--     (index.greathairday, Migration 20261021120000; EXECUTE für authenticated).
--   * Jede Datei liegt im Ordner <auth.uid()>/…, nur dort darf geschrieben werden.
--   * Keine Policy und kein Recht für anon. Keine neue Tabelle in public, daher
--     keine zusätzlichen GRANTs nötig (Storage-Rechte verwaltet Supabase).
--
-- Größe: file_size_limit bleibt leer, es gilt das Projekt-Limit aus den
-- Storage-Einstellungen (Free-Plan 50 MB, Pro-Plan einstellbar bis 500 GB).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('videomaker-eingang', 'videomaker-eingang', false, NULL, ARRAY['video/*', 'image/*'])
ON CONFLICT (id) DO UPDATE
  SET public = false,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "videomaker_eingang_hochladen" ON storage.objects;
DROP POLICY IF EXISTS "videomaker_eingang_lesen"     ON storage.objects;
DROP POLICY IF EXISTS "videomaker_eingang_loeschen"  ON storage.objects;

-- Hochladen: nur die Chefin, nur in den eigenen Ordner
CREATE POLICY "videomaker_eingang_hochladen" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'videomaker-eingang'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.bewerbungen_ist_chefin()
  );

-- Lesen (Liste und Link erzeugen): nur die Chefin, nur der eigene Ordner
CREATE POLICY "videomaker_eingang_lesen" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'videomaker-eingang'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.bewerbungen_ist_chefin()
  );

-- Löschen: nur die Chefin, nur der eigene Ordner
CREATE POLICY "videomaker_eingang_loeschen" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'videomaker-eingang'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND public.bewerbungen_ist_chefin()
  );

-- Kontrolle (nur lesen): Bucket privat, drei Policies, keine für anon.
SELECT id, public, allowed_mime_types FROM storage.buckets WHERE id = 'videomaker-eingang';
SELECT policyname, cmd, roles FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'videomaker_eingang_%';
