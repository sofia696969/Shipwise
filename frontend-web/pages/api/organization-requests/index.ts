import type { NextApiRequest, NextApiResponse } from "next";
import { PERMISSIONS, requireApiPermission } from "@/lib/rbac";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const guarded = await requireApiPermission(
        req,
        res,
        PERMISSIONS.ORGANIZATION_REQUESTS_READ,
      );
      if (!guarded) return;
      const { ctx } = guarded;

      const { data, error } = await (ctx.supabase as any)
        .from("organization_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data ?? []);
    }

    if (req.method === "POST") {
      const guarded = await requireApiPermission(
        req,
        res,
        PERMISSIONS.ORGANIZATION_REQUESTS_SUBMIT,
      );
      if (!guarded) return;
      const { ctx } = guarded;

      const { company_name, industry_type } = req.body ?? {};
      if (!company_name || typeof company_name !== "string") {
        return res.status(400).json({ error: "company_name is required" });
      }

      const payload = {
        request_id: crypto.randomUUID(),
        requester_user_id: ctx.authUserId,
        requester_email: ctx.user.email,
        requester_name: ctx.user.email?.split("@")[0] ?? "requester",
        company_name,
        industry_type: typeof industry_type === "string" ? industry_type : null,
        status: "pending",
      };

      const { data, error } = await (ctx.supabase as any)
        .from("organization_requests")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        return res.status(500).json({
          error: error.message,
          hint:
            "Make sure table organization_requests exists with columns: request_id, requester_user_id, requester_email, requester_name, company_name, industry_type, status, created_at.",
        });
      }

      return res.status(201).json(data);
    }

    res.setHeader("Allow", "GET,POST");
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Organization requests API error:", error);
    return res.status(500).json({ error: "Failed to process organization request" });
  }
}
