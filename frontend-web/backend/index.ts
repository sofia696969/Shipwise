import { supabase } from '@/lib/supabase';

export async function fetchJson(path: string) {
  try {
    // Get the current session to get the access token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if we have a session
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const res = await fetch(path, {
      cache: 'no-store',
      headers,
    });

    if (!res.ok) {
      throw new Error(`${path} fetch failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Shipment-related endpoints
export const getShipments = () => fetchJson('/api/shipments');
export const getCarriers = () => fetchJson('/api/carriers');
export const getIncidents = () => fetchJson('/api/incidents');

// Goods & compliance
export const getGoods = () => fetchJson('/api/goods');
export const getComplianceChecks = () => fetchJson('/api/compliance');

// Users
export const getUsers = () => fetchJson('/api/users');

// Documents & ML
export const getDocuments = () => fetchJson('/api/documents');
export const getMLPredictions = () => fetchJson('/api/ml-predictions');

// Audit & logs
export const getAuditLogs = () => fetchJson('/api/audit-logs');