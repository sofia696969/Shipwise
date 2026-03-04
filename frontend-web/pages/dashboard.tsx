import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import dynamic from "next/dynamic";
import { getShipments, getCarriers, getIncidents } from "@/backend";
import StatCard from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ship, AlertTriangle, ShieldAlert, DollarSign, Bell } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"), { ssr: false });

const alertIconMap: Record<string, string> = {
  low: "ℹ️",
  medium: "⚠️",
  high: "🚨",
  info: "ℹ️",
  warning: "⚠️",
  error: "🚨",
};

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [shipments, setShipments] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      console.log('Fetching data for user:', user.id);
      getShipments()
        .then((data) => {
          console.log('Shipments loaded:', data);
          setShipments(data);
        })
        .catch((err) => {
          console.error('Shipments fetch error:', err);
          setShipments([]);
        });
      getCarriers()
        .then((data) => {
          console.log('Carriers loaded:', data);
          setCarriers(data);
        })
        .catch((err) => {
          console.error('Carriers fetch error:', err);
          setCarriers([]);
        });
      getIncidents()
        .then((data) => {
          console.log('Incidents loaded:', data);
          setIncidents(data);
        })
        .catch((err) => {
          console.error('Incidents fetch error:', err);
          setIncidents([]);
        });
    }
  }, [user]);

  const activeCount = shipments.length;
  const delayedCount = shipments.filter((s) => s.status === "delayed").length;
  const atRiskCount = shipments.filter((s) => s.status === "at-risk").length;
  const totalCost = shipments.reduce((sum, s) => sum + (s.estimated_cost || 0), 0);

  const carrierData = carriers.slice(0, 5).map((c) => ({ name: c.name, score: c.reliability_score }));
  const statusData = [
    { name: "Pending", value: shipments.filter((s) => s.status === "pending").length },
    { name: "In Transit", value: shipments.filter((s) => s.status === "in_transit").length },
    { name: "Delivered", value: shipments.filter((s) => s.status === "delivered").length },
    { name: "Delayed", value: delayedCount },
  ];

  const dashboardContent = (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your shipping operations</p>
        </div>
        <button
          onClick={() => signOut().catch(console.error)}
          className="text-sm text-primary hover:underline"
        >
          Sign Out
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Shipments" value={activeCount} icon={Ship} trend={{ value: "+3 this week", positive: true }} />
        <StatCard title="Delayed Shipments" value={delayedCount} icon={AlertTriangle} subtitle="ML flagged" trend={{ value: "+1 from yesterday", positive: false }} />
        <StatCard title="High-Risk Shipments" value={atRiskCount} icon={ShieldAlert} subtitle="Customs/compliance" />
        <StatCard title="Total Shipping Cost" value={`$${totalCost.toLocaleString()}`} icon={DollarSign} subtitle="Current period" trend={{ value: "-2.3% vs last period", positive: true }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCharts carrierData={carrierData} statusData={statusData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" /> ML-Powered Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidents.length > 0 ? (
              incidents.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-md border border-border bg-accent/50 p-3">
                  <span className="text-sm">{alertIconMap[a.severity ?? a.type ?? "info"]}</span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{a.description ?? a.message ?? a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.created_at ? new Date(a.created_at).toLocaleString() : (a.time ?? "")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No alerts at the moment</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.slice(0, 5).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="text-xs">{(s.origin_county ?? "")}</TableCell>
                    <TableCell className="text-xs">{(s.destination_country ?? "")}</TableCell>
                    <TableCell><StatusBadge status={s.status as any} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return <AppLayout>{dashboardContent}</AppLayout>;
};

export default Dashboard;