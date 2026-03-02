'use client';

import { useEffect, useState } from "react";
import { getShipments, getCarriers } from "@/backend";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";

const Shipments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shipments, setShipments] = useState<any[]>([]);
  const [carriers, setCarriers] = useState<any[]>([]);

  useEffect(() => {
    getShipments().then(setShipments).catch(console.error);
    getCarriers().then(setCarriers).catch(console.error);
  }, []);

  const filtered = shipments.filter((s) => {
    const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) || s.origin.toLowerCase().includes(search.toLowerCase()) || s.destination.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shipments</h1>
          <p className="text-sm text-muted-foreground">Manage and track all shipments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create Shipment</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create New Shipment</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Origin</Label><Input placeholder="City, Country" /></div>
                <div><Label>Destination</Label><Input placeholder="City, Country" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Carrier</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select carrier" /></SelectTrigger>
                    <SelectContent>{carriers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Estimated Cost ($)</Label><Input type="number" placeholder="0.00" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>ETA</Label><Input type="date" /></div>
                <div><Label>Goods Type</Label><Input placeholder="e.g. Electronics" /></div>
              </div>
              <Button className="mt-2">Create Shipment</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Predicted ETA</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead className="text-right">Est. Cost</TableHead>
                <TableHead className="text-right">Delay %</TableHead>
                <TableHead className="text-right">Risk %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs font-medium">{s.id}</TableCell>
                  <TableCell className="text-sm">{s.origin}</TableCell>
                  <TableCell className="text-sm">{s.destination}</TableCell>
                  <TableCell><StatusBadge status={s.status as any} /></TableCell>
                  <TableCell className="text-sm">{s.eta}</TableCell>
                  <TableCell className="text-sm">{s.predicted_eta}</TableCell>
                  <TableCell className="text-sm">{s.carrier}</TableCell>
                  <TableCell className="text-right font-mono text-sm">${s.estimated_cost.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{s.delay_probability}%</TableCell>
                  <TableCell className="text-right font-mono text-sm">{s.risk_score}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shipments;
