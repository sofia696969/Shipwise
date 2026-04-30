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
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res
        .status(405)
        .json({ error: `Method ${req.method} not allowed` });
    }

    const guarded = await requireApiPermission(
      req,
      res,
      PERMISSIONS.ORGANIZATION_REQUESTS_DECIDE,
    );
    if (!guarded) return;
    const { ctx } = guarded;

    const requestId = req.query.requestId;
    if (typeof requestId !== "string" || requestId.length === 0) {
      return res.status(400).json({ error: "requestId is required" });
    }

    const decision = req.body?.decision;
    if (decision !== "approved" && decision !== "rejected") {
      return res
        .status(400)
        .json({ error: "decision must be approved or rejected" });
    }

    const { data: requestRow, error: requestError } = await (ctx.supabase as any)
      .from("organization_requests")
      .select("*")
      .eq("request_id", requestId)
      .maybeSingle();

    if (requestError) return res.status(500).json({ error: requestError.message });
    if (!requestRow) return res.status(404).json({ error: "Request not found" });

    if (decision === "rejected") {
      const { data, error } = await (ctx.supabase as any)
        .from("organization_requests")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: ctx.authUserId,
        })
        .eq("request_id", requestId)
        .select("*")
        .single();

      if (error) return res.status(500).json({ error: error.message });
      await writeAuditLog(ctx.supabase, {
        actorUserId: ctx.authUserId,
        organizationId: data?.organization_id ?? null,
        action: "company.rejected",
        targetType: "organization_request",
        targetId: requestId,
        metadata: { company_name: requestRow.company_name },
      });
      await publishDomainEvent({
        supabase: ctx.supabase,
        actorUserId: ctx.authUserId,
        eventType: "company.rejected",
        aggregateType: "organization_request",
        aggregateId: requestId,
        payload: {
          company_name: requestRow.company_name,
          requester_user_id: requestRow.requester_user_id,
          requester_email: requestRow.requester_email,
        },
      });
      return res.status(200).json(data);
    }

    const organizationId = `org_${crypto.randomUUID()}`;

    const { data: organization, error: orgError } = await (ctx.supabase as any)
      .from("organizations")
      .insert({
        organization_id: organizationId,
        name: requestRow.company_name,
        industry_type: requestRow.industry_type ?? null,
        status: "active",
      })
      .select("*")
      .single();

    if (orgError) return res.status(500).json({ error: orgError.message });

    const requesterUserId =
      typeof requestRow.requester_user_id === "string"
        ? requestRow.requester_user_id
        : null;

    const requesterEmail =
      typeof requestRow.requester_email === "string"
        ? requestRow.requester_email
        : null;

    if (requesterUserId) {
      const { error: userUpdateError } = await (ctx.supabase as any)
        .from("users")
        .upsert(
          {
            user_id: requesterUserId,
            organization_id: organizationId,
            email: requesterEmail,
            role: "hr",
            is__active: true,
          },
          { onConflict: "user_id" }
        );

      if (userUpdateError) return res.status(500).json({ error: userUpdateError.message });
    }

    const { data: approvedRequest, error: requestUpdateError } = await (ctx.supabase as any)
      .from("organization_requests")
      .update({
        status: "approved",
        organization_id: organizationId,
        reviewed_at: new Date().toISOString(),
        reviewed_by: ctx.authUserId,
      })
      .eq("request_id", requestId)
      .select("*")
      .single();

    if (requestUpdateError)
      return res.status(500).json({ error: requestUpdateError.message });

    await writeAuditLog(ctx.supabase, {
      actorUserId: ctx.authUserId,
      organizationId,
      action: "company.approved",
      targetType: "organization_request",
      targetId: requestId,
      metadata: { company_name: requestRow.company_name },
    });
    await publishDomainEvent({
      supabase: ctx.supabase,
      organizationId,
      actorUserId: ctx.authUserId,
      eventType: "company.approved",
      aggregateType: "organization_request",
      aggregateId: requestId,
      payload: {
        company_name: requestRow.company_name,
        requester_user_id: requesterUserId,
        requester_email: requesterEmail,
      },
    });

    return res.status(200).json({
      request: approvedRequest,
      organization,
      message:
        "Request approved. Add an email/invitation service integration to notify the requester.",
    });
  } catch (error) {
    await reportError(error, {
      route: "api/organization-requests/[requestId]/decision",
    });
    return res.status(500).json({ error: "Failed to process approval decision" });
  }
}