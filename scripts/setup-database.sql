-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_session_id VARCHAR(255) UNIQUE,
  plan_type VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  headshots_included INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  purchase_id INTEGER REFERENCES purchases(id),
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(50),
  outfits TEXT[],
  backgrounds TEXT[],
  uploaded_photos TEXT[],
  status VARCHAR(50) DEFAULT 'pending',
  generated_photos TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user if needed
INSERT INTO users (email, name, image) 
VALUES ('test@example.com', 'Test User', '') 
ON CONFLICT (email) DO NOTHING;
