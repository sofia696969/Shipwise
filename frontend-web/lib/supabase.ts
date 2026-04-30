import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing");
}

export type OrganizationRecord = {
  organization_id: string;
  name: string;
  industry_type: string | null;
  status: string | null;
};

export type UserRecord = {
  user_id: string;
  organization_id: string;
  email: string;
  role: "staff" | "manager" | "hr" | string;
  is_super_admin: boolean | null;
  is__active: boolean | null;
  created_at: string;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    persistSession: true,
    detectSessionInUrl: true,
  },
});