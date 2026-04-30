export type DomainEventType =
  | "company.approved"
  | "company.rejected"
  | "user.created"
  | "user.role_changed"
  | "shipment.created"
  | "shipment.updated"
  | "auth.login";

type PublishDomainEventInput = {
  supabase: any;
  organizationId?: string | null;
  actorUserId?: string | null;
  eventType: DomainEventType;
  aggregateType?: string | null;
  aggregateId?: string | null;
  payload?: Record<string, unknown>;
};

export async function publishDomainEvent({
  supabase,
  organizationId = null,
  actorUserId = null,
  eventType,
  aggregateType = null,
  aggregateId = null,
  payload = {},
}: PublishDomainEventInput) {
  const { error } = await supabase.from("domain_events").insert({
    organization_id: organizationId,
    actor_user_id: actorUserId,
    event_type: eventType,
    aggregate_type: aggregateType,
    aggregate_id: aggregateId,
    payload,
    status: "pending",
  });

  if (error) {
    console.error("Failed to publish domain event:", error.message);
  }
}
