export interface Organization {
  organization_id: string;
  name: string;
  industry_type: string | null;
  status: string | null;
}

export interface StaffUser {
  user_id: string;
  organization_id: string;
  email: string;
  role: string;
  is__active: boolean | null;
  created_at: string;
}

export interface Shipment {
  shipment_id: string;
  organization_id: string;
  carrier_id: string | null;
  origin_country: string;
  destination_country: string;
  status: string;
  planned_eta: string | null;
  actual_eta: string | null;
  created_at: string;
}

export interface Good {
  good_id: string;
  organization_id: string;
  name: string;
  category: string;
  weight_kg: number | null;
  volume_m3: number | null;
  is_fragile: boolean | null;
  is_hazardous: boolean | null;
  created_at: string;
}

export interface ShipmentGood {
  shipment_id: string;
  good_id: string;
  quantity: number;
}

export interface Carrier {
  carrier_id: string;
  name: string;
  countey: string | null;
  average_delay_days: number | null;
  relability_score: number | null;
}

export interface Incident {
  incident_id: string;
  shipment_id: string;
  incident_type: string;
  description: string;
  reported_by: string | null;
  reported_at: string | null;
  severity: string;
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  timestamp: string;
  old_value: string | null;
  new_value: string | null;
}
