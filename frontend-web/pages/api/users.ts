import type { NextApiRequest, NextApiResponse } from "next";
import { PERMISSIONS, requireApiPermission } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";
import { publishDomainEvent } from "@/lib/events";
import { reportError } from "@/lib/observability";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const guarded = await requireApiPermission(
      req,
      res,
      PERMISSIONS.USERS_MANAGE,
      { requireOrganization: true },
    );
    if (!guarded) return;
    const { ctx } = guarded;
    const currentUser = ctx.user;
    const supabase = ctx.supabase as any;

    if (req.method === "POST") {
      const { user_id, email, role, is__active } = req.body ?? {};
      if (!user_id || typeof user_id !== "string") {
        return res.status(400).json({ error: "user_id is required" });
      }
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "email is required" });
      }
      if (!["hr", "manager", "staff"].includes(role)) {
        return res.status(400).json({ error: "role must be hr, manager, or staff" });
      }

      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            user_id,
            organization_id: currentUser.organization_id,
            email,
            role,
            is__active: is__active ?? true,
          },
          { onConflict: "user_id" },
        )
        .select("user_id, organization_id, email, role, is__active, created_at")
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      await writeAuditLog(supabase, {
        actorUserId: ctx.authUserId,
        organizationId: currentUser.organization_id,
        action: "user.created",
        targetType: "user",
        targetId: user_id,
        metadata: { role },
      });
      await publishDomainEvent({
        supabase,
        organizationId: currentUser.organization_id,
        actorUserId: ctx.authUserId,
        eventType: "user.created",
        aggregateType: "user",
        aggregateId: user_id,
        payload: { email, role },
      });
      return res.status(201).json(data);
    }

    if (req.method === "PATCH") {
      const { user_id, role, is__active } = req.body ?? {};
      if (!user_id || typeof user_id !== "string") {
        return res.status(400).json({ error: "user_id is required" });
      }

      const updates: Record<string, unknown> = {};
      if (role !== undefined) {
        if (!["hr", "manager", "staff"].includes(role)) {
          return res.status(400).json({ error: "role must be hr, manager, or staff" });
        }
        updates.role = role;
      }
      if (is__active !== undefined) {
        updates.is__active = Boolean(is__active);
      }

      const query = supabase
        .from("users")
        .update(updates)
        .eq("user_id", user_id);

      query.eq("organization_id", currentUser.organization_id);

      const { data, error } = await query
        .select("user_id, organization_id, email, role, is__active, created_at")
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (role !== undefined) {
        await writeAuditLog(supabase, {
          actorUserId: ctx.authUserId,
          organizationId: currentUser.organization_id,
          action: "user.role_changed",
          targetType: "user",
          targetId: user_id,
          metadata: { role },
        });
        await publishDomainEvent({
          supabase,
          organizationId: currentUser.organization_id,
          actorUserId: ctx.authUserId,
          eventType: "user.role_changed",
          aggregateType: "user",
          aggregateId: user_id,
          payload: { role },
        });
      }
      return res.status(200).json(data);
    }

    if (req.method !== "GET") {
      res.setHeader("Allow", "GET,POST,PATCH");
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    let query = supabase
      .from("users")
      .select("user_id, organization_id, email, role, is__active, created_at")
      .order("created_at", { ascending: false });

    query = query.eq("organization_id", currentUser.organization_id);

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data ?? []);
  } catch (error) {
    await reportError(error, { route: "api/users" });
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}
