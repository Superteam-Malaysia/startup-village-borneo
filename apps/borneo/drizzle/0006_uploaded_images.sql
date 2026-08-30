CREATE TABLE IF NOT EXISTS uploaded_images (
  object_key text PRIMARY KEY,
  content_type text NOT NULL,
  data bytea NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
