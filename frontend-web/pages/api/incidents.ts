import type { NextApiRequest, NextApiResponse } from "next";
import { PERMISSIONS, hasPermission, requireApiPermission } from "@/lib/rbac";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const guarded = await requireApiPermission(
      req,
      res,
      PERMISSIONS.INCIDENTS_READ,
      { requireOrganization: true },
    );
    if (!guarded) return;
    const { ctx } = guarded;
    const currentUser = ctx.user;
    const supabase = ctx.supabase as any;
    const authUserId = ctx.authUserId;

    if (req.method === "GET") {
      const { data: shipments, error: shipmentsError } = await supabase
        .from("shipments")
        .select("shipment_id")
        .eq("organization_id", currentUser.organization_id);

      if (shipmentsError) {
        return res.status(500).json({ error: shipmentsError.message });
      }

      const shipmentIds = shipments?.map((shipment) => shipment.shipment_id) ?? [];
      if (shipmentIds.length === 0) {
        return res.status(200).json([]);
      }

      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .in("shipment_id", shipmentIds)
        .order("reported_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data ?? []);
    }

    if (req.method === "POST") {
      if (!hasPermission(currentUser, PERMISSIONS.INCIDENTS_WRITE)) {
        return res.status(403).json({ error: "Only staff can create incidents" });
      }

      const { shipment_id, incident_type, description, severity } = req.body ?? {};
      if (!shipment_id || typeof shipment_id !== "string") {
        return res.status(400).json({ error: "shipment_id is required" });
      }
      if (!incident_type || typeof incident_type !== "string") {
        return res.status(400).json({ error: "incident_type is required" });
      }
      if (!description || typeof description !== "string") {
        return res.status(400).json({ error: "description is required" });
      }

      const { data: shipment, error: shipmentError } = await supabase
        .from("shipments")
        .select("shipment_id, organization_id")
        .eq("shipment_id", shipment_id)
        .eq("organization_id", currentUser.organization_id)
        .maybeSingle();

      if (shipmentError) {
        return res.status(500).json({ error: shipmentError.message });
      }
      if (!shipment) {
        return res
          .status(403)
          .json({ error: "Shipment does not belong to your organization" });
      }

      const payload = {
        shipment_id,
        incident_type,
        description,
        severity: typeof severity === "string" ? severity : "medium",
        reported_by: authUserId,
      };

      const { data, error } = await supabase
        .from("incidents")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    }

    res.setHeader("Allow", "GET,POST");
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Incidents fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch incidents" });
  }
}
