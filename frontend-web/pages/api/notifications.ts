import type { NextApiRequest, NextApiResponse } from "next";
import { PERMISSIONS, requireApiPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    const guarded = await requireApiPermission(
      req,
      res,
      PERMISSIONS.NOTIFICATIONS_READ,
    );
    if (!guarded) return;
    const { ctx } = guarded;

    const query = (ctx.supabase as any)
      .from("notification_outbox")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (ctx.user.organization_id) {
      query.eq("organization_id", ctx.user.organization_id);
    } else {
      query.eq("recipient_user_id", ctx.authUserId);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? []);
  } catch (error) {
    console.error("Notifications API error:", error);
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
}
