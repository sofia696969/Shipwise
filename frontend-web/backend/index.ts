import { supabase } from '@/lib/supabase';

export async function fetchJson(path: string, init?: RequestInit) {
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

    const controller = new AbortController();
    const timeoutMs = 15000;
    const timeoutId: ReturnType<typeof setTimeout> | null =
      init?.signal == null
        ? setTimeout(() => controller.abort(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
        : null;

    const res = await fetch(path, {
      cache: 'no-store',
      ...init,
      signal: init?.signal ?? controller.signal,
      headers: {
        ...headers,
        ...(init?.headers ?? {}),
      },
    }).finally(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });

    if (!res.ok) {
      let details = "";
      try {
        const body = await res.json();
        details = body?.error ? ` - ${body.error}` : "";
      } catch {
        // Ignore non-JSON bodies.
      }
      throw new Error(`${path} fetch failed: ${res.status} ${res.statusText}${details}`);
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

// Goods
export const getGoods = () => fetchJson('/api/goods');

// Users
export const getUsers = () => fetchJson('/api/users');

// Audit & logs
export const getAuditLogs = () => fetchJson('/api/audit-logs');
export const getNotifications = () => fetchJson('/api/notifications');
export const getOrganizationRequests = () => fetchJson('/api/organization-requests');
export const getMyOrganizationProfile = () => fetchJson('/api/organizations/me');
export const updateMyOrganizationProfile = (payload: {
  name?: string;
  industry_type?: string;
  status?: string;
}) =>
  fetchJson('/api/organizations/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
export const submitOrganizationRequest = (payload: {
  company_name: string;
  industry_type?: string | null;
}) =>
  fetchJson('/api/organization-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
export const decideOrganizationRequest = (
  requestId: string,
  decision: 'approved' | 'rejected',
) =>
  fetchJson(`/api/organization-requests/${requestId}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision }),
  });