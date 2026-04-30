import type { NextApiRequest, NextApiResponse } from "next";
import { PERMISSIONS, requireApiPermission } from "@/lib/rbac";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const guarded = await requireApiPermission(
      req,
      res,
      PERMISSIONS.AUDIT_LOGS_READ,
    );
    if (!guarded) return;
    const { ctx } = guarded;

    let query = (ctx.supabase as any)
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (ctx.user.organization_id) {
      query = query.eq("organization_id", ctx.user.organization_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data ?? []);
  } catch (error) {
    console.error("Logs fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
}
