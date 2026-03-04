-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tracking_number TEXT NOT NULL UNIQUE,
  status TEXT CHECK (status IN ('pending', 'in_transit', 'delivered', 'delayed', 'cancelled')) DEFAULT 'pending',
  carrier_id UUID REFERENCES carriers(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  estimated_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shipments_organization ON shipments(organization_id);
CREATE INDEX idx_shipments_carrier ON shipments(carrier_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);

-- Enable RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipments
CREATE POLICY "Users can view shipments in their organization"
  ON shipments FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM staff_users WHERE user_id = auth.uid()));
