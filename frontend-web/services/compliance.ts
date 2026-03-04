import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export async function fetchCompliance() {
  const { data, error } = await supabase
    .from<Tables["compliance"]>("compliance")
    .select("*");
  if (error) throw error;
  return data ?? [];
}
