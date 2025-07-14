-- Create webhook_logs table for debugging webhook issues
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  webhook_type VARCHAR(50) NOT NULL,
  project_id INTEGER,
  method VARCHAR(10),
  raw_body TEXT,
  parsed_data JSONB,
  status VARCHAR(50) NOT NULL,
  error_message TEXT,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_webhook_logs_project_id ON webhook_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status);

-- Add some sample data for testing
INSERT INTO webhook_logs (webhook_type, project_id, status, error_message) 
VALUES ('prompt', 39, 'test', 'This is a test log entry')
ON CONFLICT DO NOTHING;
