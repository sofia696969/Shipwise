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
      PERMISSIONS.CARRIERS_READ,
      { requireOrganization: true },
    );
    if (!guarded) return;
    const { ctx } = guarded;
    const currentUser = ctx.user;
    const supabase = ctx.supabase as any;

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("carriers")
        .select("*")
        .eq("organization_id", currentUser.organization_id)
        .order("name", { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data ?? []);
    }

    if (req.method === "POST") {
      if (!hasPermission(currentUser, PERMISSIONS.CARRIERS_WRITE)) {
        return res.status(403).json({ error: "Only staff can create carriers" });
      }

      const { name, countey, average_delay_days, relability_score } = req.body ?? {};
      if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Carrier name is required" });
      }

      const payload = {
        name,
        countey: countey ?? null,
        average_delay_days:
          average_delay_days === undefined || average_delay_days === null
            ? null
            : Number(average_delay_days),
        relability_score:
          relability_score === undefined || relability_score === null
            ? null
            : Number(relability_score),
        organization_id: currentUser.organization_id,
      };

      const { data, error } = await supabase
        .from("carriers")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    }

    if (req.method === "PUT" || req.method === "PATCH") {
      if (!hasPermission(currentUser, PERMISSIONS.CARRIERS_WRITE)) {
        return res.status(403).json({ error: "Only staff can update carriers" });
      }

      const carrierId = req.body?.carrier_id;
      if (!carrierId || typeof carrierId !== "string") {
        return res.status(400).json({ error: "carrier_id is required" });
      }

      const updates: Record<string, unknown> = {};
      if ("name" in req.body) updates.name = req.body.name;
      if ("countey" in req.body) updates.countey = req.body.countey ?? null;
      if ("average_delay_days" in req.body) {
        updates.average_delay_days =
          req.body.average_delay_days === null ? null : Number(req.body.average_delay_days);
      }
      if ("relability_score" in req.body) {
        updates.relability_score =
          req.body.relability_score === null ? null : Number(req.body.relability_score);
      }
      // Never accept organization_id from client.
      updates.organization_id = currentUser.organization_id;

      const { data, error } = await supabase
        .from("carriers")
        .update(updates)
        .eq("carrier_id", carrierId)
        .eq("organization_id", currentUser.organization_id)
        .select("*")
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      if (!hasPermission(currentUser, PERMISSIONS.CARRIERS_WRITE)) {
        return res.status(403).json({ error: "Only staff can delete carriers" });
      }

      const carrierId =
        (typeof req.query.carrier_id === "string" && req.query.carrier_id) ||
        req.body?.carrier_id;
      if (!carrierId || typeof carrierId !== "string") {
        return res.status(400).json({ error: "carrier_id is required" });
      }

      const { error } = await supabase
        .from("carriers")
        .delete()
        .eq("carrier_id", carrierId)
        .eq("organization_id", currentUser.organization_id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(204).end();
    }

    res.setHeader("Allow", "GET,POST,PUT,PATCH,DELETE");
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Carriers fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch carriers" });
  }
}
