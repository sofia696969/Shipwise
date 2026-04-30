import type { NextApiRequest, NextApiResponse } from "next";
import { writeAuditLog } from "@/lib/audit";
import { publishDomainEvent } from "@/lib/events";
import { reportError } from "@/lib/observability";
import { PERMISSIONS, hasPermission, requireApiPermission } from "@/lib/rbac";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const guarded = await requireApiPermission(
      req,
      res,
      PERMISSIONS.SHIPMENTS_READ,
      { requireOrganization: true },
    );
    if (!guarded) return;
    const { ctx } = guarded;

    if (req.method === "GET") {
      const query = (ctx.supabase as any)
        .from("shipments")
        .select("*")
        .eq("organization_id", ctx.user.organization_id)
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data ?? []);
    }

    if (req.method === "POST") {
      if (!hasPermission(ctx.user, PERMISSIONS.SHIPMENTS_WRITE)) {
        return res.status(403).json({ error: "Only staff can create shipments" });
      }
      const payload = {
        shipment_id: req.body?.shipment_id ?? `shp_${crypto.randomUUID()}`,
        origin_country: req.body?.origin_country ?? null,
        destination_country: req.body?.destination_country ?? null,
        carrier_id: req.body?.carrier_id ?? null,
        planned_eta: req.body?.planned_eta ?? null,
        actual_eta: req.body?.actual_eta ?? null,
        status: req.body?.status ?? "pending",
        organization_id: ctx.user.organization_id,
        created_by: ctx.authUserId,
      };

      const { data, error } = await (ctx.supabase as any)
        .from("shipments")
        .insert(payload)
        .select("*")
        .single();
      if (error) return res.status(500).json({ error: error.message });

      await writeAuditLog(ctx.supabase, {
        actorUserId: ctx.authUserId,
        organizationId: ctx.user.organization_id,
        action: "shipment.created",
        targetType: "shipment",
        targetId: data.shipment_id,
        metadata: { status: data.status },
      });
      await publishDomainEvent({
        supabase: ctx.supabase,
        organizationId: ctx.user.organization_id,
        actorUserId: ctx.authUserId,
        eventType: "shipment.created",
        aggregateType: "shipment",
        aggregateId: data.shipment_id,
        payload: { status: data.status },
      });

      return res.status(201).json(data);
    }

    if (req.method === "PATCH" || req.method === "PUT") {
      if (!hasPermission(ctx.user, PERMISSIONS.SHIPMENTS_WRITE)) {
        return res.status(403).json({ error: "Only staff can update shipments" });
      }
      const shipmentId = req.body?.shipment_id;
      if (!shipmentId || typeof shipmentId !== "string") {
        return res.status(400).json({ error: "shipment_id is required" });
      }

      const updates: Record<string, unknown> = {};
      if ("origin_country" in req.body) updates.origin_country = req.body.origin_country ?? null;
      if ("destination_country" in req.body) updates.destination_country = req.body.destination_country ?? null;
      if ("carrier_id" in req.body) updates.carrier_id = req.body.carrier_id ?? null;
      if ("planned_eta" in req.body) updates.planned_eta = req.body.planned_eta ?? null;
      if ("actual_eta" in req.body) updates.actual_eta = req.body.actual_eta ?? null;
      if ("status" in req.body) updates.status = req.body.status ?? "pending";

      const { data, error } = await (ctx.supabase as any)
        .from("shipments")
        .update(updates)
        .eq("shipment_id", shipmentId)
        .eq("organization_id", ctx.user.organization_id)
        .select("*")
        .single();
      if (error) return res.status(500).json({ error: error.message });

      await writeAuditLog(ctx.supabase, {
        actorUserId: ctx.authUserId,
        organizationId: ctx.user.organization_id,
        action: "shipment.updated",
        targetType: "shipment",
        targetId: shipmentId,
        metadata: { status: data.status },
      });
      await publishDomainEvent({
        supabase: ctx.supabase,
        organizationId: ctx.user.organization_id,
        actorUserId: ctx.authUserId,
        eventType: "shipment.updated",
        aggregateType: "shipment",
        aggregateId: shipmentId,
        payload: { status: data.status, status_changed: "status" in updates },
      });

      return res.status(200).json(data);
    }

    res.setHeader("Allow", "GET,POST,PATCH,PUT");
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    await reportError(error, { route: "api/shipments" });
    return res.status(500).json({ error: "Failed to fetch shipments" });
  }
}
