-- Create wizard_sessions table to store temporary wizard data
CREATE TABLE IF NOT EXISTS wizard_sessions (
  id VARCHAR(255) PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  uploaded_photos JSONB NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- Create index for cleanup
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_expires_at ON wizard_sessions(expires_at);

-- Create index for user email lookups
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_user_email ON wizard_sessions(user_email);
