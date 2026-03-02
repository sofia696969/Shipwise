// Simple wrapper around Supabase queries used by the frontend.
// The real backend code lives in ../backend but the frontend uses the
// Supabase client directly for now.  Exported functions return `any[]`
// so that the existing pages (which rely on a bunch of fields that
// aren't present in the supabase schema yet) type‑check without
// introducing a bunch of intermediate domain types.

import { supabase } from "@/lib/supabase";

async function fetchTable<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("*");
  if (error) {
    console.error(`error fetching ${table}:`, error);
    throw error;
  }
  return (data || []) as T[];
}

export async function getCarriers(): Promise<any[]> {
  return fetchTable<any>("carriers");
}

export async function getShipments(): Promise<any[]> {
  return fetchTable<any>("shipments");
}

export async function getGoods(): Promise<any[]> {
  return fetchTable<any>("goods");
}

export async function getIncidents(): Promise<any[]> {
  return fetchTable<any>("incidents");
}

// There isn't a `users` table in supabase; the frontend pages expect a
// list of user-like objects.  For the sake of compilation we just pull
// the staff_users table and cast it to `any`.
export async function getUsers(): Promise<any[]> {
  return fetchTable<any>("staff_users");
}
