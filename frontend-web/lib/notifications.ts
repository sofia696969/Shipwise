type NotificationChannel = "in_app" | "email";

type QueueNotificationInput = {
  supabase: any;
  organizationId?: string | null;
  recipientUserId?: string | null;
  recipientEmail?: string | null;
  type:
    | "organization.approved"
    | "organization.rejected"
    | "user.invited"
    | "shipment.status_updated";
  title: string;
  body: string;
  channels?: NotificationChannel[];
  metadata?: Record<string, unknown>;
};

export async function queueNotification({
  supabase,
  organizationId = null,
  recipientUserId = null,
  recipientEmail = null,
  type,
  title,
  body,
  channels = ["in_app"],
  metadata = {},
}: QueueNotificationInput) {
  if (!recipientUserId && !recipientEmail) return;

  const { error } = await supabase.from("notification_outbox").insert({
    organization_id: organizationId,
    recipient_user_id: recipientUserId,
    recipient_email: recipientEmail,
    type,
    title,
    body,
    channels,
    metadata,
    status: "pending",
  });

  if (error) {
    console.error("Failed to queue notification:", error.message);
  }
}
