import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export async function fetchGoods() {
  const { data, error } = await supabase
    .from<Tables["goods"]>("goods")
    .select("*");
  if (error) throw error;
  return data ?? [];
}
