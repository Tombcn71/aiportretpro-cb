-- Create purchases table if it doesn't exist
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_session_id VARCHAR(255) UNIQUE,
  plan_type VARCHAR(50),
  amount INTEGER,
  headshots_included INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_session_id);

-- Log the creation
DO $$
BEGIN
  RAISE NOTICE 'Purchases table created or already exists';
END $$;
