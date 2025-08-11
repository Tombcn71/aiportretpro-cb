-- Create models table for Astria integration (compatible with your existing structure)
CREATE TABLE IF NOT EXISTS models (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- gender/type
  status VARCHAR(50) DEFAULT 'training',
  astria_tune_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create samples table for uploaded images
CREATE TABLE IF NOT EXISTS samples (
  id SERIAL PRIMARY KEY,
  modelId INTEGER REFERENCES models(id) ON DELETE CASCADE,
  uri TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_models_user_id ON models(user_id);
CREATE INDEX IF NOT EXISTS idx_models_status ON models(status);
CREATE INDEX IF NOT EXISTS idx_samples_model_id ON samples(modelId);

-- Verify the schema
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name IN ('models', 'samples')
ORDER BY table_name, ordinal_position;
