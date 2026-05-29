CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE cards (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           VARCHAR(8)   NOT NULL UNIQUE,
  sender_name    VARCHAR(100) NOT NULL,
  recipient_name VARCHAR(100) NOT NULL DEFAULT '',
  wish_text      TEXT         NOT NULL,
  theme          VARCHAR(50)  NOT NULL DEFAULT 'lotus_night',
  border_style   VARCHAR(50)  NOT NULL DEFAULT 'traditional_1',
  accent_color   VARCHAR(7)   NOT NULL DEFAULT '#D4AF37',
  animation_set  VARCHAR(50)  NOT NULL DEFAULT 'lanterns_petals',
  view_count     INTEGER      NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW() + INTERVAL '365 days'
);

CREATE INDEX idx_cards_slug ON cards(slug);
CREATE INDEX idx_cards_created_at ON cards(created_at DESC);
