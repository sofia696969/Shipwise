import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuthContext } from "@/lib/serverAuth";
import { writeAuditLog } from "@/lib/audit";
import { publishDomainEvent } from "@/lib/events";
import { reportError } from "@/lib/observability";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    const ctx = await requireAuthContext(req, res);
    if (!ctx) return;

    const event = req.body?.event;
    if (event !== "login") {
      return res.status(400).json({ error: "Unsupported auth event" });
    }

    await writeAuditLog(ctx.supabase, {
      actorUserId: ctx.authUserId,
      organizationId: ctx.user.organization_id,
      action: "auth.login",
      targetType: "user",
      targetId: ctx.authUserId,
      metadata: {
        user_agent: req.headers["user-agent"] ?? null,
      },
    });
    await publishDomainEvent({
      supabase: ctx.supabase,
      organizationId: ctx.user.organization_id,
      actorUserId: ctx.authUserId,
      eventType: "auth.login",
      aggregateType: "user",
      aggregateId: ctx.authUserId,
      payload: {
        user_agent: req.headers["user-agent"] ?? null,
      },
    });

    return res.status(204).end();
  } catch (error) {
    await reportError(error, { route: "api/auth/events" });
    return res.status(500).json({ error: "Failed to process auth event" });
  }
}
