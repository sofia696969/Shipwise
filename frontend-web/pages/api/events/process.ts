import type { NextApiRequest, NextApiResponse } from "next";
import { queueNotification } from "@/lib/notifications";
import { PERMISSIONS, requireApiPermission } from "@/lib/rbac";
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

    const { data: events, error } = await (ctx.supabase as any)
      .from("domain_events")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) return res.status(500).json({ error: error.message });

    let processed = 0;
    for (const event of events ?? []) {
      try {
        const payload = (event.payload ?? {}) as Record<string, unknown>;

        if (event.event_type === "company.approved") {
          await queueNotification({
            supabase: ctx.supabase,
            organizationId: event.organization_id ?? null,
            recipientUserId: (payload.requester_user_id as string) ?? null,
            recipientEmail: (payload.requester_email as string) ?? null,
            type: "organization.approved",
            title: "Organization approved",
            body: `${String(payload.company_name ?? "Your organization")} has been approved.`,
            channels: ["in_app", "email"],
            metadata: payload,
          });
        }

        if (event.event_type === "company.rejected") {
          await queueNotification({
            supabase: ctx.supabase,
            recipientUserId: (payload.requester_user_id as string) ?? null,
            recipientEmail: (payload.requester_email as string) ?? null,
            type: "organization.rejected",
            title: "Organization request rejected",
            body: `Your request for ${String(payload.company_name ?? "your organization")} was rejected.`,
            channels: ["in_app", "email"],
            metadata: payload,
          });
        }

        if (event.event_type === "user.created") {
          await queueNotification({
            supabase: ctx.supabase,
            organizationId: event.organization_id ?? null,
            recipientUserId: event.aggregate_id,
            recipientEmail: (payload.email as string) ?? null,
            type: "user.invited",
            title: "You were invited to ShipWise",
            body: `Your role is ${String(payload.role ?? "staff")}.`,
            channels: ["in_app", "email"],
            metadata: payload,
          });
        }

        if (event.event_type === "shipment.updated" && payload.status_changed === true) {
          await queueNotification({
            supabase: ctx.supabase,
            organizationId: event.organization_id ?? null,
            type: "shipment.status_updated",
            title: "Shipment status updated",
            body: `Shipment ${event.aggregate_id} status changed to ${String(payload.status ?? "updated")}.`,
            channels: ["in_app", "email"],
            metadata: payload,
          });
        }

        await (ctx.supabase as any)
          .from("domain_events")
          .update({ status: "processed", processed_at: new Date().toISOString() })
          .eq("event_id", event.event_id);
        processed += 1;
      } catch (eventError) {
        await (ctx.supabase as any)
          .from("domain_events")
          .update({ status: "failed", processed_at: new Date().toISOString() })
          .eq("event_id", event.event_id);
        await reportError(eventError, {
          route: "api/events/process",
          event_id: event.event_id,
          event_type: event.event_type,
        });
      }
    }

    return res.status(200).json({ queued: (events ?? []).length, processed });
  } catch (error) {
    await reportError(error, { route: "api/events/process" });
    return res.status(500).json({ error: "Failed to process domain events" });
  }
}
