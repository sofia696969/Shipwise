import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { getShipments, getCarriers } from "@/backend";
import { StatusBadge } from "@/components/StatusBadge";
import { ShipmentsDialog } from "@/components/ShipmentsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const Shipments = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shipments, setShipments] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getShipments().then(setShipments).catch(console.error);
      getCarriers().then(setCarriers).catch(console.error);
    }
  }, [user]);

  const filtered = shipments.filter((s) => {
    const matchesSearch = 
      (s.id?.toLowerCase() ?? "").includes(search.toLowerCase()) || 
      (s.origin?.toLowerCase() ?? "").includes(search.toLowerCase()) || 
      (s.destination?.toLowerCase() ?? "").includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const content = (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shipments</h1>
          <p className="text-sm text-muted-foreground">Manage and track all shipments</p>
        </div>
        <ShipmentsDialog carriers={carriers} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search shipments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-time">On Time</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Origin County</TableHead>
                <TableHead>Destination Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Planned ETA</TableHead>
                <TableHead>Actual ETA</TableHead>
                <TableHead>Est. Cost</TableHead>
                <TableHead className="text-right">Actual Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs font-medium">{s.id}</TableCell>
                    <TableCell className="text-sm">{s.origin_county || "-"}</TableCell>
                    <TableCell className="text-sm">{s.destination_country || "-"}</TableCell>
                    <TableCell><StatusBadge status={(s.status || "pending") as any} /></TableCell>
                    <TableCell className="text-sm">{s.planned_eta ? new Date(s.planned_eta).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-sm">{s.actual_eta ? new Date(s.actual_eta).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-right font-mono text-sm">${(s.estimated_cost || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">${(s.actual_cost || 0).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    {shipments.length === 0 ? "No shipments found" : "No matches for your search"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return <AppLayout>{content}</AppLayout>;
};

export default Shipments;
