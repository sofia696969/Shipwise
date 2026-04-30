import type { NextApiRequest, NextApiResponse } from "next";
import { PERMISSIONS, requireApiPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const guardedRead = await requireApiPermission(
      req,
      res,
      PERMISSIONS.HR_PORTAL_ACCESS,
      { requireOrganization: true },
    );
    if (!guardedRead) return;
    const { ctx } = guardedRead;
    const organizationId = ctx.user.organization_id;

    if (req.method === "GET") {
      const { data, error } = await (ctx.supabase as any)
        .from("organizations")
        .select("*")
        .eq("organization_id", organizationId)
        .maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === "PATCH") {
      const { name, industry_type, status } = req.body ?? {};
      const updates: Record<string, unknown> = {};
      if (typeof name === "string") updates.name = name;
      if (typeof industry_type === "string") updates.industry_type = industry_type;
      if (typeof status === "string") updates.status = status;

      const { data, error } = await (ctx.supabase as any)
        .from("organizations")
        .update(updates)
        .eq("organization_id", organizationId)
        .select("*")
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    res.setHeader("Allow", "GET,PATCH");
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Organization profile API error:", error);
    return res.status(500).json({ error: "Failed to process organization profile request" });
  }
}
