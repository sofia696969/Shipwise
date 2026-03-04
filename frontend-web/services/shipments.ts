import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export async function fetchShipments() {
  const { data, error } = await supabase
    .from<Tables["shipments"]>("shipments")
    .select("*, carriers(*), shipment_goods(*)");
  if (error) throw error;
  return data ?? [];
}
