import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  AlertTriangle,
  Boxes,
  Clock3,
  DollarSign,
  LogOut,
  ShieldAlert,
  Truck,
} from "lucide-react";
import dynamic from "next/dynamic";
import { AppLayout } from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getAuditLogs, getCarriers, getIncidents, getShipments } from "@/backend";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";

const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"), { ssr: false });

const Dashboard = () => {
  const { user, appUser, organization, loading, roleResolved, signOut } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

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

    getShipments().then(setShipments).catch(console.error);
    getCarriers().then(setCarriers).catch(console.error);
    getIncidents().then(setIncidents).catch(console.error);
    getAuditLogs().then(setLogs).catch(() => setLogs([]));
  }, [allowed, user]);

  const delayedShipments = shipments.filter((shipment) => shipment.status === "delayed");
  const deliveredShipments = shipments.filter((shipment) => shipment.status === "delivered");
  const inTransitShipments = shipments.filter((shipment) => shipment.status === "in_transit");

  const avgDelay = useMemo(() => {
    if (carriers.length === 0) return 0;
    const total = carriers.reduce(
      (sum, carrier) => sum + Number(carrier.average_delay_days ?? 0),
      0
    );
    return total / carriers.length;
  }, [carriers]);

  const carrierData = carriers.slice(0, 5).map((carrier) => ({
    name: carrier.name,
    score: Number(carrier.relability_score ?? 0),
  }));

  const statusData = [
    { name: "Pending", value: shipments.filter((shipment) => shipment.status === "pending").length },
    { name: "In Transit", value: inTransitShipments.length },
    { name: "Delivered", value: deliveredShipments.length },
    { name: "Delayed", value: delayedShipments.length },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 p-5 lg:p-8">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.92)_55%,rgba(125,211,252,0.82))] px-6 py-7 text-white shadow-xl shadow-blue-950/15">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/70">
                Operations Overview
              </p>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                {organization?.name ?? "ShipWise"} dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base">
                Track staff-entered shipment activity, carrier performance, and incident flow
                across your organization.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-blue-100/65">Logged in as</p>
                <p className="mt-2 text-sm font-semibold">{appUser?.email ?? "Staff account"}</p>
                <p className="text-xs text-blue-100/75">{appUser?.role ?? "Awaiting role"}</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => signOut().then(() => router.replace("/auth")).catch(console.error)}
                className="rounded-2xl border border-white/15 bg-white/10 text-white hover:bg-white/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Shipments" value={shipments.length} icon={Boxes} subtitle="Current organization workload" />
          <StatCard title="In Transit" value={inTransitShipments.length} icon={Truck} subtitle="Actively moving right now" />
          <StatCard title="Reported Incidents" value={incidents.length} icon={ShieldAlert} subtitle="All severities combined" />
          <StatCard title="Average Delay" value={`${avgDelay.toFixed(1)} days`} icon={Clock3} subtitle="Across listed carriers" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <DashboardCharts carrierData={carrierData} statusData={statusData} />

          <Card className="border-white/70 bg-white/80 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Incident Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {incidents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No incidents reported yet.</p>
              ) : (
                incidents.slice(0, 5).map((incident) => (
                  <div
                    key={incident.incident_id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {incident.incident_type}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{incident.description}</p>
                      </div>
                      <StatusBadge status={incident.severity ?? "medium"} />
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Shipment {incident.shipment_id} • {incident.reported_at ? new Date(incident.reported_at).toLocaleString() : "No timestamp"}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Planned ETA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.slice(0, 6).map((shipment) => (
                    <TableRow key={shipment.shipment_id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {shipment.shipment_id}
                      </TableCell>
                      <TableCell>{shipment.origin_country}</TableCell>
                      <TableCell>{shipment.destination_country}</TableCell>
                      <TableCell>
                        <StatusBadge status={shipment.status ?? "pending"} />
                      </TableCell>
                      <TableCell>
                        {shipment.planned_eta
                          ? new Date(shipment.planned_eta).toLocaleDateString()
                          : "Not scheduled"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No log entries were returned from the `logs` table yet.
                </p>
              ) : (
                logs.slice(0, 5).map((log) => (
                  <div key={log.log_id} className="border-l-2 border-blue-200 pl-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {log.action} {log.target_type ?? "entity"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Entity {log.target_id ?? "unknown"} •{" "}
                      {new Date(log.created_at ?? log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
