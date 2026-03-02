'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getShipments, getCarriers } from "@/backend";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { alerts } from "@/data/mockData";
import { Ship, AlertTriangle, ShieldAlert, DollarSign, Bell } from "lucide-react";

const DashboardCharts = dynamic(() => import("@/components/DashboardCharts"), { ssr: false });

const alertIconMap = { warning: "⚠️", error: "🚨", info: "ℹ️" };
const pieColors = ["hsl(200, 98%, 39%)", "hsl(0, 72%, 50%)", "hsl(215, 16%, 46%)"];

const Dashboard = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);

  useEffect(() => {
    getShipments().then(setShipments).catch(console.error);
    getCarriers().then(setCarriers).catch(console.error);
  }, []);

  const activeCount = shipments.length;
  const delayedCount = shipments.filter((s) => s.status === "delayed").length;
  const atRiskCount = shipments.filter((s) => s.status === "at-risk").length;
  const totalCost = shipments.reduce((sum, s) => sum + s.estimated_cost, 0);

  const carrierData = carriers.slice(0, 5).map((c) => ({ name: c.name, score: c.reliability_score }));
  const statusData = [
    { name: "On Time", value: shipments.filter((s) => s.status === "on-time").length },
    { name: "Delayed", value: delayedCount },
    { name: "At Risk", value: atRiskCount },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your shipping operations</p>
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
            {alerts.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-md border border-border bg-accent/50 p-3">
                <span className="text-sm">{alertIconMap[a.type]}</span>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{a.message}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
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
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Delay %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.slice(0, 5).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="text-xs">{s.origin.split(",")[0]} → {s.destination.split(",")[0]}</TableCell>
                    <TableCell><StatusBadge status={s.status as any} /></TableCell>
                    <TableCell className="text-right font-mono text-xs">{s.delay_probability}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
