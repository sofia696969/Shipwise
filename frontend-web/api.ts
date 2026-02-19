export const API_BASE = "http://localhost:5000/api";

export async function ping() {
  const res = await fetch(`${API_BASE}/ping`);
  if (!res.ok) throw new Error("API Error");
  return res.json();
}
