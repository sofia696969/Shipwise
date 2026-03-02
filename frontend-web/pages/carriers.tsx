'use client';

import { useEffect, useState } from "react";
import { getCarriers } from "@/backend";
import StatusBadge from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";

const Carriers = () => {
  const [carriers, setCarriers] = useState<any[]>([]);

  useEffect(() => {
    getCarriers().then(setCarriers).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carrier Management</h1>
          <p className="text-sm text-muted-foreground">Manage carriers and view performance</p>
        </div>
        <Dialog>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Carrier</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Carrier</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div><Label>Carrier Name</Label><Input placeholder="e.g. Maersk" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Reliability Score</Label><Input type="number" placeholder="0-100" /></div>
                <div><Label>Avg. Cost ($)</Label><Input type="number" placeholder="0" /></div>
              </div>
              <Button className="mt-2">Add Carrier</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {carriers.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{c.name}</CardTitle>
                <StatusBadge status={c.status as any} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Reliability</span>
                  <span className="font-mono font-medium text-foreground">{c.reliability_score}%</span>
                </div>
                <Progress value={c.reliability_score} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">On-Time Rate</span><p className="font-mono font-medium text-foreground">{c.on_time_rate}%</p></div>
                <div><span className="text-muted-foreground">Total Shipments</span><p className="font-mono font-medium text-foreground">{c.total_shipments}</p></div>
                <div><span className="text-muted-foreground">Avg. Cost</span><p className="font-mono font-medium text-foreground">${c.avg_cost.toLocaleString()}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Carriers;
