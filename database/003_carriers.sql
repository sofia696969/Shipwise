-- Create carriers table
CREATE TABLE IF NOT EXISTS carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  contact_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  reliability_score DECIMAL(3, 2) DEFAULT 0,
  total_shipments INTEGER DEFAULT 0,
  successful_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carriers_name ON carriers(name);
