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
      PERMISSIONS.GOODS_READ,
      { requireOrganization: true },
    );
    if (!guarded) return;
    const { ctx } = guarded;

    const query = (ctx.supabase as any)
      .from("goods")
      .select("*")
      .eq("organization_id", ctx.user.organization_id)
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data ?? []);
  } catch (error) {
    console.error("Goods fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch goods" });
  }
}
