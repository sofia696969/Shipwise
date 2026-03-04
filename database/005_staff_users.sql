-- Create organizations table (if not exists)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create staff_users table
CREATE TABLE IF NOT EXISTS staff_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('staff', 'supervisor', 'hr', 'admin')) NOT NULL DEFAULT 'staff',
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_users_user_id ON staff_users(user_id);
CREATE INDEX idx_staff_users_organization_id ON staff_users(organization_id);
CREATE INDEX idx_staff_users_role ON staff_users(role);

-- Enable RLS
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_users
CREATE POLICY "Users can view their own staff_user record"
  ON staff_users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view staff_users in their organization"
  ON staff_users FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM staff_users WHERE organization_id = staff_users.organization_id));

-- RLS Policies for organizations
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  USING (id IN (SELECT organization_id FROM staff_users WHERE user_id = auth.uid()));
