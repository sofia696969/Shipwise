import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getNotifications } from "@/backend";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const { user, appUser, loading, roleResolved } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { allowed } = usePagePermission({
    loading,
    roleResolved,
    isAuthenticated: Boolean(user),
    user: appUser,
    requiredPermission: PERMISSIONS.NOTIFICATIONS_READ,
  });

  useEffect(() => {
    if (!allowed || !user) return;
    getNotifications()
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load notifications"));
  }, [allowed, user]);

  return (
    <AppLayout>
      <div className="space-y-6 p-5 lg:p-8">
        <section className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <h1 className="text-3xl font-black text-slate-950">Notifications</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Organization updates, approvals, invites, and shipment status notifications.
          </p>
        </section>

        <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-cyan-500" />
              Recent notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-500">No notifications found.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((item) => (
                  <article key={item.notification_id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <Badge variant="outline">{item.status ?? "pending"}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "Unknown timestamp"}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
