import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getAuditLogs } from "@/backend";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";
import { ShipwiseLogo } from "@/components/ShipwiseLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SuperadminAuditLogsPage() {
  const { user, appUser, loading, roleResolved } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { allowed } = usePagePermission({
    loading,
    roleResolved,
    isAuthenticated: Boolean(user),
    user: appUser,
    requiredPermission: PERMISSIONS.SUPERADMIN_PORTAL_ACCESS,
  });

  useEffect(() => {
    if (!allowed || !user) return;
    getAuditLogs()
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load audit logs"));
  }, [allowed, user]);

  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <ShipwiseLogo compact />
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
              <Link href="/superadmin/requests">Requests</Link>
            </Button>
            <Button asChild variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
              <Link href="/dashboard">Portal</Link>
            </Button>
          </div>
        </header>

        <Card className="mt-10 border-white/10 bg-white/[0.04] text-slate-100">
          <CardHeader>
            <CardTitle>Audit logs</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}
            {logs.length === 0 ? (
              <p className="text-sm text-slate-400">No audit logs found.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <article
                    key={log.audit_log_id ?? `${log.action}-${log.created_at}`}
                    className="rounded-lg border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{log.action}</p>
                    <p className="mt-1 text-xs text-slate-300">
                      Actor: {log.actor_user_id ?? "unknown"} · Target: {log.target_type ?? "entity"} / {log.target_id ?? "unknown"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : "Unknown timestamp"}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
