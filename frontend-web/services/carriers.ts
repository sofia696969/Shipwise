import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export async function fetchCarriers() {
  const { data, error } = await supabase
    .from<Tables["carriers"]>("carriers")
    .select("*");
  if (error) throw error;
  return data ?? [];
}
