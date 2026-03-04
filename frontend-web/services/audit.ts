import { supabase } from "@/lib/supabase";
import type { Tables } from "@/lib/supabase";

export async function fetchAuditLogs() {
  const { data, error } = await supabase
    .from<Tables["audit"]>("audit")
    .select("*");
  if (error) throw error;
  return data ?? [];
}
