import type { NextApiRequest, NextApiResponse } from "next";
import { PERMISSIONS, requireApiPermission } from "@/lib/rbac";

/**
 * Safe diagnostics: no secrets. Use to confirm Next.js sees the same Supabase
 * project you configured in the Supabase Dashboard + Google Cloud.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const guarded = await requireApiPermission(req, res, PERMISSIONS.SUPERADMIN_PORTAL_ACCESS);
  if (!guarded) return;

  const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  let host = "";
  try {
    host = raw ? new URL(raw).hostname : "";
  } catch {
    host = "";
  }

  const googleRedirectUri = raw ? `${raw.replace(/\/$/, "")}/auth/v1/callback` : "";

  res.status(200).json({
    supabaseHost: host,
    googleAuthorizedRedirectUri: googleRedirectUri,
    anonKeyPresent: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length),
  });
}
