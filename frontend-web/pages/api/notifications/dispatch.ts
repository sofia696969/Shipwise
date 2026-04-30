import type { NextApiRequest, NextApiResponse } from "next";
import { PERMISSIONS, requireApiPermission } from "@/lib/rbac";
import { getEmailProvider } from "@/lib/emailProvider";
import { reportError } from "@/lib/observability";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    const guarded = await requireApiPermission(
      req,
      res,
      PERMISSIONS.SUPERADMIN_PORTAL_ACCESS,
    );
    if (!guarded) return;
    const { ctx } = guarded;

    const { data: pending, error } = await (ctx.supabase as any)
      .from("notification_outbox")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) return res.status(500).json({ error: error.message });

    const emailProvider = getEmailProvider();
    let sent = 0;
    for (const row of pending ?? []) {
      try {
        if ((row.channels ?? []).includes("email") && row.recipient_email) {
          await emailProvider.send({
            to: row.recipient_email,
            subject: row.title,
            text: row.body,
          });
        }

        await (ctx.supabase as any)
          .from("notification_outbox")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
          })
          .eq("notification_id", row.notification_id);
        sent += 1;
      } catch (dispatchError) {
        await (ctx.supabase as any)
          .from("notification_outbox")
          .update({ status: "failed" })
          .eq("notification_id", row.notification_id);
        await reportError(dispatchError, {
          route: "api/notifications/dispatch",
          notification_id: row.notification_id,
        });
      }
    }

    return res.status(200).json({ queued: (pending ?? []).length, sent });
  } catch (error) {
    await reportError(error, { route: "api/notifications/dispatch" });
    return res.status(500).json({ error: "Failed to dispatch notifications" });
  }
}
