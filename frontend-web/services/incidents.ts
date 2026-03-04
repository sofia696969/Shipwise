import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export async function fetchIncidents() {
  const { data, error } = await supabase
    .from<Tables["incidents"]>("incidents")
    .select("*");
  if (error) throw error;
  return data ?? [];
}
