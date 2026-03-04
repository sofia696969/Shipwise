'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export const CarriersDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Carrier</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add New Carrier</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div><Label>Carrier Name</Label><Input placeholder="Enter carrier name" /></div>
          <div><Label>Country</Label><Input placeholder="Country of operation" /></div>
          <div><Label>Reliability Score (0-100)</Label><Input type="number" min="0" max="100" placeholder="85" /></div>
          <Button className="mt-2">Add Carrier</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
