import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { getCarriers, getShipments } from "@/backend";
import { usePagePermission } from "@/hooks/usePagePermission";
import { PERMISSIONS } from "@/lib/rbac";

const Shipments = () => {
  const { user, appUser, loading, roleResolved } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shipments, setShipments] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);

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
  }, [allowed, user]);

  const carrierLookup = useMemo(
    () => new Map(carriers.map((carrier) => [carrier.carrier_id, carrier.name])),
    [carriers]
  );

  const filtered = shipments.filter((shipment) => {
    const needle = search.toLowerCase();
    const matchesSearch =
      (shipment.shipment_id?.toLowerCase() ?? "").includes(needle) ||
      (shipment.origin_country?.toLowerCase() ?? "").includes(needle) ||
      (shipment.destination_country?.toLowerCase() ?? "").includes(needle);
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6 p-5 lg:p-8">
        <section className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <h1 className="text-3xl font-black text-slate-950">Shipments</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review staff-entered shipments, monitor route progress, and keep planned
            delivery windows visible for the whole team.
          </p>
        </section>

        <Card className="border-white/70 bg-white/85 shadow-lg shadow-slate-200/40 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by shipment, origin, or destination"
                  className="h-11 rounded-xl border-slate-200 pl-9"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 lg:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Planned ETA</TableHead>
                  <TableHead>Actual ETA</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-sm text-slate-500">
                      {shipments.length === 0 ? "No shipments found in Supabase yet." : "No shipments match the current filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((shipment) => (
                    <TableRow key={shipment.shipment_id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {shipment.shipment_id}
                      </TableCell>
                      <TableCell>{shipment.origin_country}</TableCell>
                      <TableCell>{shipment.destination_country}</TableCell>
                      <TableCell>{carrierLookup.get(shipment.carrier_id) ?? shipment.carrier_id ?? "Unassigned"}</TableCell>
                      <TableCell>
                        <StatusBadge status={shipment.status ?? "pending"} />
                      </TableCell>
                      <TableCell>
                        {shipment.planned_eta
                          ? new Date(shipment.planned_eta).toLocaleDateString()
                          : "Not set"}
                      </TableCell>
                      <TableCell>
                        {shipment.actual_eta
                          ? new Date(shipment.actual_eta).toLocaleDateString()
                          : "Pending"}
                      </TableCell>
                      <TableCell>
                        {shipment.created_at
                          ? new Date(shipment.created_at).toLocaleDateString()
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

export default Shipments;
