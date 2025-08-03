-- Create wizard_sessions table to temporarily store wizard data
CREATE TABLE IF NOT EXISTS wizard_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  uploaded_photos TEXT NOT NULL, -- JSON array of photo URLs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_session_id ON wizard_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_expires_at ON wizard_sessions(expires_at);
