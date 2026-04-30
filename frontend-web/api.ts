/** Same origin as the app (Vite dev or production Node server). */
export const API_BASE = "/api";

export async function ping() {
  const res = await fetch(`${API_BASE}/ping`);
  if (!res.ok) throw new Error("API Error");
  return res.json();
}
