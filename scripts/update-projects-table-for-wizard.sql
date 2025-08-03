-- Update bestaande projects tabel voor nieuwe flow
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_session_id VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS photo_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255);

-- Update status enum om nieuwe statussen te ondersteunen
-- Nieuwe flow: created -> gender_selected -> photos_uploaded -> paid -> training -> completed -> error
-- Je bestaande statussen blijven werken: training -> completed -> error

-- Index voor betere performance bij webhook lookups
CREATE INDEX IF NOT EXISTS idx_projects_status_email ON projects(status, guest_email);
CREATE INDEX IF NOT EXISTS idx_projects_session ON projects(user_session_id);
CREATE INDEX IF NOT EXISTS idx_projects_stripe_session ON projects(stripe_session_id);

-- Project status flow: created -> photos_uploaded -> paid -> training -> completed -> error

-- Optional: Add project_steps table for detailed tracking
CREATE TABLE IF NOT EXISTS project_steps (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  step_name VARCHAR(50) NOT NULL, -- 'name_created', 'gender_selected', 'photos_uploaded', 'payment_completed'
  completed_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Session tracking for anonymous users
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  converted_to_user_id INTEGER REFERENCES users(id)
);
