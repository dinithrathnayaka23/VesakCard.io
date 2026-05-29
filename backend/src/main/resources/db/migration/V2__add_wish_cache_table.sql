CREATE TABLE wish_cache (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key    VARCHAR(255) NOT NULL UNIQUE,
  sinhala_wish TEXT NOT NULL,
  english_wish TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wish_cache_key ON wish_cache(cache_key);
