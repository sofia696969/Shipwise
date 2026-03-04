// support both Next.js and Vite style env vars in this mixed workspace
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  "";

if (!supabaseUrl || !supabaseAnonKey) {
  // still throw so developer notices the mis‑configuration early
  throw new Error("Supabase environment variables are missing");
}

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export type Tables = {
  organizations: {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  };
  staff_users: {
    user_id: string;
    role: "staff" | "supervisor" | "hr" | "admin";
    full_name: string;
    department: string;
    is_active: boolean;
    created_at: string;
  };
  shipments: {
    id: string;
    organization_id: string;
    carrier_id: string;
    origin_county: string;
    destination_country: string;
    status: "pending" | "in_transit" | "delivered" | "delayed" | "cancelled";
    planned_eta: string;
    actual_eta: string | null;
    estimated_cost: number;
    actual_cost: number | null;
    created_at: string;
  };
  goods: {
    id: string;
    organisation_id: string;
    name: string;
    category: string;
    weight_kg: number;
    volume_m3: number;
    is_fragile: boolean;
    is_hazardous: boolean;
    industry_category: string;
    created_at: string;
  };
  carriers: {
    id: string;
    name: string;
    country: string;
    reliability_score: number;
    created_at: string;
  };
  incidents: {
    id: string;
    shipment_id: string;
    incident_type: string;
    description: string;
    severity: "low" | "medium" | "high";
    reported_by: string;
    reported_at: string;
  };
};

