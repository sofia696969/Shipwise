type AuditAction =
  | "company.approved"
  | "company.rejected"
  | "user.created"
  | "user.role_changed"
  | "shipment.created"
  | "shipment.updated"
  | "auth.login";

type AuditPayload = {
  actorUserId: string;
  organizationId?: string | null;
  action: AuditAction;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function writeAuditLog(
  supabase: any,
  {
    actorUserId,
    organizationId = null,
    action,
    targetType = null,
    targetId = null,
    metadata = {},
  }: AuditPayload,
) {
  const { error } = await supabase.from("audit_logs").insert({
    actor_user_id: actorUserId,
    organization_id: organizationId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata,
  });

  if (error) {
    console.error("Failed to write audit log:", error.message);
  }
}
