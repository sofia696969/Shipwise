const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing");
}

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export type Tables = {
  shipments: {
    id: string;
    created_at: string;
    tracking_number: string;
    status: "pending" | "in_transit" | "delivered" | "delayed" | "cancelled";
    carrier_id: string;
    origin: string;
    destination: string;
    estimated_delivery: string;
    actual_delivery: string | null;
    created_by: string;
    updated_at: string;
  };
  goods: {
    id: string;
    shipment_id: string;
    type: string;
    description: string;
    weight: number;
    volume: number;
    fragile: boolean;
    hazardous: boolean;
    category: string;
    created_at: string;
  };
  carriers: {
    id: string;
    name: string;
    contact_email: string;
    phone: string;
    reliability_score: number;
    total_shipments: number;
    successful_deliveries: number;
    created_at: string;
  };
  incidents: {
    id: string;
    shipment_id: string;
    type: "damage" | "customs" | "delay" | "other";
    description: string;
    severity: "low" | "medium" | "high";
    reported_by: string;
    created_at: string;
  };
  staff_users: {
    id: string;
    user_id: string;
    role: "staff" | "supervisor" | "hr";
    department: string;
    created_at: string;
  };
};

