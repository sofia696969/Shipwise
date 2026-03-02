'use client';

import { useEffect, useState } from "react";
import { getGoods } from "@/backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Search } from "lucide-react";

const Goods = () => {
  const [search, setSearch] = useState("");
  const [goods, setGoods] = useState<any[]>([]);

  useEffect(() => {
    getGoods().then(setGoods).catch(console.error);
  }, []);
  const filtered = goods.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()) || g.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Goods Management</h1>
          <p className="text-sm text-muted-foreground">Manage goods and link to shipments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Goods</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Goods</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label>Name</Label><Input placeholder="Goods name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {["Electronics", "Food", "Chemicals", "Machinery", "Textiles"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Industry</Label><Input placeholder="e.g. Technology" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Weight (kg)</Label><Input type="number" placeholder="0" /></div>
                <div><Label>Volume (m³)</Label><Input type="number" placeholder="0" /></div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch id="fragile" /><Label htmlFor="fragile">Fragile</Label></div>
                <div className="flex items-center gap-2"><Switch id="hazardous" /><Label htmlFor="hazardous">Hazardous</Label></div>
              </div>
              <Button className="mt-2">Add Goods</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search goods..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Volume (m³)</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Shipment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-mono text-xs">{g.id}</TableCell>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell>{g.type}</TableCell>
                  <TableCell className="font-mono">{g.weight.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{g.volume}</TableCell>
                  <TableCell className="space-x-1">
                    {g.fragile && <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/30 text-xs">Fragile</Badge>}
                    {g.hazardous && <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">Hazardous</Badge>}
                    {!g.fragile && !g.hazardous && <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>{g.industry}</TableCell>
                  <TableCell className="font-mono text-xs">{g.shipment_id || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goods;
