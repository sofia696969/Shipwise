'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface ShipmentsDialogProps {
  carriers: any[];
}

export const ShipmentsDialog = ({ carriers }: ShipmentsDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState("");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                <SelectTrigger><SelectValue placeholder="Select carrier" /></SelectTrigger>
                <SelectContent>{carriers.length > 0 ? carriers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>) : <SelectItem value="">No carriers available</SelectItem>}</SelectContent>
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
  );
};
