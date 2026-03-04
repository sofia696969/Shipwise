-- Create goods table
CREATE TABLE IF NOT EXISTS goods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  volume DECIMAL(10, 2) NOT NULL,
  fragile BOOLEAN DEFAULT FALSE,
  hazardous BOOLEAN DEFAULT FALSE,
  category TEXT NOT NULL,
  industry TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goods_shipment ON goods(shipment_id);
CREATE INDEX idx_goods_type ON goods(type);

-- Enable RLS
ALTER TABLE goods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goods
CREATE POLICY "Users can view goods in their organization"
  ON goods FOR SELECT
  USING (shipment_id IN (SELECT id FROM shipments WHERE organization_id IN (SELECT organization_id FROM staff_users WHERE user_id = auth.uid())));
