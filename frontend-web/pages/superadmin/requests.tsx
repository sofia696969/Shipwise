import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Check, X } from "lucide-react";
import { getOrganizationRequests, decideOrganizationRequest } from "@/backend";
import { useAuth } from "@/contexts/AuthContext";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShipwiseLogo } from "@/components/ShipwiseLogo";

type OrgRequest = {
  request_id: string;
  requester_email: string | null;
  company_name: string;
  industry_type: string | null;
  status: string;
  created_at: string | null;
};

export default function SuperadminRequestsPage() {
  const router = useRouter();
  const { user, appUser, loading, roleResolved } = useAuth();
  const [requests, setRequests] = useState<OrgRequest[]>([]);
  const [busyRequestId, setBusyRequestId] = useState<string | null>(null);
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
    getOrganizationRequests()
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load requests")
      );
  }, [allowed, user]);

  const decide = async (
    requestId: string,
    decision: "approved" | "rejected"
  ) => {
    setBusyRequestId(requestId);
    setError(null);

    try {
      await decideOrganizationRequest(requestId, decision);
      setRequests((current) =>
        current.map((request) =>
          request.request_id === requestId
            ? { ...request, status: decision }
            : request
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to apply decision");
    } finally {
      setBusyRequestId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <ShipwiseLogo compact />
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/superadmin/audit-logs">Audit logs</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/dashboard">Back to portal</Link>
            </Button>
          </div>
        </header>

        <Card className="mt-10 border-white/10 bg-white/[0.04] text-slate-100">
          <CardHeader>
            <CardTitle>Organization access requests</CardTitle>
            <p className="text-sm text-slate-300">
              Approve to create organization and assign requester as HR owner
              (HR).
            </p>
          </CardHeader>

          <CardContent>
            {error ? (
              <p className="mb-4 text-sm text-rose-300">{error}</p>
            ) : null}

            {requests.length === 0 ? (
              <p className="text-sm text-slate-400">No requests found.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <article
                    key={request.request_id}
                    className="rounded-lg border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {request.company_name}
                        </p>
                        <p className="text-sm text-slate-300">
                          {request.industry_type ?? "Industry not provided"} ·{" "}
                          {request.requester_email ?? "No requester email"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {request.created_at
                            ? new Date(request.created_at).toLocaleString()
                            : "Unknown submitted date"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="capitalize text-slate-200"
                        >
                          {request.status}
                        </Badge>

                        {request.status === "pending" ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              disabled={busyRequestId === request.request_id}
                              onClick={() => decide(request.request_id, "approved")}
                              className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              disabled={busyRequestId === request.request_id}
                              className="bg-rose-400 text-slate-950 hover:bg-rose-300"
                              onClick={() => decide(request.request_id, "rejected")}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>
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