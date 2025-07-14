-- Create webhook_logs table for debugging
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  project_id INTEGER,
  webhook_type VARCHAR(50),
  method VARCHAR(10),
  headers JSONB,
  body JSONB,
  query_params JSONB,
  raw_body TEXT,
  parsed_data JSONB,
  status VARCHAR(50),
  error_message TEXT,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_webhook_logs_project_id ON webhook_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_type ON webhook_logs(webhook_type);
