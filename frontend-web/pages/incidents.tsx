import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getIncidents } from "@/backend";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";

const severityStyles: Record<string, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-rose-200 bg-rose-50 text-rose-800",
};

const Incidents = () => {
  const { user, appUser, loading, roleResolved } = useAuth();
  const router = useRouter();
  const [incidents, setIncidents] = useState<any[]>([]);

  const { allowed } = usePagePermission({
    loading,
    roleResolved,
    isAuthenticated: Boolean(user),
    user: appUser,
    requiredPermission: PERMISSIONS.OPERATIONS_PORTAL_ACCESS,
  });

  useEffect(() => {
    if (!user || !allowed) {
      return;
    }

    getIncidents().then(setIncidents).catch(console.error);
  }, [allowed, user]);

  return (
    <AppLayout>
      <div className="space-y-6 p-5 lg:p-8">
        <section className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <h1 className="text-3xl font-black text-slate-950">Incidents</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review reported shipment issues so staff can respond quickly to delays,
            damages, customs blockers, and operational exceptions.
          </p>
        </section>

        <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Incident register</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident ID</TableHead>
                  <TableHead>Shipment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Reported At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                      No incidents found in Supabase yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  incidents.map((incident) => (
                    <TableRow key={incident.incident_id}>
                      <TableCell className="font-mono text-xs">{incident.incident_id}</TableCell>
                      <TableCell className="font-mono text-xs">{incident.shipment_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {incident.incident_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[340px] text-sm text-slate-700">
                        {incident.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize ${severityStyles[incident.severity] ?? severityStyles.medium}`}
                        >
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.reported_by ?? "Unknown"}</TableCell>
                      <TableCell>
                        {incident.reported_at
                          ? new Date(incident.reported_at).toLocaleString()
                          : "Unknown"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Incidents;
